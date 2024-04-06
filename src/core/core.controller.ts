import { Controller, Get } from '@nestjs/common';
import { CoreService } from './core.service';

@Controller()
export class CoreController {
  constructor(private coreService: CoreService) {}

  @Get()
  getHello(): string {
    return this.coreService.getHello();
  }
}
