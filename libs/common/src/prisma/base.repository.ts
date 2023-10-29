import { Prisma, PrismaClient } from '@prisma/client';
import { RecordNotCreatedException } from '../exception/prisma/record-not-created.exception';
import { IncludeArgs } from './types/include.type';
import { FindUniqueDto } from './dto/find-unique.dto';
import { FindManyDto } from './dto/find-many.dto';

export abstract class BaseRepository<T> {
  protected prisma: PrismaClient;
  protected model: Prisma.ModelName;

  constructor(model: Prisma.ModelName) {
    this.prisma = new PrismaClient();
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      return await this.prisma[this.model].create({ data });
    } catch (error) {
      throw new RecordNotCreatedException(error);
    }
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    return await this.prisma[this.model].update({
      where: { id },
      data,
    });
  }

  async upsert(id: number, create: Partial<T>, update: Partial<T>) {
    return await this.prisma[this.model].upsert({
      where: { id },
      create,
      update,
    });
  }

  async deleteById(id: number): Promise<boolean> {
    const deleteRecord = await this.prisma[this.model].delete({
      where: { id },
    });
    return deleteRecord;
  }

  async findUnique({ uniqueField, uniqueFieldValue, include }: FindUniqueDto): Promise<T | null> {
    return await this.prisma[this.model].findUnique({
      where: { [uniqueField]: uniqueFieldValue },
      include
    });
  }

  async count(): Promise<number> {
    return await this.prisma[this.model].count();
  }

  async findMany(
    { baseQueryFindManyDto, include, where }: FindManyDto
  ): Promise<T[] | any> {
    const { skip, take, sort } = baseQueryFindManyDto;

    const data = await this.prisma[this.model].findMany({
      take,
      skip,
      where,
      include,
      orderBy: {
        createdAt: sort,
      },
    });

    const totalData = await this.prisma[this.model].count({
      where
    });

    return { totalData, [this.model]: data };
  }

  async executeRawQuery(query: string) {
    return await this.prisma.$executeRaw(Prisma.raw(`${query}`));
  }
}
