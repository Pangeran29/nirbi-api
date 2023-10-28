import { BaseRepository } from '@app/common';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('User');
  }
}
