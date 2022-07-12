import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAdminModule } from '@tproject/libs/firebase-admin';

import { CustomerProvider } from '../../provider';
import { ConfigFirebaseService } from '../../shared/service/configs.firebase.service';
import { ConfigsJwtService } from '../../shared/service/configs.jwt.service';
import { ConfigsRabbitService } from '../../shared/service/configs.rabbit.service';
import { SharedModule } from '../../shared/shared.module';
import { OtpModule } from '../otp/otp.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            useExisting: ConfigsJwtService,
        }),
        FirebaseAdminModule.forRootAsync({
            imports: [SharedModule],
            inject: [ConfigFirebaseService],
            useFactory: (config: ConfigFirebaseService) => config.createServiceAccount(),
        }),
        RabbitMQModule.forRootAsync(RabbitMQModule, {
            imports: [SharedModule],
            inject: [ConfigsRabbitService],
            useFactory: (config: ConfigsRabbitService) => config.getRabbitOption,
        }),
        OtpModule,
    ],
    providers: [UsersService, JwtStrategy, CustomerProvider],
    controllers: [UsersController],
})
export class UsersModule {}
