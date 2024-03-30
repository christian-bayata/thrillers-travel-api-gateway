import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthMicroserviceModule } from './auth-microservice/auth-microservice.module';
import { existsSync, mkdirSync } from 'fs';
import * as path from 'path';
import { FlightBookingMicroserviceModule } from './flight-booking-microservice/flight-booking-microservice.module';
import { HotelReservationMicroserviceModule } from './hotel-reservation-microservice/hotel-reservation-microservice.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      expandVariables: true,
    }),
    AuthMicroserviceModule,
    FlightBookingMicroserviceModule,
    HotelReservationMicroserviceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    if (!existsSync(path.join(__dirname, '..', 'logs'))) {
      mkdirSync(path.join(__dirname, '..', 'logs'));
    }
    return;
  }
}
