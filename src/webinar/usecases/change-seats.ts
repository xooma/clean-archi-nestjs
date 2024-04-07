import { AbstractWebinarRepository } from '../ports/abstract-webinar-repository';
import { IExecutable } from '../../shared/executable.interface';
import { User } from '../../user/entities/user.entity';
import { WebinarUpdateForbiddenException } from '../exceptions/webinar-update-forbidden.exception';
import { WebinarNotFoundException } from '../exceptions/webinar-not-found.exception';
import { DomainException } from '../../shared/exception';

type Request = {
  user: User,
  webinarId: string,
  seats: number
}

type Response = void;

export class ChangeSeats implements IExecutable<Request, Response> {
  constructor(private webinarRepository: AbstractWebinarRepository) {}

  async execute({ user, webinarId, seats }: Request): Promise<Response> {
    const webinar = await this.webinarRepository.findById(webinarId);

    if (!webinar)
      throw new WebinarNotFoundException();

    if (!webinar.isOrganizer(user.props.id))
      throw new WebinarUpdateForbiddenException()

    if (seats < webinar.props.seats)
      throw new DomainException('You cannot the reduce the number of seats');

    webinar.update({ seats });

    if (webinar.hasTooManySeats())
      throw new DomainException('The webinar must have a maximum of 1000 seats');

    await this.webinarRepository.update(webinar);
  }
}