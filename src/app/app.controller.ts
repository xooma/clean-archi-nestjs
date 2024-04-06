import { Body, Controller, Post } from '@nestjs/common';

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
  ): Promise<WebinaireApi.Webinaire.Response> {
    return this.organizeWebinaire.execute({
      user: new User({ id: 'john-doe' }),
      title: body.title,
      seats: body.seats,
      startDate: body.startDate,
      endDate: body.endDate,
    });
  }
}
