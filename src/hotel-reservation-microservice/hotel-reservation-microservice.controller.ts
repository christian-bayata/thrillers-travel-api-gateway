import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  UseFilters,
  HttpException,
  UseGuards,
  Req,
  Put,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
  Patch,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { catchError, map, Observable } from 'rxjs';
import { HotelReservationMicroserviceService } from './hotel-reservation-microservice.service';
import { AllGlobalExceptionsFilter } from 'src/filters/rcp-filter.filter';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { RoleGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/guard/decorator/roles.decorator';
import { Role } from 'src/common/interfaces/role.interface';

@Controller('hotel-reservation-microservice')
@UseFilters(AllGlobalExceptionsFilter)
export class HotelReservationMicroserviceController {
  constructor(
    private readonly hotelReservationMicroserviceService: HotelReservationMicroserviceService,
  ) {}

  @Post('create-reservation')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  createReservation(
    @Body() createReservationDto: CreateReservationDto,
    @Res() res: Response,
    @Req() req: any,
  ): Observable<Response> {
    createReservationDto.guestId = req.user.user_id;

    return this.hotelReservationMicroserviceService
      .createReservation(createReservationDto)
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
      )
      .pipe(
        map((resp) => {
          return res.status(201).json({
            message: 'Successfully created new hotel reservation!',
            data: resp,
          });
        }),
      );
  }
}
