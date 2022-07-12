import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

import { ValidationMessage } from './../../../constant/enum/error-message.enum';

export class AuthorBookCreateDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty({ message: `Id tác giả ${ValidationMessage.EMPTY}` })
    @Transform((value) => `${value}`.trim())
    authorId: number;

    @ApiProperty()
    @IsArray()
    @IsNotEmpty({ message: `Danh sách mã ISBN sách ${ValidationMessage.EMPTY}` })
    bookIds: string[];
}
