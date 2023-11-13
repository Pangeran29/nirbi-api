import { Socket } from "socket.io"
import { UserAccessToken } from "src/auth/type/user-access-token.type"

export type CurrentUserSocket = {
  Socket: Socket,
  user: UserAccessToken
}