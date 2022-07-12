import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import type { SessionLineItemDto } from './session-line-item.dto';
import { WebExtraConfigDto } from './web-extra-config.dto';

export class CreateCheckoutSessionDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Danh sách sản phẩm không được bỏ trống!' })
    datas: SessionLineItemDto[];

    @ApiProperty()
    webExtraConfig: WebExtraConfigDto;
}
