import { Injectable } from '@nestjs/common';
import { FILE_DESTINATION } from './constant/file-destination.constant';
import { FileSystemService } from '@app/helper';

@Injectable()
export class FileUploadService {
  private readonly _fileDestination = FILE_DESTINATION;

  constructor(private readonly fileSystemService: FileSystemService) { }

  async saveFile(bucket: FILE_DESTINATION, { originalname, buffer, ...data }: Express.Multer.File) {
    return await this.fileSystemService.saveFile(bucket, originalname, buffer);
  }
}
