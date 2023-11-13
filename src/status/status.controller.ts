import { ResponseInterceptorType } from '@app/common';
import { CurrentUser } from '@app/common/decorator/current-user.decorator';
import { NOT_FOUND_EXC_MSG } from '@app/common/exception/message';
import { RecordNotFoundException } from '@app/common/exception/prisma';
import { JwtAuthGuard } from '@app/common/guard';
import { FileSystemService } from '@app/helper';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserAccessToken } from 'src/auth/type/user-access-token.type';
import { CreateStatusDto } from './dto/create-status.dto';
import { FindManyStatusDto } from './dto/find-many-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { StatusService } from './status.service';

@ApiBearerAuth()
@ApiTags('status')
@Controller('status')
export class StatusController {
  constructor(
    private readonly statusService: StatusService,
    private readonly fileSystemService: FileSystemService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @CurrentUser() { sub }: UserAccessToken,
    @Body() createStatusDto: CreateStatusDto,
  ) {
    const { media } = createStatusDto;
    const isMediaExist = await this.fileSystemService.checkPathExist(media);
    if (!isMediaExist) {
      throw new RecordNotFoundException(NOT_FOUND_EXC_MSG.FILE_NOT_FOUND);
    }
    return await this.statusService.create(sub, createStatusDto);
  }

  @Get()
  async findAll(@Query() findManyStatusDto: FindManyStatusDto) {
    return this.statusService.findAll(findManyStatusDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.statusService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    const { media } = updateStatusDto;
    if (media) {
      const isMediaExist = await this.fileSystemService.checkPathExist(media);
      if (!isMediaExist) {
        throw new RecordNotFoundException(NOT_FOUND_EXC_MSG.FILE_NOT_FOUND);
      }
    }
    return this.statusService.update(+id, updateStatusDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ResponseInterceptorType> {
    await this.statusService.remove(+id);
    return { message: 'Success to remove record', data: null };
  }
}
