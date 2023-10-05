import { Logger, NotFoundException } from "@nestjs/common";

export class RecordNotFoundException extends NotFoundException {
  private readonly logger = new Logger(RecordNotFoundException.name);
  constructor(error?: any) {
    super('Record Not Found');
    this.logger.error('Record Not Found', error);
  }
}