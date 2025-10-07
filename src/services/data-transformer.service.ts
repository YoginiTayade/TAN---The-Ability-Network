import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DataTransformerService {
  private readonly logger = new Logger(DataTransformerService.name);

  transformTanApiResponse(apiResponse: any): any[] {
    try {
      this.logger.log('Transforming TAN API response data...');
      this.logger.debug('API Response structure:', JSON.stringify(apiResponse, null, 2));

      // If new structure with `responses` array exists, work on that; else fallback to legacy
      const responsesArray = Array.isArray(apiResponse?.responses)
        ? apiResponse.responses
        : [apiResponse];

      const records: any[] = [];

      for (const resp of responsesArray) {
        const { context, message } = resp;

        if (
          message &&
          message.catalog &&
          message.catalog.message &&
          message.catalog.message.catalog
        ) {
          const catalog = message.catalog.message.catalog;
          const { providers } = catalog;

          // Extract provider-related data
          const allProviderLocations = providers.flatMap((provider: any) =>
            provider.locations?.map((location: any) => ({
              provider_id: provider.id,
              id: location.id,
              address: location.address,
              contacts: location.contacts,
            })) || []
          );

          const allProviderContacts = providers.flatMap((provider: any) =>
            provider.locations?.flatMap((location: any) =>
              (location.contacts || []).map((contact: any) => ({
                provider_id: provider.id,
                location_id: location.id,
                ...contact,
              }))
            ) || []
          );

          const allItems = providers.flatMap((provider: any) =>
            provider.items?.map((item: any) => ({
              provider_id: provider.id,
              id: item.id,
              descriptor: item.descriptor,
              category_ids: item.category_ids,
              tags: item.tags,
            })) || []
          );

          const allItemTags = providers.flatMap((provider: any) =>
            provider.items?.flatMap((item: any) =>
              (item.tags || []).map((tag: any) => ({
                provider_id: provider.id,
                item_id: item.id,
                ...tag,
              }))
            ) || []
          );

          records.push({
            domain: context.domain,
            transaction_id: context.transaction_id,
            message_id: context.message_id,
            bap_id: context.bap_id,
            bpp_uri: context.bpp_uri ?? context.bap_uri,
            action: context.action,
            providers: JSON.stringify(
              providers.map((provider: any) => ({
                id: provider.id,
                descriptor: provider.descriptor,
              }))
            ),
            providers_locations: JSON.stringify(allProviderLocations),
            providers_contact: JSON.stringify(allProviderContacts),
            items: JSON.stringify(allItems),
            item_tags: JSON.stringify(allItemTags),
            timestamp: context.timestamp,
          });

          this.logger.log(
            `Transformed 1 record (transaction_id=${context.transaction_id}) with ${providers.length} providers`,
          );
        } else {
          this.logger.warn('Unexpected response format inside responses array, skipping');
        }
      }

      if (records.length === 0) {
        this.logger.warn('No valid records transformed');
      }

      return records;
    } catch (error) {
      this.logger.error('Error transforming API response:', error.message);
      throw error;
    }
  }
}
