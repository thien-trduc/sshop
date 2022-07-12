import { ApiProperty } from '@nestjs/swagger';

export class PasswordRecoverySuccessDto {
    @ApiProperty()
    token: string;
}
