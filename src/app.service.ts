import {
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import {
  TanCatalogGenerator,
} from '../utils/generator';
import axios from 'axios';


@Injectable()
export class AppService {
  constructor(
  ) { }
  getHello(): string {
    return "Network Backend is running!!";
  }
  public async handleTanSearch(body){
    // Extract query parameters from the request
    const city = body?.message?.intent?.fulfillment?.end?.location?.address?.city;
    const state = body?.message?.intent?.fulfillment?.end?.location?.address?.state;
    const country = body?.message?.intent?.fulfillment?.end?.location?.address?.country;

    let disabilities = body?.message?.intent?.tags[0]?.list[0].value;
    console.log(city,state,country,disabilities);

    // Build query parameters
    const queryParams = [];
    if (city) queryParams.push(`cities=${encodeURIComponent(city)}`);
    if (state) queryParams.push(`states=${encodeURIComponent(state)}`);
    if (country) queryParams.push(`country=${encodeURIComponent(country)}`);
    if (disabilities) queryParams.push(`disabilities=${encodeURIComponent(disabilities)}`);

    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.TAN_BASE_URL}/search${queryString}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    console.log("TAN API config:", config);

    try {
      const response = await axios.request(config);
      // Map the response using TanCatalogGenerator
      const catalog = TanCatalogGenerator(response.data);

      // Update context action
      body.context.action = "on_search";

      const tanData = {
        context: body.context,
        message: {
          catalog: catalog,
        },
      };

      return tanData;
    } catch (error) {
      console.error("TAN API error:", error);
      throw new InternalServerErrorException("Failed to fetch disability services");
    }
  }
  public async handleNetworkCheck(body: any) {
    console.log("Starting network availability check...");

    try {
      // Step 1: Check Network Availability
      const isNetworkAvailable = await this.checkNetworkAvailability();

      if (isNetworkAvailable) {
        console.log("Network is available, calling network API...");
        return await this.callNetworkAPI(body);
      } else {
        console.log("Network is unavailable, calling P2P API...");
        const result = await this.handleTanSearch(body);
        const { context, ...rest } = result;

        return {
          context,
          responses: [rest]
        };
      }
    } catch (error) {
      console.error("Error in handleNetworkCheck:", error);
      throw new InternalServerErrorException("Failed to process network check request");
    }
  }

  private async checkNetworkAvailability(): Promise<boolean> {
    try {
      console.log("CHECKING NETWORK AVAILABILITY");
      const response = await axios.get(`${process.env.NETWORK_CHECK_URL}`, {
        timeout: 10000, // 10 second timeout
      });
      // If response is 404 and contains "Cannot GET", consider network available
      if (response.status === 404 && response.data && response.data.includes("Cannot POST")) {
        console.log("Network is available (404 with 'Cannot GET')");
        return true;
      }

      console.log("Network is unavailable (unexpected response)");
      return false;
    } catch (error: any) {
      // Check if the error is actually a 404 with "Cannot GET" - this means network is available
      if (error.response?.status === 404 && error.response?.data && error.response.data.includes("Cannot GET")) {
        console.log("Network is available (404 with 'Cannot GET' in error response)");
        return true;
      }

      console.log("Network is unavailable (error):", error.message);
      return false;
    }
  }

  private async callNetworkAPI(body: any) {
    try {
      const networkResponse = await axios.post(`${process.env.NETWORK_BASE_URL}/mobility/search`, body, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      });

      console.log("Network API call successful", networkResponse.data);

      // Network API already returns data in the correct format (wrapped in response array)
      return networkResponse.data;
    } catch (error) {
      console.error("Network API error:", error);
      throw new InternalServerErrorException("Failed to call network API");
    }
  }
}
