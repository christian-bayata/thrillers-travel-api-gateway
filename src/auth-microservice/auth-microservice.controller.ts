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
import { AuthMicroserviceService } from './auth-microservice.service';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';
import { AllGlobalExceptionsFilter } from 'src/filters/rcp-filter.filter';
// import { JwtAuthGuard } from '../guard/jwt.guard';
// import { RoleGuard } from '../guard/role.guard';
// import { Roles } from '../guard/decorator/roles.decorator';
// import { Role } from '../common/interfaces/role.interfaces';

@Controller('auth-microservice')
@UseFilters(AllGlobalExceptionsFilter)
export class AuthMicroserviceController {
  constructor(
    private readonly authMicroserviceService: AuthMicroserviceService,
  ) {}

  @Get('/connect')
  connection(): Observable<any> {
    return this.authMicroserviceService.connection();
  }

  @Post('create-user')
  createNewUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ): Observable<Response> {
    return this.authMicroserviceService
      .createNewUser(createUserDto)
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
      )
      .pipe(
        map((resp) => {
          return res.status(201).json({
            message: 'Successfully created new user!',
            data: resp,
          });
        }),
      );
  }

  @Post('login')
  login(
    @Body() loginDto: LoginDto,
    @Res() res: Response,
  ): Observable<Response> {
    return this.authMicroserviceService
      .login(loginDto)
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
      )
      .pipe(
        map((resp) => {
          return res.status(200).json({
            message: 'Successfully logged in user!',
            data: resp,
          });
        }),
      );
  }

  @Post('activate-account/:id')
  accountActivation(
    @Res() res: Response,
    @Param('id') id: string,
  ): Observable<Response> {
    return this.authMicroserviceService
      .accountActivation(id)
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
      )
      .pipe(
        map((resp) => {
          return res.status(200).json({
            message: 'Successfully activated account!',
            data: resp,
          });
        }),
      );
  }
}
