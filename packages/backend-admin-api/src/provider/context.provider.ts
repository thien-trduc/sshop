import { get, isEmpty } from 'lodash';
import requestContext from 'request-context';
import { Readable } from 'stream';

import { ValidationMessage } from '../constant';

export class ContextProvider {
    private static readonly nameSpace = 'request';

    private static readonly authUserKey = 'user_key';

    private static readonly languageKey = 'language_key';

    private static get<T>(key: string): T {
        return requestContext.get(ContextProvider.getKeyWithNamespace(key));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static set(key: string, value: any): void {
        requestContext.set(ContextProvider.getKeyWithNamespace(key), value);
    }

    private static getKeyWithNamespace(key: string): string {
        return `${ContextProvider.nameSpace}.${key}`;
    }

    static setLanguage(language: string): void {
        ContextProvider.set(ContextProvider.languageKey, language);
    }

    static getLanguage(): string {
        return ContextProvider.get(ContextProvider.languageKey);
    }

    static bufferToStream(buffer): Readable {
        return new Readable({
            read() {
                this.push(buffer);
                // eslint-disable-next-line unicorn/no-null
                this.push(null);
            },
        });
    }

    static validInfo<T = any>(model: T): any {
        let result: any = [];

        for (const key of Object.keys(model)) {
            const value = get(model, key, '');

            if (isEmpty(`${value}`)) {
                result = [
                    ...result,
                    {
                        key,
                        message: `${key} ${ValidationMessage.EMPTY}`,
                    },
                ];
            }
        }

        return result;
    }
}
