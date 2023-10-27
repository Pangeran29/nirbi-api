import { Controller, Post, Param, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FILE_DESTINATION, availableFileDestionation } from './constant/file-destination.constant';
import { BAD_REQ_EXC_MSG } from '@app/common/exception/message';

@ApiBearerAuth()
@ApiTags('file-upload')
@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) { }

  @ApiOperation({
    description: `
      Used for client to upload file, required bucket (string) as destination of file.
      Available bucket: ${availableFileDestionation()}
    `
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        }
      },
    },
  })
  @Post(':bucket')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('bucket') bucket: FILE_DESTINATION,
    @UploadedFile() file: Express.Multer.File,
  ) {
    for (const key in FILE_DESTINATION) {
      if (FILE_DESTINATION[key] === bucket) {
        return await this.fileUploadService.saveFile(
          bucket as FILE_DESTINATION, file
        );
      }
    }
    
    throw new BadRequestException({
      msg: BAD_REQ_EXC_MSG.INVALID_FILE_DESTINATION,
      availableBucket: FILE_DESTINATION
    });
  }
}
