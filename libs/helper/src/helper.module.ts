import { Module } from '@nestjs/common';
import { HelperService } from './helper.service';
import { FileSystemModule } from './file-system/file-system.module';

@Module({
  providers: [HelperService],
  exports: [HelperService],
  imports: [FileSystemModule],
})
export class HelperModule {}
