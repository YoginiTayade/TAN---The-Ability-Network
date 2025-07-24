import {
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { components } from "./types/schema";
import {
  TanCatalogGenerator,
} from "utils/generator";
import axios from 'axios';


@Injectable()
export class AppService {
  constructor(
  ) { }
  getHello(): string {
    return "Icar-network Backend is running!!";
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
      console.log("TAN API response:", JSON.stringify(response.data));

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
}
