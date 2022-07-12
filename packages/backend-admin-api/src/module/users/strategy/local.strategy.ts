import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { UsersService } from '../users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UsersService) {
        super();
    }

    async validate(username: string, password: string): Promise<any> {
        const user = await this.userService.validateUser(username, password);

        if (!user) {
            throw new HttpException('Bạn không có quyền thực hiện thao tác này !', HttpStatus.UNAUTHORIZED);
        }

        return user;
    }
}
