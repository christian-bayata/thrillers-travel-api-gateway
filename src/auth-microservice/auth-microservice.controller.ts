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
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { UpdateUserDto } from './dto/update-user.dto';

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

  @Post('forgot-password')
  forgotPassword(
    @Res() res: Response,
    @Body('email') email: string,
  ): Observable<Response> {
    return this.authMicroserviceService
      .forgotPassword(email)
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
      )
      .pipe(
        map((resp) => {
          return res.status(200).json({
            message: 'Successfully sent password reset email',
            data: resp,
          });
        }),
      );
  }

  @Post('reset-password/:token')
  resetPassword(
    @Res() res: Response,
    @Param('token') token: string,
    @Body('password') password: string,
    @Body('confirmPassword') confirmPassword: string,
  ): Observable<Response> {
    function payload(): ResetPasswordDto {
      return {
        token,
        password,
        confirmPassword,
      };
    }

    return this.authMicroserviceService
      .resetPassword(payload())
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
      )
      .pipe(
        map((resp) => {
          return res.status(200).json({
            message: 'Successfully reset password',
            data: resp,
          });
        }),
      );
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  userProfile(@Res() res: Response, @Req() req: any): Observable<Response> {
    const userId = req.user.user_id;
    console.log(req);
    return this.authMicroserviceService
      .userProfile(userId)
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
      )
      .pipe(
        map((resp) => {
          return res.status(200).json({
            message: 'Successfully retrieved user profile',
            data: resp,
          });
        }),
      );
  }

  @Patch('/update/:userId')
  @UseGuards(JwtAuthGuard)
  updateUser(
    @Res() res: Response,
    @Req() req: any,
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Observable<Response> {
    updateUserDto.userId = req.user.user_id;
    return this.authMicroserviceService
      .updateUser(updateUserDto)
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
      )
      .pipe(
        map((resp) => {
          return res.status(200).json({
            message: 'Successfully updated user',
            data: resp,
          });
        }),
      );
  }
}
