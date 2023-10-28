import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { FileSystemModule } from '@app/helper';

@Module({
  controllers: [FileUploadController],
  providers: [FileUploadService],
  imports: [FileSystemModule],
})
export class FileUploadModule {}
