import { BAD_REQ_EXC_MSG, FORBIDDEN_EXC_MSG, NOT_FOUND_EXC_MSG } from '@app/common/exception/message';
import { ValidationType } from '@app/common/pipe/type/validation-pipe.type';
import { FileSystemService } from '@app/helper';
import { HttpStatus, Logger, OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { ExtractJWT } from 'src/auth/type/extract-jwt.type';
import { UserAccessToken } from 'src/auth/type/user-access-token.type';
import { UserService } from 'src/user/user.service';
import { ToJsonPipe } from '../../libs/common/src/pipe/to-json.pipe';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { SendMessagePipe } from './dto/send-message.pipe';
import { SOCKET_EVENT } from './enum/socket-event.enum';
import { WebSocketError } from './types/web-socket-error.type';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  private readonly server: Server;

  private readonly connectedUsers: Map<number, Socket> = new Map();
  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly fileSystemService: FileSystemService
  ) { }

  /**
   * Manage socket everytime connection establish
   */
  onModuleInit() {
    this.server.on('connection', async (socket: Socket) => {
      const bearerToken = socket['handshake']['headers']['authorization'];
      if (bearerToken) {
        const accessToken = bearerToken.split(' ')[1];
        const { isSuccess, currentUserMetadata }: ExtractJWT =
          await this.authService.extractJWTAccessToken(accessToken);
        if (!isSuccess) {
          return this._handleInvalidJWT(socket);
        }
        socket['CurrentUser'] = currentUserMetadata;
        this.connectedUsers.set(currentUserMetadata['sub'], socket);
      } else {
        this._handleInvalidJWT(socket);
      }
    });
  }

  /**
   * Sending message between two client
   * @param client Current user socket instance
   * @param param1 send message dto
   * @todo assign a uuid instead of user id, handle message when receiver is not active, integrating with redis
   */
  @SubscribeMessage(SOCKET_EVENT.SEND_MESSAGE)
  async onNewMessage(
    @ConnectedSocket()
    sender: Socket,
    @MessageBody(new ToJsonPipe(), new SendMessagePipe())
    sendMessageValidation: ValidationType,
  ) {
    const { isValidObject, errors, value } = sendMessageValidation;
    if (!isValidObject) {
      return this._handleBodyValidation(sender, errors);
    }

    const { receiverId, message, mediaUrl } = value as SendMessageDto;
    if (mediaUrl) {
      const isMediaExist = await this.fileSystemService.checkPathExist(mediaUrl);
      if (!isMediaExist) {
        return this._handleBodyValidation(sender, { message: NOT_FOUND_EXC_MSG.FILE_NOT_FOUND });
      }
    }

    const isUserExist = await this.userService.findOne(receiverId);
    if (!isUserExist) {
      return this._handleUserNotFound(sender);
    }

    const receiver = this.connectedUsers.get(receiverId);
    if (!receiver) {
      // handle message when receiver is not active
    }

    const currentUser: UserAccessToken = sender['CurrentUser'];
    await this.chatService.create(currentUser.sub, value);

    receiver.emit(SOCKET_EVENT.ON_SEND_MESSAGE, {
      message,
      from: currentUser,
    });

    sender.emit(SOCKET_EVENT.ON_SEND_MESSAGE, {
      message,
      from: currentUser,
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
      message: FORBIDDEN_EXC_MSG.INVALID_JWT,
    };
    socket.emit(SOCKET_EVENT.EXCEPTION, error);
    socket.disconnect(true);
  }

  private _handleUserNotFound(socket: Socket): void {
    const error: WebSocketError = {
      success: false,
      statusCode: HttpStatus.NOT_FOUND,
      message: NOT_FOUND_EXC_MSG.USER_NOT_FOUND,
    };
    socket.emit(SOCKET_EVENT.EXCEPTION, error);
  }

  private _handleBodyValidation(socket: Socket, errors: any) {
    const errorMessages = errors.map((error) => {
      const constraintKeys = Object.keys(error.constraints);
      const errorMessage = constraintKeys.map((key) => error.constraints[key]);
      return errorMessage;
    });
    const error: WebSocketError = {
      success: false,
      statusCode: HttpStatus.BAD_REQUEST,
      message: BAD_REQ_EXC_MSG.INVALID_INPUT_BODY,
      errors: errorMessages.flat()
    };
    return socket.emit(SOCKET_EVENT.EXCEPTION, error);
  }
}
