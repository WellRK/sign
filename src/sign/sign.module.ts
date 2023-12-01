import { Module } from '@nestjs/common';
import { SignService } from './sign.service';
import { SignController } from './sign.controller';
import { AwsService } from 'src/aws/aws.service';
//import { PadesVisualElementsRestPki } from 'pades-visual-elements-restpki.utils';

@Module({
  controllers: [SignController],
  providers: [SignService, AwsService],
  imports: []
})
export class SignModule {}
