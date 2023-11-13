import { NOT_FOUND_EXC_MSG } from '@app/common/exception/message';
import { RecordNotFoundException } from '@app/common/exception/prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ChatRepository } from './chat.repository';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) { }

  async create(senderId: number, sendMessageDto: SendMessageDto) {
    const { receiverId, ...data } = sendMessageDto;
    const createinput: Prisma.ChatCreateInput = {
      ChatReceiver: { connect: { id: receiverId } },
      ChatSender: { connect: { id: senderId } },
      ...data
    };
    return await this.chatRepository.create(createinput as any);
  }

  // async findAll(findManyStatusDto: FindManyStatusDto) {
  //   return await this.chatRepository.findMany({
  //     baseQueryFindManyDto: findManyStatusDto,
  //   });
  // }

  async findOne(id: number) {
    const status = await this.chatRepository.findUnique({
      uniqueField: 'id',
      uniqueFieldValue: id,
      include: { User: true },
    });
    if (!status) {
      throw new RecordNotFoundException(NOT_FOUND_EXC_MSG.RECORD_NOT_FOUND);
    }
    return status;
  }

  // async update(id: number, updateStatusDto: UpdateStatusDto) {
  //   await this.findOne(id);
  //   return await this.chatRepository.update(id, updateStatusDto);
  // }

  async remove(id: number) {
    await this.findOne(id);
    return await this.chatRepository.deleteById(id);
  }
}
