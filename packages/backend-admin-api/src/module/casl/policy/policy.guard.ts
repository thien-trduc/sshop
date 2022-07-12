import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IPgDataService } from '@tproject/libs/data';

import type { TypeAppAbility } from '../casl-ability.factory';
import { CaslAbilityFactory } from '../casl-ability.factory';
import { CHECK_POLICIES_KEY } from './policy.decorator';
import type { PolicyHandler } from './policy-handler.interface';

@Injectable()
export class PoliciesGuard implements CanActivate {
    constructor(private reflector: Reflector, private caslAbilityFactory: CaslAbilityFactory, private readonly data: IPgDataService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const policyHandlers = this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, context.getHandler()) || [];

        const { user } = context.switchToHttp().getRequest();
        const [findUser, roles] = await Promise.all([this.data.user.findById(user?.id), this.data.role.getAllRoleByUser(user?.id)]);

        if (findUser && roles) {
            const ability = this.caslAbilityFactory.createForUser({ ...findUser, roles });

            return policyHandlers.every((handler) => this.execPolicyHandler(handler, ability));
        }

        return false;
    }

    private execPolicyHandler(handler: PolicyHandler, ability: TypeAppAbility) {
        if (typeof handler === 'function') {
            return handler(ability);
        }

        return handler.handle(ability);
    }
}
