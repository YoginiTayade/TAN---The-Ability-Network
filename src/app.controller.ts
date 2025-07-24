import {
  Controller,
  Post,
  Body,
  Get,
} from "@nestjs/common";
import { AppService } from "./app.service";

@Controller("")
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) { }
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  //mobility
  @Post("mobility/search")
  getContent(@Body() body: any) {
    console.log("search api calling->>>");
    //return this.appService.getCoursesFromFln(body);
    if (body?.message?.intent?.category?.descriptor?.code?.toLowerCase() == 'disability_services') {
      console.log("Inside TAN search");
      return this.appService.handleTanSearch(body)
    }

  }
}
