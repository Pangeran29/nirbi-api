import { ValidationPipe } from "@app/common/pipe/validation.pipe";
import { Injectable } from "@nestjs/common";
import { SendMessageDto } from "./send-message.dto";
import { Socket } from "socket.io";

@Injectable()
export class SendMessagePipe extends ValidationPipe<SendMessageDto> {
  dtoType: new () => SendMessageDto = SendMessageDto;
}
