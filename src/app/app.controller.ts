import { Body, Controller, Post, Request } from '@nestjs/common';

import { OrganizeWebinaire } from '../usecases';
import { User } from '../entities';
import { ZodValidationPipe } from '../pipes';
import { WebinaireApi } from './contract';

@Controller()
export class AppController {
  constructor(private organizeWebinaire: OrganizeWebinaire) {}

  @Post('/webinaires')
  async handleOrganizeWebinaire(
    @Body(new ZodValidationPipe(WebinaireApi.Webinaire.schema))
    body: WebinaireApi.Webinaire.Request,
    @Request() request: { user: User }
  ): Promise<WebinaireApi.Webinaire.Response> {
    return this.organizeWebinaire.execute({
      user: request.user,
      title: body.title,
      seats: body.seats,
      startDate: body.startDate,
      endDate: body.endDate,
    });
  }
}
