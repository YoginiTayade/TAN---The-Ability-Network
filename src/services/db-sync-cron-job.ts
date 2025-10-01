import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as cron from 'node-cron';
import { TanApiService } from './tan-api.service';
import { DataTransformerService } from './data-transformer.service';
import { HasuraService } from './hasura.service';

@Injectable()
export class SimpleCronService implements OnModuleInit {
  private readonly logger = new Logger(SimpleCronService.name);
  private cronJob: cron.ScheduledTask | null = null;

  constructor(
    private readonly tanApiService: TanApiService,
    private readonly dataTransformerService: DataTransformerService,
    private readonly hasuraService: HasuraService,
  ) {}

  onModuleInit() {
    this.logger.log('🕛 Initializing 12 Midnight cron job...');
    // Schedule cron job to run at 12 midnight AM every day
    // Cron pattern: '20 11 * * *' means: minute=20, hour=11, day=*, month=*, dayOfWeek=*
    this.cronJob = cron.schedule('0 0 * * *', async () => {
      this.logger.log('🕛 12 Midnight IST cron job triggered - starting TAN data sync...');
      try {
        await this.triggerManualSync();
        this.logger.log('✅ 00:00 AM IST cron job completed successfully');
      } catch (error) {
        this.logger.error('❌ 00:00 AM IST cron job failed:', error.message);
      }
    }, {
      timezone: 'Asia/Kolkata'
    });
    
    this.logger.log('✅ 00:00 AM IST cron job scheduled successfully (runs at 11:25 IST daily)');
  }

  async triggerManualSync(): Promise<void> {
    try {
      this.logger.log('Starting TAN data sync...');
      
      // Step 1: Fetch data from TAN API
      this.logger.log('Fetching data from TAN API...');
      const apiResponse = await this.tanApiService.fetchMobilitySearchData();
      
      // Step 2: Transform the data
      this.logger.log('Transforming API response data...');
      const transformedData = this.dataTransformerService.transformTanApiResponse(apiResponse);
      
      // Step 3: Insert new data (without clearing old data)
      this.logger.log(`Inserting ${transformedData.length} new records into database...`);
      await this.hasuraService.insertCachedData(transformedData);
      
      this.logger.log('✅ TAN data sync completed successfully');
    } catch (error) {
      this.logger.error('❌ TAN data sync failed:', error.message);
      throw error;
    }
  }
}