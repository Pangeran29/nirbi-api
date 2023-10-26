import { BaseToken } from "./base/base-token.type"

export type AccessToken = BaseToken & {
  id: number,
  email: string
}