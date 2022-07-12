import type { ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
import { ValidatorConstraint } from 'class-validator';

@ValidatorConstraint()
export class ValidOtp implements ValidatorConstraintInterface {
    validate(text: string, validationArguments: ValidationArguments) {
        const regexCode = new RegExp(/^\d*$/);

        return regexCode.test(text);
    }
}
