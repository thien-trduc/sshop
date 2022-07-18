import type * as admin from 'firebase-admin';

export type Constructor<T, Arguments extends unknown[] = undefined[]> = new (...arguments_: Arguments) => T;

export type Plain<T> = T;
export type Optional<T> = T | undefined;
export type Nullable<T> = T | null;

export type FirebaseVerifyTokenClaims = admin.auth.DecodedIdToken;
export type UserRecord = admin.auth.UserRecord;
