import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TRANSPORT_ENUM } from '../enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // token location in http request context['args'][0]['headers']
    // token location in ws request context['args'][0]['handshake']['headers']['authorization']
    if (context['contextType'] == TRANSPORT_ENUM.WEB_SOCKET) {
      context['args'][0]['headers'] =
        context['args'][0]['handshake']['headers'];
    }
    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
