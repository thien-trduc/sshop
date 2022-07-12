import { ApiProperty } from '@nestjs/swagger';

import { PageResponseDto } from './../../../common/dto/page-response.dto';
import type { CartItemDto } from './cart-item.dto';

export class CartDetailDto extends PageResponseDto<CartItemDto> {
    @ApiProperty()
    validInfo?: any;
}
