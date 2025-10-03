import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import axios from 'axios';
import { randomUUID } from "crypto";

@Injectable()
export class TanApiService {
  private readonly logger = new Logger(TanApiService.name);

  constructor(
    private readonly httpService: HttpService,
  ) {}

  async fetchMobilitySearchData(): Promise<any> {
    try {
      const tanApiUrl = `${process.env.TAN_NETWORK_URL}/search`;
      this.logger.log(`Fetching data from TAN API: ${tanApiUrl}`);
      
      // Prepare the request payload as per the curl example
      const requestPayload = {
        context: {
          domain: "advisory:tan",
          action: "search",
          version: "1.1.0",
          bap_id: "stagingseekernetwork.abilitynetwork.in",
          bap_uri: "https://stagingseekernetwork.abilitynetwork.in",
          bpp_id: "stagingprovidernetwork.abilitynetwork.in",
          bpp_uri: "https://stagingprovidernetwork.abilitynetwork.in",
          transaction_id: this.generateTransactionId(),
          message_id: this.generateMessageId(),
          timestamp: new Date().toISOString(),
          location: {
            country: {
              code: "IND"
            }
          }
        },
        message: {
          intent: {
            category: {
              descriptor: {
                code: "disability_services"
              }
            },
            item: {
              descriptor: {
                name: "Education"
              }
            },
            provider: {
              descriptor: {
                name: ""
              }
            },
            fulfillment: {
              end: {
                location: {
                  gps: "",
                  address: {
                    city: "",
                    area_code: "",
                    country: ""
                  }
                }
              }
            },
            tags: []
          }
        }
      };
      
      const response = await axios.post(tanApiUrl, requestPayload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("TAN API response:", response.data);
      this.logger.log('Successfully fetched data from TAN API');
      return response.data;
    } catch (error) {
      this.logger.error('TAN API failed:', error);
      throw new Error(`Failed to fetch data from TAN API: ${error.message}`);
    }
  }

  generateTransactionId() {
    return randomUUID();
  }
  
  generateMessageId() {
    return randomUUID();
  }
}
