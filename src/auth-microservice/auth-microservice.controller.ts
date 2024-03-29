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
import { CreateUserDto } from './dto/create-user.dto';
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

  @Post('user/create')
  createNewUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ): Observable<Response> {
    return this.authMicroserviceService
      .createNewUser(createUserDto)
      .pipe(
        catchError((e) => {
          throw new HttpException(e.message, e.status);
        }),
      )
      .pipe(
        map((resp) => {
          return res.status(201).json({
            message: 'New User created!',
            data: resp,
          });
        }),
      );
  }
}
