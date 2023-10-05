import { Logger, NotFoundException } from "@nestjs/common";

export class RecordNotCreatedException extends NotFoundException {
  private readonly logger = new Logger(RecordNotCreatedException.name);
  constructor(error?: any) {
    super('Record Not Created');
    this.logger.error('Record Not Created', error);
  }
}