import { Body, Controller, Delete, HttpCode, Param, Post, Request } from '@nestjs/common';
import { ZodValidationPipe } from '../../core/pipes';
import { CancelWebinar, ChangeDates, ChangeSeats, OrganizeWebinar } from '../usecases';
import { WebinarApi } from '../contract';
import { User } from '../../user/entities/user.entity';
import { ReserveSeat } from '../usecases/reserve-seat';

@Controller('webinars')
export class WebinarController {
  constructor(
    private organizeWebinar: OrganizeWebinar,
    private changeSeats: ChangeSeats,
    private changeDates: ChangeDates,
    private cancelWebinar: CancelWebinar,
    private reserveSeat: ReserveSeat,
  ) {}

  @Post()
  async handleOrganizeWebinar(
    @Body(new ZodValidationPipe(WebinarApi.Webinar.schema))
    body: WebinarApi.Webinar.Request,
    @Request() request: { user: User },
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
    @Body(new ZodValidationPipe(WebinarApi.ChangeSeats.schema))
    body: WebinarApi.ChangeSeats.Request,
    @Request() request: { user: User },
  ): Promise<WebinarApi.ChangeSeats.Response> {
    return this.changeSeats.execute({
      user: request.user,
      webinarId: id,
      seats: body.seats,
    });
  }

  @HttpCode(200)
  @Post(':id/dates')
  async handleChangeDates(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(WebinarApi.ChangeDates.schema))
      body: WebinarApi.ChangeDates.Request,
    @Request() request: { user: User },
  ): Promise<WebinarApi.ChangeDates.Response> {
    return this.changeDates.execute({
      user: request.user,
      webinarId: id,
      startDate: body.startDate,
      endDate: body.endDate,
    });
  }

  @HttpCode(200)
  @Delete(':id/cancel')
  async handleCancelWebinar(@Param('id') id: string, @Request() request: { user: User }): Promise<WebinarApi.Cancel.Response> {
    return this.cancelWebinar.execute({
      user: request.user,
      webinarId: id,
    });
  }

  @Post(':id/participations')
  async handleReserveSeat(@Param('id') id: string, @Request() request: { user: User }): Promise<WebinarApi.ReserveSeat.Response> {
    return this.reserveSeat.execute({ user: request.user, webinarId: id });
  }
}
