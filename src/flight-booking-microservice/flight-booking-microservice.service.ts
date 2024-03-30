import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map, Observable } from 'rxjs';
import { PublisherPattern } from 'src/common/interfaces/publisher-pattern.enum';
import { CreatePlaneDto, UpdatePlaneDto } from './dto/create-plane.dto';
import { RetrievePlanesDto } from './dto/retrieve-planes.dto';

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

  updatePlane(updatePlaneDto: UpdatePlaneDto): Observable<any> {
    try {
      return this.clientAuthService.send<any>(
        { cmd: PublisherPattern.UPDATE_PLANE },
        updatePlaneDto,
      );
    } catch (error) {
      throw new HttpException(
        error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500,
      );
    }
  }

  retrieveSinglePlane(planeId: string): Observable<any> {
    try {
      return this.clientAuthService.send<any>(
        { cmd: PublisherPattern.RETRIEVE_PLANE },
        planeId,
      );
    } catch (error) {
      throw new HttpException(
        error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500,
      );
    }
  }

  retrieveAllPlanes(retrievePlanesDto: RetrievePlanesDto): Observable<any> {
    try {
      return this.clientAuthService.send<any>(
        { cmd: PublisherPattern.RETRIEVE_ALL_PLANES },
        retrievePlanesDto,
      );
    } catch (error) {
      throw new HttpException(
        error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500,
      );
    }
  }
}
