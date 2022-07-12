import { Action } from '../../../../constant/enum/action.enum';
import type { TypeAppAbility } from '../../casl-ability.factory';
import type { IPolicyHandler } from '../policy-handler.interface';

export class EmployeeManagePolicyHandler implements IPolicyHandler {
    handle(ability: TypeAppAbility) {
        return ability.can(Action.Manage, 'Employee');
    }
}

export class EmployeeReadPolicyHandler implements IPolicyHandler {
    handle(ability: TypeAppAbility) {
        return ability.can(Action.Read, 'Employee');
    }
}

export class EmployeeCreatePolicyHandler implements IPolicyHandler {
    handle(ability: TypeAppAbility) {
        return ability.can(Action.Create, 'Employee');
    }
}

export class EmployeeUpdatePolicyHandler implements IPolicyHandler {
    handle(ability: TypeAppAbility) {
        return ability.can(Action.Update, 'Employee');
    }
}

export class EmployeeDeletePolicyHandler implements IPolicyHandler {
    handle(ability: TypeAppAbility) {
        return ability.can(Action.Delete, 'Employee');
    }
}
