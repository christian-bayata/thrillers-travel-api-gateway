import { Module } from '@nestjs/common';
import { AuthMicroserviceService } from './auth-microservice.service';
import { AuthMicroserviceController } from './auth-microservice.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

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
export class AuthMicroserviceModule {}
