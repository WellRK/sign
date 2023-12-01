import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AwsModule } from './aws/aws.module';
import { AwsService } from './aws/aws.service';
import { SignModule } from './sign/sign.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
    
  imports: [AwsModule, SignModule,
  

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Pasta onde estão os arquivos estáticos
    }),

    ConfigModule.forRoot({
      envFilePath: './config/default.utils.ts',
    }),
  
  
  ],
  controllers: [AppController],
  providers: [AppService, AwsService],
})
export class AppModule {}
