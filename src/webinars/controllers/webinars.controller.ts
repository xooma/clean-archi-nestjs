import { Body, Controller, Post, Request } from '@nestjs/common';
import { ZodValidationPipe } from '../../core/pipes';
import { User } from '../../users/entities/user.entity';
import { OrganizeWebinar } from '../usecases';
import { WebinarApi } from '../contract';

@Controller('webinars')
export class WebinarController {
  constructor(private organizeWebinar: OrganizeWebinar) {
  }

  @Post()
  async handleOrganizeWebinar(
    @Body(new ZodValidationPipe(WebinarApi.Webinar.schema)) body: WebinarApi.Webinar.Request,
    @Request() request: { user: User }
  ): Promise<WebinarApi.Webinar.Response> {
    return this.organizeWebinar.execute({
      user: request.user,
      title: body.title,
      seats: body.seats,
      startDate: body.startDate,
      endDate: body.endDate,
    });
  }
}
