import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HasuraService {
  private readonly logger = new Logger(HasuraService.name);

  constructor(private readonly httpService: HttpService) {}

  async insertCachedData(data: any[]): Promise<void> {
    try {
      const hasuraBaseUrl = process.env.HASURA_BASE_URL;
      const hasuraAdminSecret = process.env.HASURA_ADMIN_SECRET || '';
      
      this.logger.log(`Inserting ${data.length} records into Hasura database...`);

      const mutation = {
        query: `
          mutation InsertTanCachedData($objects: [tan_cached_db_insert_input!]!) {
            insert_tan_cached_db(objects: $objects) {
              affected_rows
              returning {
                id
              }
            }
          }
        `,
        variables: {
          objects: data,
        },
      };

      const response = await firstValueFrom(
        this.httpService.post(
          hasuraBaseUrl,
          mutation,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-hasura-admin-secret': hasuraAdminSecret,
            },
          }
        )
      );

      this.logger.log(`Successfully inserted ${response.data.data.insert_tan_cached_db.affected_rows} records`);
    } catch (error) {
      this.logger.error('Error inserting data into Hasura:', error.message);
      throw error;
    }
  }

  async clearOldData(): Promise<void> {
    try {
      const hasuraBaseUrl = process.env.HASURA_BASE_URL;
      const hasuraAdminSecret = process.env.HASURA_ADMIN_SECRET || '';
      
      this.logger.log('Clearing old cached data...');

      const mutation = {
        query: `
          mutation DeleteOldTanCachedData {
            delete_tan_cached_db(where: {}) {
              affected_rows
            }
          }
        `,
      };

      await firstValueFrom(
        this.httpService.post(
          hasuraBaseUrl,
          mutation,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-hasura-admin-secret': hasuraAdminSecret,
            },
          }
        )
      );

      this.logger.log('Successfully cleared old cached data');
    } catch (error) {
      this.logger.error('Error clearing old data from Hasura:', error.message);
      throw error;
    }
  }
}
