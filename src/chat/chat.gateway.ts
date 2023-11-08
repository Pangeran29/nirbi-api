import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { HttpStatus, OnModuleInit, ValidationPipe } from '@nestjs/common';
import { SOCKET_EVENT } from './enum/socket-event.enum';
import { SendMessageDto } from './dto/send-message.dto';
import { ToJsonPipe } from '../../libs/common/src/pipe/to-json.pipe';
import { FORBIDDEN_EXC_MSG } from '@app/common/exception/message';
import { WebSocketError } from './types/web-socket-error.type';
import { AuthService } from 'src/auth/auth.service';
import { UserAccessToken } from 'src/auth/type/user-access-token.type';
import { ExtractJWT } from 'src/auth/type/extract-jwt.type';

@WebSocketGateway(3001, { namespace: 'chat' })
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  private connectedUsers: Map<number, Socket> = new Map();

  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService
  ) { }

  /**
   * Manage socket everytime connection establish
   */
  onModuleInit() {
    this.server.on('connection', async (socket: Socket) => {
      const bearerToken = socket['handshake']['headers']['authorization']
      if (bearerToken) {
        const accessToken = bearerToken.split(' ')[1];
        const currentUser = await this._handleAccessToken(accessToken, socket);
        socket['CurrentUser'] = currentUser;
        this.connectedUsers.set(currentUser['sub'], socket);
      } else {
        this._handleInvalidJWT(socket);
      }
    });
  }

  /**
   * Disconect current connection if the JWT is not valid
   * @param socket Current socket instance
   */
  private _handleInvalidJWT(socket: Socket): void {
    const error: WebSocketError = {
      success: false,
      statusCode: HttpStatus.FORBIDDEN,
      message: FORBIDDEN_EXC_MSG.INVALID_JWT
    }
    socket.emit(SOCKET_EVENT.EXCEPTION, error);
    socket.disconnect(true);
  }

  /**
   * Handle validation of access token, trigger disconnect if token invalid
   * @param accessToken JWT
   * @param socket current user socket instance
   * @returns void | UserAccessToken
   * @type void | UserAccessToken
   */
  private async _handleAccessToken(accessToken: string, socket: Socket): Promise<UserAccessToken | void> {
    const { isSuccess, currentUserMetadata }: ExtractJWT = await this
      .authService
      .extractJWTAccessToken(accessToken);
    if (!isSuccess) {
      return this._handleInvalidJWT(socket);
    }
    return currentUserMetadata;
  }

  /**
   * Sending message between two client
   * @param client Current user socket instance
   * @param param1 send message dto
   * @todo emit error for dto exception, save chat funcionality, integrating with redis 
   */
  @SubscribeMessage(SOCKET_EVENT.SEND_MESSAGE)
  async onNewMessage(
    @ConnectedSocket()
    client: Socket,
    @MessageBody(new ToJsonPipe(), new ValidationPipe())
    { receiverId, message }: SendMessageDto
  ) {
    const sender = client['CurrentUser'];
    const receiverClient = this.connectedUsers.get(receiverId);
    receiverClient.emit(SOCKET_EVENT.ON_SEND_MESSAGE, {
      message,
      from: sender
    });
    client.emit(SOCKET_EVENT.ON_SEND_MESSAGE, {
      message,
      from: 'self'
    });
  }

}
