import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ValidationType } from './type/validation-pipe.type';

@Injectable()
export abstract class ValidationPipe<T> implements PipeTransform<T> {
  async transform(value: T, metadata: ArgumentMetadata): Promise<ValidationType> {
    let isValidObject: boolean = true;

    const object = plainToClass(this.dtoType, value);
    const errors = await validate(object as object);

    if (errors.length > 0) {
      isValidObject = false;
    }

    return { isValidObject, errors, value };
  }

  abstract dtoType: new () => T;
}
