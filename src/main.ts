import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('QrCode');

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const configService = app.get(ConfigService);

  const port = configService.get<string>('PORT');
  app.setGlobalPrefix('api/v1');

  await app.listen(port, () => logger.log(`App running on Port: ${port}`));
}
bootstrap();
