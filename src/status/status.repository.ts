import { BaseRepository } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';

@Injectable()
export class StatusRepository extends BaseRepository<Status> {
  constructor() {
    super('Status');
  }
}
