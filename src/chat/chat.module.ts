import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { ChatRepository } from './chat.repository';
import { UserModule } from 'src/user/user.module';
import { FileSystemModule } from '@app/helper';

@Module({
  providers: [ChatGateway, ChatService, ChatRepository],
  imports: [AuthModule, UserModule, FileSystemModule],
})
export class ChatModule {}
