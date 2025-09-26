import { Controller, Post, Body, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller("tan")
export class AppController {
  constructor(private readonly appService: AppService) {}
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
}
