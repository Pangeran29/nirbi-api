import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class ToJsonPipe implements PipeTransform {
  transform(value: any) {
    return JSON.parse(value);
  }
}
