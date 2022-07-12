import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsUrl, ValidateIf } from 'class-validator';

export class WebExtraConfigDto {
    @ApiProperty()
    @IsUrl()
    @Transform((value) => `${value}`.trim())
    @ValidateIf((o) => o.urlSuccess)
    urlSuccess: string;

    @ApiProperty()
    @IsUrl()
    @Transform((value) => `${value}`.trim())
    @ValidateIf((o) => o.urlFailed)
    urlFailed: string;
}
