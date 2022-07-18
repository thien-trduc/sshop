/* eslint-disable @typescript-eslint/no-use-before-define */
import { Logger } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import * as jaegerClient from 'jaeger-client';
import * as opentracing from 'opentracing';

import { ConfigsService } from './shared/service/configs.service';
import { SharedModule } from './shared/shared.module';

export function setupTracing(app: NestExpressApplication): void {
    const configService = app.select(SharedModule).get(ConfigsService);
    const serviceName = configService.repoName;

    // Initialize the Tracer
    const tracer = initTracer(serviceName);
    opentracing.initGlobalTracer(tracer);

    app.use(unless(['/api/metrics'], tracingMiddleWare));
}

function initTracer(serviceName) {
    const logger = new Logger();

    const initTracer1 = jaegerClient.initTracer;

    // See schema https://github.com/jaegertracing/jaeger-client-node/blob/master/src/configuration.js#L37
    const config = {
        serviceName,
        reporter: {
            logSpans: true,
            agentHost: 'jaeger',
            agentPort: 6832,
        },
        sampler: {
            type: 'probabilistic',
            param: 1,
        },
    };

    const options = {
        logger: {
            info: function logInfo(msg) {
                logger.log('INFO', msg);
            },
            error: function logError(msg) {
                logger.log('ERROR', msg);
            },
        },
    };

    return initTracer1(config, options);
}

const unless = (paths, middleware) => (req, res, next) => {
    const ignoreTracing = new Set([...paths]);

    if (ignoreTracing.has(req.path)) {
        return next();
    }

    return middleware(req, res, next);
};

function tracingMiddleWare(req, res, next) {
    const tracer = opentracing.globalTracer();
    const wireCtx = tracer.extract(opentracing.FORMAT_HTTP_HEADERS, req.headers);
    // Creating our span with context from incoming request
    const span = tracer.startSpan(req.path, { childOf: wireCtx });
    // Use the log api to capture a log
    span.log({ event: 'request_received' });
    // Use the setTag api to capture standard span tags for http traces
    span.setTag(opentracing.Tags.HTTP_METHOD, req.method);
    span.setTag(opentracing.FORMAT_HTTP_HEADERS, req.headers);
    span.setTag(opentracing.Tags.SPAN_KIND, opentracing.Tags.SPAN_KIND_RPC_SERVER);
    span.setTag(opentracing.Tags.HTTP_URL, req.path);

    // include trace ID in headers so that we can debug slow requests we see in
    // the browser by looking up the trace ID found in response headers
    const responseHeaders = {};
    tracer.inject(span, opentracing.FORMAT_HTTP_HEADERS, responseHeaders);
    res.set(responseHeaders);

    // add the span to the request object for any other handler to use the span
    Object.assign(req, { span });

    // finalize the span when the response is completed
    const finishSpan = () => {
        if (res.statusCode >= 400) {
            // Force the span to be collected for http errors
            span.setTag(opentracing.Tags.SAMPLING_PRIORITY, 1);
            // If error then set the span to error
            span.setTag(opentracing.Tags.ERROR, true);

            // Response should have meaning info to futher troubleshooting
            span.log({ event: 'error', message: res?.statusMessage || req?.message });
        }

        // Capture the status code
        span.setTag(opentracing.Tags.HTTP_STATUS_CODE, res.statusCode);
        span.log({ body: req.body });
        span.log({ event: 'request_end' });
        span.finish();
    };

    res.on('finish', finishSpan);
    next();
}
