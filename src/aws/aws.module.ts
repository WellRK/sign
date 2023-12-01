import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { AwsController } from './aws.controller';
import { AppService } from 'src/app.service';
import { PadesVisualElementsRestPki } from './utils/pades-visual-elements-restpki.utils';

@Module({
  controllers: [AwsController],
  providers: [AwsService, AppService],
  exports: [AwsService]
})
export class AwsModule {}
