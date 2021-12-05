import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  homeController(): string {
    return 'peerstake server';
  }

  @Get('status')
  getStatusController(): string {
    return this.appService.getServerStatus();
  }
}
