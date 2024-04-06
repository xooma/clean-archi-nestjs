import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { addDays } from 'date-fns';

import { AppService } from './app.service';
import { OrganizeWebinaire } from '../usecases/organize-webinaire';
import { User } from '../entities';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private organizeWebinaire: OrganizeWebinaire,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/webinaires')
  async handleOrganizeWebinaire(@Body() body: any): Promise<{ id: string }> {
    return this.organizeWebinaire.execute({
      user: new User({ id: 'john-doe' }),
      title: body.title,
      seats: body.seats,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    });
  }
}
