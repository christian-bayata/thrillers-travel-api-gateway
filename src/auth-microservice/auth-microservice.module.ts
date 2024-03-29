import { Module, OnModuleInit } from '@nestjs/common';
import { AuthMicroserviceService } from './auth-microservice.service';
import { AuthMicroserviceController } from './auth-microservice.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { existsSync, mkdirSync } from 'fs';
import * as path from 'path';

@Module({
  controllers: [AuthMicroserviceController],
  providers: [AuthMicroserviceService, ConfigService],
  exports: [AuthMicroserviceService],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        inject: [ConfigService],
        useFactory: async (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: config.get('RABBITMQ'),
            queue: 'auth_microservice',
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
})
export class AppModule implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    if (!existsSync(path.join(__dirname, '..', 'logs'))) {
      mkdirSync(path.join(__dirname, '..', 'logs'));
    }
    return;
  }
}
