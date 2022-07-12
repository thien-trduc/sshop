import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { PageResponseDto } from '../../common/dto/page-response.dto';
import { MessagePageOptionsDto } from './dto/message-page-options.dto';
import { MessageEventService } from './message-event.service';
import type { MessageEventModel } from './model/message-event.model';

@Controller('message-event')
@ApiTags('Message Event')
export class MessageEventController {
    constructor(private readonly service: MessageEventService) {}

    @Get('page')
    page(@Query() query: MessagePageOptionsDto): Promise<PageResponseDto<MessageEventModel>> {
        return this.service.page(query);
    }

    @Get(':id')
    getById(@Param('id') id: number): Promise<MessageEventModel> {
        return this.service.getById(id);
    }

    // @Post('publish')
    // async publishByCount(@Query('count') count: number): Promise<void> {
    //     return this.service.publishByCount(Number(count));
    // }

    // @Get('publish-one-signal')
    // async pushNotification(): Promise<any> {
    //     return this.service.pushNotification();
    // }
}
