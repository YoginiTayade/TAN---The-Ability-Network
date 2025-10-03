import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { TanCatalogGenerator } from "../utils/generator";
import axios from "axios";

@Injectable()
export class AppService {
  constructor() {}
  getHello(): string {
    return "Network Backend is running!!";
  }
  public async handleTanSearch(body) {
    // Extract query parameters from the request
    const city =
      body?.message?.intent?.fulfillment?.end?.location?.address?.city;
    const state =
      body?.message?.intent?.fulfillment?.end?.location?.address?.state;
    const country =
      body?.message?.intent?.fulfillment?.end?.location?.address?.country;

    let disabilities = body?.message?.intent?.tags[0]?.list[0].value;
    console.log(city, state, country, disabilities);

    // Build query parameters
    const queryParams = [];
    if (city) queryParams.push(`cities=${encodeURIComponent(city)}`);
    if (state) queryParams.push(`states=${encodeURIComponent(state)}`);
    if (country) queryParams.push(`country=${encodeURIComponent(country)}`);
    if (disabilities)
      queryParams.push(`disability_type=${encodeURIComponent(disabilities)}`);

    const queryString =
      queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

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
      throw new InternalServerErrorException(
        "Failed to fetch disability services"
      );
    }
  }

  public async handleTanSearchV2(body: any) {
    return {
      context: {
        domain: "advisory:tan",
        action: "on_search",
        version: "1.1.0",
        bap_id: "provider-tan-network.tekdinext.com",
        bap_uri: "https://provider-tan-network.tekdinext.com",
        transaction_id: "4eefa4ae-bee0-401a-b758-f49d536e49f9",
        message_id: "5906cbae-0cff-45d3-ba60-db357470b51d",
        timestamp: "2025-07-21T09:30:00.000Z",
        location: {
          country: {
            code: "IND",
          },
        },
      },
      message: {
        catalog: {
          message: {
            catalog: {
              descriptor: {
                name: "Disability Service Catalog",
              },
              providers: [
                {
                  id: "019837d9-26cb-73dd-a00d-4d3c02c9da2e",
                  descriptor: {
                    name: "Tech Mahindra Foundation",
                  },
                  locations: [
                    {
                      id: "Visakhapatnam Centre",
                      address:
                        "44P, Near Bullaiah College, Resapappuvanipalem Village, Visakhapatnam – 530003, Andhra Pradesh",
                      contacts: [
                        {
                          phone: "9997979892",
                          email: "mequ@mailinator.com",
                        },
                      ],
                    },
                  ],
                  items: [
                    {
                      id: "019837d9-26cb-73dd-a00d-4d3c02c9da2e",
                      descriptor: {
                        name: "Legal Aid",
                      },
                      category_ids: ["cerebral_palsy"],
                      tags: [
                        {
                          code: "disability_type",
                          value: "Cerebral Palsy",
                        },
                      ],
                    },
                  ],
                },
                {
                  id: "f844410a-50e8-4c0c-8420-76a479a45eaa",
                  descriptor: {
                    name: "Grameenvikas",
                  },
                  locations: [
                    {
                      id: "Hindupur Office",
                      address:
                        "D No 26-4-1171/4, BVS Building, Balaji Nagar, Hindupur – 515201, Andhra Pradesh",
                      contacts: [
                        {
                          phone: "919030694280",
                          email: "smtthousif7@gmail.com",
                        },
                      ],
                    },
                  ],
                  items: [
                    {
                      id: "f844410a-50e8-4c0c-8420-76a479a45eaa",
                      descriptor: {
                        name: "Legal Aid",
                      },
                      category_ids: [
                        "hearing_impairment_hi",
                        "intellectual_disability_id",
                        "multiple_disabilities",
                        "speech_and_language_disability",
                        "cerebral_palsy",
                        "dwarfism",
                        "locomotor_disability",
                        "visual_impairment_vi",
                      ],
                      tags: [
                        {
                          code: "disability_type",
                          value: "Hearing Impairment (HI)",
                        },
                        {
                          code: "disability_type",
                          value: "Intellectual Disability (ID)",
                        },
                        {
                          code: "disability_type",
                          value: "Multiple Disabilities",
                        },
                        {
                          code: "disability_type",
                          value: "Speech and Language disability",
                        },
                        {
                          code: "disability_type",
                          value: "Cerebral Palsy",
                        },
                        {
                          code: "disability_type",
                          value: "Dwarfism",
                        },
                        {
                          code: "disability_type",
                          value: "Locomotor Disability",
                        },
                        {
                          code: "disability_type",
                          value: "Visual Impairment (VI)",
                        },
                      ],
                    },
                  ],
                },
                {
                  id: "dc5d5653-2fb6-42e3-b991-39d4435b65de",
                  descriptor: {
                    name: "KIRAN Society",
                  },
                  locations: [
                    {
                      id: "Varanasi Centre",
                      address:
                        "Madhopur, Kuruhuan P.O., Varanasi – 221011, Uttar Pradesh",
                      contacts: [
                        {
                          phone: "+91-7571010009",
                          email: "support@kiranvillage.org",
                        },
                      ],
                    },
                  ],
                  items: [
                    {
                      id: "dc5d5653-2fb6-42e3-b991-39d4435b65de",
                      descriptor: {
                        name: "Education",
                      },
                      category_ids: [
                        "hearing_impairment_hi",
                        "intellectual_disability_id",
                        "autism_spectrum_disorder",
                        "locomotor_disability",
                        "cerebral_palsy",
                        "multiple_disabilities",
                        "speech_and_language_disability",
                        "dwarfism",
                        "visual_impairment_vi",
                        "specific_learning_disabilities",
                        "mental_illness",
                      ],
                      tags: [
                        {
                          code: "disability_type",
                          value: "Hearing Impairment (HI)",
                        },
                        {
                          code: "disability_type",
                          value: "Intellectual Disability (ID)",
                        },
                        {
                          code: "disability_type",
                          value: "Autism Spectrum Disorder",
                        },
                        {
                          code: "disability_type",
                          value: "Locomotor Disability",
                        },
                        {
                          code: "disability_type",
                          value: "Cerebral Palsy",
                        },
                        {
                          code: "disability_type",
                          value: "Multiple Disabilities",
                        },
                        {
                          code: "disability_type",
                          value: "Speech and Language disability",
                        },
                        {
                          code: "disability_type",
                          value: "Dwarfism",
                        },
                        {
                          code: "disability_type",
                          value: "Visual Impairment (VI)",
                        },
                        {
                          code: "disability_type",
                          value: "Specific Learning Disabilities",
                        },
                        {
                          code: "disability_type",
                          value: "Mental Illness",
                        },
                      ],
                    },
                  ],
                },
                {
                  id: "d8459fe1-8e0f-4bd9-af4e-45975a1b5f80",
                  descriptor: {
                    name: "Ashish Foundation for the Differently Abled",
                  },
                  locations: [
                    {
                      id: "Delhi Office",
                      address: "A-178, Sector-19, Dwarka, New Delhi – 110075",
                      contacts: [
                        {
                          phone: "919810986890",
                          email: "sheila@ashishfoundation.co.in",
                        },
                      ],
                    },
                  ],
                  items: [
                    {
                      id: "d8459fe1-8e0f-4bd9-af4e-45975a1b5f80",
                      descriptor: {
                        name: "Assistive Devices & Technology",
                      },
                      category_ids: [
                        "intellectual_disability_id",
                        "hearing_impairment_hi",
                        "dwarfism",
                        "locomotor_disability",
                        "multiple_disabilities",
                        "speech_and_language_disability",
                        "cerebral_palsy",
                        "visual_impairment_vi",
                        "muscular_dystrophy",
                        "mental_illness",
                        "specific_learning_disabilities",
                        "autism_spectrum_disorder",
                      ],
                      tags: [
                        {
                          code: "disability_type",
                          value: "Intellectual Disability (ID)",
                        },
                        {
                          code: "disability_type",
                          value: "Hearing Impairment (HI)",
                        },
                        {
                          code: "disability_type",
                          value: "Dwarfism",
                        },
                        {
                          code: "disability_type",
                          value: "Locomotor Disability",
                        },
                        {
                          code: "disability_type",
                          value: "Multiple Disabilities",
                        },
                        {
                          code: "disability_type",
                          value: "Speech and Language disability",
                        },
                        {
                          code: "disability_type",
                          value: "Cerebral Palsy",
                        },
                        {
                          code: "disability_type",
                          value: "Visual Impairment (VI)",
                        },
                        {
                          code: "disability_type",
                          value: "Muscular Dystrophy",
                        },
                        {
                          code: "disability_type",
                          value: "Mental Illness",
                        },
                        {
                          code: "disability_type",
                          value: "Specific Learning Disabilities",
                        },
                        {
                          code: "disability_type",
                          value: "Autism Spectrum Disorder",
                        },
                      ],
                    },
                  ],
                },
                {
                  id: "b7b480a2-ebe8-46d4-9db2-856eadd84bff",
                  descriptor: {
                    name: "Nora Foundation",
                  },
                  locations: [
                    {
                      id: "Vijayawada Branch",
                      address:
                        "Plot No 1, Nandhamuri Nagar, R&B Nagar, Vijayawada – 520015, Andhra Pradesh",
                      contacts: [
                        {
                          phone: "917386897897",
                          email: "info@norafoundation.in",
                        },
                      ],
                    },
                  ],
                  items: [
                    {
                      id: "b7b480a2-ebe8-46d4-9db2-856eadd84bff",
                      descriptor: {
                        name: "Therapeutics",
                      },
                      category_ids: [
                        "hearing_impairment_hi",
                        "intellectual_disability_id",
                        "dwarfism",
                        "locomotor_disability",
                        "multiple_disabilities",
                        "speech_and_language_disability",
                        "cerebral_palsy",
                        "visual_impairment_vi",
                        "mental_illness",
                        "specific_learning_disabilities",
                        "autism_spectrum_disorder",
                      ],
                      tags: [
                        {
                          code: "disability_type",
                          value: "Hearing Impairment (HI)",
                        },
                        {
                          code: "disability_type",
                          value: "Intellectual Disability (ID)",
                        },
                        {
                          code: "disability_type",
                          value: "Dwarfism",
                        },
                        {
                          code: "disability_type",
                          value: "Locomotor Disability",
                        },
                        {
                          code: "disability_type",
                          value: "Multiple Disabilities",
                        },
                        {
                          code: "disability_type",
                          value: "Speech and Language disability",
                        },
                        {
                          code: "disability_type",
                          value: "Cerebral Palsy",
                        },
                        {
                          code: "disability_type",
                          value: "Visual Impairment (VI)",
                        },
                        {
                          code: "disability_type",
                          value: "Mental Illness",
                        },
                        {
                          code: "disability_type",
                          value: "Specific Learning Disabilities",
                        },
                        {
                          code: "disability_type",
                          value: "Autism Spectrum Disorder",
                        },
                      ],
                    },
                  ],
                },
              ],
              categories: [
                {
                  id: "cerebral_palsy",
                  descriptor: {
                    code: "Cerebral Palsy",
                  },
                },
                {
                  id: "hearing_impairment_hi",
                  descriptor: {
                    code: "Hearing Impairment (HI)",
                  },
                },
                {
                  id: "intellectual_disability_id",
                  descriptor: {
                    code: "Intellectual Disability (ID)",
                  },
                },
                {
                  id: "multiple_disabilities",
                  descriptor: {
                    code: "Multiple Disabilities",
                  },
                },
                {
                  id: "speech_and_language_disability",
                  descriptor: {
                    code: "Speech and Language disability",
                  },
                },
                {
                  id: "dwarfism",
                  descriptor: {
                    code: "Dwarfism",
                  },
                },
                {
                  id: "locomotor_disability",
                  descriptor: {
                    code: "Locomotor Disability",
                  },
                },
                {
                  id: "visual_impairment_vi",
                  descriptor: {
                    code: "Visual Impairment (VI)",
                  },
                },
                {
                  id: "autism_spectrum_disorder",
                  descriptor: {
                    code: "Autism Spectrum Disorder",
                  },
                },
                {
                  id: "specific_learning_disabilities",
                  descriptor: {
                    code: "Specific Learning Disabilities",
                  },
                },
                {
                  id: "mental_illness",
                  descriptor: {
                    code: "Mental Illness",
                  },
                },
                {
                  id: "muscular_dystrophy",
                  descriptor: {
                    code: "Muscular Dystrophy",
                  },
                },
              ],
            },
          },
        },
      },
    };
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
          responses: [rest],
        };
      }
    } catch (error) {
      console.error("Error in handleNetworkCheck:", error);
      throw new InternalServerErrorException(
        "Failed to process network check request"
      );
    }
  }

  private async checkNetworkAvailability(): Promise<boolean> {
    try {
      console.log("CHECKING NETWORK AVAILABILITY");
      const response = await axios.get(`${process.env.NETWORK_CHECK_URL}`, {
        timeout: 10000, // 10 second timeout
      });
      // If response is 404 and contains "Cannot GET", consider network available
      if (
        response.status === 404 &&
        response.data &&
        response.data.includes("Cannot POST")
      ) {
        console.log("Network is available (404 with 'Cannot GET')");
        return true;
      }

      console.log("Network is unavailable (unexpected response)");
      return false;
    } catch (error: any) {
      // Check if the error is actually a 404 with "Cannot GET" - this means network is available
      if (
        error.response?.status === 404 &&
        error.response?.data &&
        error.response.data.includes("Cannot GET")
      ) {
        console.log(
          "Network is available (404 with 'Cannot GET' in error response)"
        );
        return true;
      }

      console.log("Network is unavailable (error):", error.message);
      return false;
    }
  }

  private async callNetworkAPI(body: any) {
    try {
      const networkResponse = await axios.post(
        `${process.env.NETWORK_BASE_URL}/mobility/search`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000, // 30 second timeout
        }
      );

      console.log("Network API call successful", networkResponse.data);

      // Network API already returns data in the correct format (wrapped in response array)
      return networkResponse.data;
    } catch (error) {
      console.error("Network API error:", error);
      throw new InternalServerErrorException("Failed to call network API");
    }
  }

  /**
   * Fetch latest data from Hasura GraphQL engine
   * The query fetches recently created rows from the `records` table.
   * You can change table / columns as per your schema.
   */
  public async fetchDataFromDB() {
    // GraphQL query as a plain string (Hasura expects `query` to be a string)
    const query = `query MyQuery {
  tan_cached_db(order_by: {created_at: desc}, limit: 1) {
   	id
    transaction_id
    message_id
    bap_id
    bpp_uri
    action
    providers
    providers_contact
    providers_locations
    items
    item_tags
    created_at
    timestamp
  }
}
`;
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.HASURA_BASE_URL}`,
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
      },
      data: JSON.stringify({ query }),
    };

    try {
      const response = await axios.request(config);
      return response.data; // already JSON
    } catch (error) {
      console.error("Hasura fetch error:", error);
      throw new InternalServerErrorException("Failed to fetch data from DB");
    }
  }
}
