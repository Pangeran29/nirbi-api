import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty()
  @IsNumber()
  receiverId: number;

  @IsString()
  @IsNotEmpty()
  message: string;
}
