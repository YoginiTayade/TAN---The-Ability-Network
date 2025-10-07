import { Controller, Post, Body, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { SimpleCronService } from "./services/db-sync-cron-job";

@Controller("tan")
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly cronService: SimpleCronService,
  ) {}
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  //mobility
  @Post("mobility/search")
  getContent(@Body() body: any) {
    console.log("search api calling->>>");
    //return this.appService.getCoursesFromFln(body);
    if (
      body?.message?.intent?.category?.descriptor?.code?.toLowerCase() ==
      "disability_services"
    ) {
      console.log("Inside TAN search");
      return this.appService.handleTanSearch(body);
    }
  }
  @Post("p2p/search")
  async checkNetwork(@Body() body: any) {
    console.log("check-network api calling->>>");
    return this.appService.handleNetworkCheck(body);
  }

  @Post("v2/mobility/search")
  getV2Content(@Body() body: any) {
    console.log("search api calling->>>");
    //return this.appService.getCoursesFromFln(body);
    if (
      body?.message?.intent?.category?.descriptor?.code?.toLowerCase() ==
      "disability_services"
    ) {
      console.log("Inside TAN search");
      return this.appService.handleTanSearch(body);
    }
  }

  // Fetch latest records from DB via Hasura
  @Post("fetchDataFromDB")
  async fetchDataWithFilter(@Body() filters: any) {
    return await this.appService.fetchDataFromDB(filters);
  }
}
