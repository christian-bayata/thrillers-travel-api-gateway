import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map, Observable } from 'rxjs';
import { PublisherPattern } from 'src/common/interfaces/publisher-pattern.enum';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthMicroserviceService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly clientAuthService: ClientProxy,
  ) {}

  private readonly ISE: string = 'Internal server error';

  connection(): Observable<string> {
    return this.clientAuthService
      .send<string>({ cmd: PublisherPattern.CONNECTION_CHECK }, {})
      .pipe(map((message: string) => message));
  }

  createNewUser(createUserDto: CreateUserDto): Observable<any> {
    try {
      return this.clientAuthService.send<any>(
        { cmd: PublisherPattern.CREATE_NEW_USER },
        createUserDto,
      );
    } catch (error) {
      throw new HttpException(
        error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500,
      );
    }
  }
}
