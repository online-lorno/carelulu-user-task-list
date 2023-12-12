import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableShutdownHooks();
  app.enableCors();

  const port = process.env.PORT ?? 5001;
  await app.listen(port);
  console.log(`Application is running using port: ${port}`);
}
bootstrap();
