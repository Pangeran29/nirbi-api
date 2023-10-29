import { BaseToken } from './base/base-token.type';

export type UserAccessToken = BaseToken & {
  sub: number;
  email: string;
};
