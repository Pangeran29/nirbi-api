import { UserAccessToken } from './user-access-token.type';

export type ExtractJWT = {
  isSuccess: boolean;
  currentUserMetadata?: UserAccessToken;
  error?: any;
};
