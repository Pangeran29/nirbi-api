import { $Enums, User } from '@prisma/client';

export class CreateUserDto implements User {
  id: number;
  email: string;
  name: string;
  password: string;
  auth_method: $Enums.AuthMethod;
  createdAt: Date;
  updatedAt: Date;
}
