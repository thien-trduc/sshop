import { TokenVerifyOtpModel } from './../model/model';
import { UtilService } from '@tproject/libs/core';
import { IGenericRepository } from '../abstract/generic-repository';
import { PrismaService } from '../provider/prisma.service';
import { OtpModel } from '../model/model';
import { OtpNumber } from '@prisma/client';
import { first } from 'lodash';

export class OtpRepository extends IGenericRepository<OtpModel> {
    private readonly prisma: PrismaService;

    constructor(prisma: PrismaService) {
        super();
        this.prisma = prisma;
    }

    async getOtp(): Promise<number> {
        const skip =  UtilService.getRandomInt(0, 888888);
        const otp = await this.prisma.otpNumber.findMany({
            skip,
            take: 1,
        });
        if (otp.length < 0) {
            return 0;
        } 
        const otpNumber = first(otp) ;
        if (otpNumber.is_selected === true) {
            return 0;
        }
        await this.prisma.otpNumber.update({
            where: {
                otp: otpNumber.otp,
            },
            data: {
                is_selected: true,
            },
        });
        return otpNumber.otp; 
    }

    createTokenVerifyOtp(data: TokenVerifyOtpModel): Promise<TokenVerifyOtpModel> {
        return this.prisma.tokenVerifyOtp.create({
            data,
        });
    }

    findOneTokenVerifyOtp(filter: Partial<Record<keyof TokenVerifyOtpModel, any>>): Promise<TokenVerifyOtpModel> {
        return this.prisma.tokenVerifyOtp.findUnique({
            where: {
                ...filter
            },
        });
    }

    recoveryOtpStore(otp: string): Promise<void> {
        return this.prisma.$transaction(async (tx) => {
            await tx.otpNumber.update({
                where: { otp: Number(otp)},
                data: { is_selected: false },
            })
            await tx.tokenVerifyOtp.delete({
                where: {
                    otp: Number(otp)
                },
            })
        });
    }

    page(page: number, limit: number, filter?: Partial<Record<keyof OtpNumber, any>>, sort?: Partial<Record<keyof OtpNumber, unknown>>): Promise<OtpNumber[]> {
        throw new Error('Method not implemented.');
    }
    count(filter?: Partial<Record<keyof OtpNumber, any>>): Promise<number> {
        throw new Error('Method not implemented.');
    }
    findById(id: string | number): Promise<OtpNumber> {
        throw new Error('Method not implemented.');
    }
    findOne(filter: Partial<Record<keyof OtpNumber, any>>): Promise<OtpNumber> {
        throw new Error('Method not implemented.');
    }
    create(model: OtpNumber): Promise<OtpNumber> {
        throw new Error('Method not implemented.');
    }
    update(id: string | number, model: OtpNumber): Promise<OtpNumber> {
        throw new Error('Method not implemented.');
    }
    deleteById(id: string | number): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
