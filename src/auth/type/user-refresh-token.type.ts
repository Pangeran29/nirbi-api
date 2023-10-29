import { BaseToken } from './base/base-token.type';

export type UserRerfreshToken = BaseToken & {
  sub: number;
  email: string;
};
