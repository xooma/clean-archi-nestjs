import { Body, Controller, HttpCode, Param, Post, Request } from '@nestjs/common';
import { ZodValidationPipe } from '../../core/pipes';
import { User } from '../../users/entities/user.entity';
import { OrganizeWebinar } from '../usecases';
import { WebinarApi } from '../contract';
import { ChangeSeats } from '../usecases/change-seats';

@Controller('webinars')
export class WebinarController {
  constructor(private organizeWebinar: OrganizeWebinar, private changeSeats: ChangeSeats) {}

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

  @HttpCode(200)
  @Post(':id/seats')
  async handleChangeSeats(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(WebinarApi.ChangeSeats.schema)) body: WebinarApi.ChangeSeats.Request,
    @Request() request: { user: User }
  ): Promise<WebinarApi.ChangeSeats.Response> {
    return this.changeSeats.execute({
      user: request.user,
      webinarId: id,
      seats: body.seats,
    });
  }
}
