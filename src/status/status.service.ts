import { Injectable } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { RecordNotCreatedException, RecordNotDeletedException, RecordNotFoundException, RecordNotUpdatedException } from '@app/common/exception/prisma';
import { StatusRepository } from './status.repository';
import { Prisma } from '@prisma/client';
import { NOT_FOUND_EXC_MSG } from '@app/common/exception/message';
import { ResponseInterceptor } from '@app/common/interceptor/response.interceptor';
import { FindManyStatusDto } from './dto/find-many-status.dto';

@Injectable()
export class StatusService {
  constructor(private readonly statusRepository: StatusRepository) { }

  async create(userId: number, createStatusDto: CreateStatusDto) {
    const createinput: Prisma.StatusCreateInput = {
      ...createStatusDto,
      User: { connect: { id: userId } }
    }

    try {
      return await this.statusRepository.create(createinput as any);
    } catch (error) {
      throw new RecordNotCreatedException(error);
    }
  }

  async findAll(findManyStatusDto: FindManyStatusDto) {
    return await this.statusRepository.findMany({
      baseQueryFindManyDto: findManyStatusDto
    });
  }

  async findOne(id: number) {
    const status = await this.statusRepository.findUnique({
      uniqueField: 'id', uniqueFieldValue: id, include: { User: true }
    });
    if (!status) {
      throw new RecordNotFoundException(NOT_FOUND_EXC_MSG.RECORD_NOT_FOUND);
    }
    return status;
  }

  async update(id: number, updateStatusDto: UpdateStatusDto) {
    await this.findOne(id);
    try {
      return await this.statusRepository.update(id, updateStatusDto);
    } catch (error) {
      throw new RecordNotUpdatedException(error);
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    try {
      return await this.statusRepository.deleteById(id);
    } catch (error) {
      throw new RecordNotDeletedException(error);
    }
  }
}
