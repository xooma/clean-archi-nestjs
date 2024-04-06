import { Body, Controller, Post } from '@nestjs/common';
import { z } from 'zod';

import { OrganizeWebinaire } from '../usecases';
import { User } from '../entities';
import { ZodValidationPipe } from '../pipes';

const schema = z.object({
  title: z.string(),
  seats: z.number(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

@Controller()
export class AppController {
  constructor(private organizeWebinaire: OrganizeWebinaire) {}

  @Post('/webinaires')
  async handleOrganizeWebinaire(
    @Body(new ZodValidationPipe(schema)) body: z.infer<typeof schema>,
  ): Promise<{ id: string }> {
    return this.organizeWebinaire.execute({
      user: new User({ id: 'john-doe' }),
      title: body.title,
      seats: body.seats,
      startDate: body.startDate,
      endDate: body.endDate,
    });
  }
}
