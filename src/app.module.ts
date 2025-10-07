import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TanApiService } from './services/tan-api.service';
import { HasuraService } from './services/hasura.service';
import { DataTransformerService } from './services/data-transformer.service';
import { SimpleCronService } from './services/db-sync-cron-job';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TanApiService,
    HasuraService,
    DataTransformerService,
    SimpleCronService,
  ],
})
export class AppModule {}
