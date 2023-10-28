import { BaseToken } from './base/base-token.type';

export type RerfreshToken = BaseToken & {
  id: number;
  email: string;
};
