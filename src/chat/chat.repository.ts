import { BaseRepository } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Chat } from '@prisma/client';

@Injectable()
export class ChatRepository extends BaseRepository<Chat> {
    constructor() {
        super('Chat');
    }
}
