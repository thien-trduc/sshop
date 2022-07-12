import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IPgDataService } from '@tproject/libs/data';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigsJwtService } from '../../../shared/service/configs.jwt.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(JwtStrategy.name);

    constructor(private readonly configJwtService: ConfigsJwtService, private readonly data: IPgDataService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configJwtService.jwtSecretKey,
        });
    }

    async validate(payload: any) {
        const user = await this.data.user.findById(payload?.id || 0);

        if (!user) {
            throw new HttpException('Bạn chưa được ủy quyền ! Xin đăng nhập để tiếp tục!', HttpStatus.UNAUTHORIZED);
        }

        return user;
    }
}
