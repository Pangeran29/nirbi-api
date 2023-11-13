import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Chat } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Max, MaxLength } from 'class-validator';

export class SendMessageDto implements Partial<Chat> {
  @IsNumber()
  @IsNotEmpty()
  receiverId: number;

  @MaxLength(120)
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  mediaUrl: string;

  @ApiProperty({ enum: $Enums.TYPE_OF_CHAT })
  @IsEnum($Enums.TYPE_OF_CHAT)
  @IsNotEmpty()
  typeOfChat: $Enums.TYPE_OF_CHAT;
}
