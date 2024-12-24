import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'This message means everything is running well, welcome to candhr api :)';
  }
}
