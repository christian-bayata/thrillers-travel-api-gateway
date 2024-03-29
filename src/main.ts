import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpLogger } from './common/middlewares/http-logger.middleware';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('MAIN');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/v1');
  app.enableCors();

  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');
  app.use(new HttpLogger().use);

  await app.listen(port, () => logger.log(`App running on Port: ${port}`));
}
bootstrap();
