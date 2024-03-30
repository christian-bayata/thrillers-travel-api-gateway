import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map, Observable } from 'rxjs';
import { PublisherPattern } from 'src/common/interfaces/publisher-pattern.enum';
import { CreatePlaneDto } from './dto/create-plane.dto';

@Injectable()
export class FlightBookingMicroserviceService {
  constructor(
    @Inject('FLIGHT_BOOKING_SERVICE')
    private readonly clientAuthService: ClientProxy,
  ) {}

  private readonly ISE: string = 'Internal server error';

  createPlane(createPlaneDto: CreatePlaneDto): Observable<any> {
    try {
      return this.clientAuthService.send<any>(
        { cmd: PublisherPattern.CREATE_PLANE },
        createPlaneDto,
      );
    } catch (error) {
      throw new HttpException(
        error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500,
      );
    }
  }

  updatePlane(createPlaneDto: CreatePlaneDto): Observable<any> {
    try {
      return this.clientAuthService.send<any>(
        { cmd: PublisherPattern.CREATE_PLANE },
        createPlaneDto,
      );
    } catch (error) {
      throw new HttpException(
        error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500,
      );
    }
  }
}
