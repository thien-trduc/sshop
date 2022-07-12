import type { TypeAppAbility } from '../casl-ability.factory';

export interface IPolicyHandler {
    handle(ability: TypeAppAbility): boolean;
}

type PolicyHandlerCallback = (ability: TypeAppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;
