import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { config } from "dotenv";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";

config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setViewEngine("ejs");
  app.setBaseViewsDir(join("src", ".", "views"));

  app.enableCors();

  await app.listen(3741);
}
bootstrap();
