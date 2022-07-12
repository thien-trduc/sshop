import { catchError, lastValueFrom, map, Observable, tap, throwError } from 'rxjs';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ErrorMessage } from '../constant/enum/error-message.enum';

@Injectable()
export class ClientUtilService {
    constructor(private readonly http: HttpService) {}

    async get<T = any>(api: string, headers?: any): Promise<T> {
        let response: any;
        try {
            response = await lastValueFrom(
                this.http.get<T>(api, {
                    headers,
                }),
            );
        } catch (error: any) {
            Logger.error(`Error when exec get()\nError: ${error.message || error?.response.data.message}`);
            const errorMessage = error?.response.data.message || ErrorMessage.BAD_REQUEST;
            const statusCode = error?.status || HttpStatus.BAD_REQUEST;
            throw new HttpException(errorMessage, statusCode);
        }
        if (response.status < 200 || response.status >= 400 || !response?.data) {
            throw new HttpException(ErrorMessage.BAD_REQUEST, response.status);
        }
        return response.data;
    }

    async post<T = any>(api: string, formData?: any, headers?: any): Promise<T> {
        let response: any;
        try {
            response = await lastValueFrom(
                this.http.post<T>(api, formData, {
                    headers,
                }),
            );
        } catch (error: any) {
            Logger.error(`Error when exec post()\nError: ${error.message || error?.response.data.message}`);
            const errorMessage = error?.response.data.message || ErrorMessage.BAD_REQUEST;
            const statusCode = error?.status || HttpStatus.BAD_REQUEST;
            throw new HttpException(errorMessage, statusCode);
        }
        if (response.status < 200 || response.status >= 400 || !response?.data) {
            throw new HttpException(ErrorMessage.BAD_REQUEST, response.status);
        }
        return response.data;
    }

    async put<T = any>(api: string, formData?: any, headers?: any): Promise<T> {
        let response: any;
        try {
            response = await lastValueFrom(
                this.http.put<T>(api, formData, {
                    headers,
                }),
            );
        } catch (error: any) {
            Logger.error(`Error when exec put()\nError: ${error.message || error?.response.data.message}`);
            const errorMessage = error?.response.data.message || ErrorMessage.BAD_REQUEST;
            const statusCode = error?.status || HttpStatus.BAD_REQUEST;
            throw new HttpException(errorMessage, statusCode);
        }
        if (response.status < 200 || response.status >= 400 || !response?.data) {
            throw new HttpException(ErrorMessage.BAD_REQUEST, response.status);
        }
        return response.data;
    }

    async patch<T = any>(api: string, formData?: any, headers?: any): Promise<T> {
        let response: any;
        try {
            response = await lastValueFrom(
                this.http.patch<T>(api, formData, {
                    headers,
                }),
            );
        } catch (error: any) {
            Logger.error(`Error when exec patch()\nError: ${error.message || error?.response.data.message}`);
            const errorMessage = error?.response.data.message || ErrorMessage.BAD_REQUEST;
            const statusCode = error?.status || HttpStatus.BAD_REQUEST;
            throw new HttpException(errorMessage, statusCode);
        }
        if (response.status < 200 || response.status >= 400 || !response?.data) {
            throw new HttpException(ErrorMessage.BAD_REQUEST, response.status);
        }
        return response.data;
    }

    async delete<T = any>(api: string, formData?: any, headers?: any): Promise<T> {
        let response: any;
        try {
            response = await lastValueFrom(
                this.http.delete<T>(api, {
                    headers,
                }),
            );
        } catch (error: any) {
            Logger.error(`Error when exec delete()\nError: ${error.message || error?.response.data.message}`);
            const errorMessage = error?.response.data.message || ErrorMessage.BAD_REQUEST;
            const statusCode = error?.status || HttpStatus.BAD_REQUEST;
            throw new HttpException(errorMessage, statusCode);
        }
        if (response.status < 200 || response.status >= 400 || !response?.data) {
            throw new HttpException(ErrorMessage.BAD_REQUEST, response.status);
        }
        return response.data;
    }
}
