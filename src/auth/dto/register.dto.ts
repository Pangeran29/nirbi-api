import { ApiProperty } from "@nestjs/swagger";
import { $Enums, User } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator";

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
    enum: $Enums.AuthMethod
  })
  @IsOptional()
  @IsEnum($Enums.AuthMethod)
  auth_method?: $Enums.AuthMethod = $Enums.AuthMethod.LOCAL_AUTH;
}