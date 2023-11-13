import { ApiProperty } from '@nestjs/swagger';
import { $Enums, User } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterDto implements Partial<User> {
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    description: 'Login identifier, local auth by default',
    enum: $Enums.AUTH_METHOD,
  })
  @IsOptional()
  @IsEnum($Enums.AUTH_METHOD)
  authMethod?: $Enums.AUTH_METHOD = $Enums.AUTH_METHOD.LOCAL_AUTH;
}
