import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { StreamingGateway } from './streaming/streaming.gateway';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private socketI: StreamingGateway) { }

  @Get()
  getHello(): { message: string } {
    this.socketI.handleMessage("message", {
      message: "Hello world"
    })
    return { message: this.appService.getHello() };
  }
}
