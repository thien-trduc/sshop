/* eslint-disable @typescript-eslint/naming-convention */
import { SetMetadata } from '@nestjs/common';

import type { PolicyHandler } from './policy-handler.interface';

export const CHECK_POLICIES_KEY = 'check_policy';
export const Policy = (...handlers: PolicyHandler[]) => SetMetadata(CHECK_POLICIES_KEY, handlers);
