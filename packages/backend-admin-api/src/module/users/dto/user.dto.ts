import { ApiProperty } from '@nestjs/swagger';

import { BaseDto } from '../../../common/dto/base.dto';

export class UserDto extends BaseDto {
    @ApiProperty()
    username: string;

    @ApiProperty()
    avatar: string;
}
