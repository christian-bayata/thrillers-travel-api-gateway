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
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { catchError, map, Observable } from 'rxjs';
import { FlightBookingMicroserviceService } from './flight-booking-microservice.service';

import { AllGlobalExceptionsFilter } from 'src/filters/rcp-filter.filter';

import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { CreatePlaneDto, UpdatePlaneDto } from './dto/create-plane.dto';
import { RoleGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/guard/decorator/roles.decorator';
import { Role } from 'src/common/interfaces/role.interface';
import { RetrievePlanesDto } from './dto/retrieve-planes.dto';

@Controller('flight-booking-microservice')
@UseFilters(AllGlobalExceptionsFilter)
export class FlightBookingMicroserviceController {
  constructor(
    private readonly flightBookingMicroserviceService: FlightBookingMicroserviceService,
  ) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  createPlane(
    @Body() createPlaneDto: CreatePlaneDto,
    @Res() res: Response,
    @Req() req: any,
  ): Observable<Response> {
    createPlaneDto.userId = req.user.user_id;
    return this.flightBookingMicroserviceService
      .createPlane(createPlaneDto)
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
      )
      .pipe(
        map((resp) => {
          return res.status(201).json({
            message: 'Successfully created plane info!',
            data: resp,
          });
        }),
      );
  }

  @Patch('update/:planeId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  updatePlane(
    @Res() res: Response,
    @Req() req: any,
    @Param('planeId') planeId: string,
    @Body() updatePlaneDto: UpdatePlaneDto,
  ): Observable<Response> {
    updatePlaneDto.planeId = planeId;
    return this.flightBookingMicroserviceService
      .updatePlane(updatePlaneDto)
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
      )
      .pipe(
        map((resp) => {
          return res.status(200).json({
            message: 'Successfully updated plane info!',
            data: resp,
          });
        }),
      );
  }

  @Get('retrieve/:planeId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  retrieveSinglePlane(
    @Res() res: Response,
    @Req() req: any,
    @Param('planeId') planeId: string,
  ): Observable<Response> {
    return this.flightBookingMicroserviceService
      .retrieveSinglePlane(planeId)
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
      )
      .pipe(
        map((resp) => {
          return res.status(200).json({
            message: 'Successfully retrieved plane info!',
            data: resp,
          });
        }),
      );
  }

  @Get('retrieve-all-planes')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  retrieveAllPlanes(
    @Res() res: Response,
    @Req() req: any,
    @Query('batch') batch: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
  ): Observable<Response> {
    function payload(): RetrievePlanesDto {
      return {
        batch: +batch,
        limit: +limit,
        search,
        userId: req.user.user_id,
      };
    }

    return this.flightBookingMicroserviceService
      .retrieveAllPlanes(payload())
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
      )
      .pipe(
        map((resp) => {
          return res.status(200).json({
            message: 'Successfully retrieved all planes',
            data: resp,
          });
        }),
      );
  }

  @Delete('delete/:planeId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  deleteSinglePlane(
    @Res() res: Response,
    @Req() req: any,
    @Param('planeId') planeId: string,
  ): Observable<Response> {
    return this.flightBookingMicroserviceService
      .deleteSinglePlane(planeId)
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
      )
      .pipe(
        map((resp) => {
          return res.status(200).json({
            message: 'Successfully deleted plane info!',
            data: resp,
          });
        }),
      );
  }
}
