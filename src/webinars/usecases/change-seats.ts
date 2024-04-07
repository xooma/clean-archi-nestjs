import { User } from '../../users/entities/user.entity';
import { AbstractWebinarRepository } from '../ports/abstract-webinar-repository';

type Request = {
  user: User,
  webinarId: string,
  seats: number
}

type Response = void;

export class ChangeSeats {
  constructor(private webinarRepository: AbstractWebinarRepository) {}

  async execute({ user, webinarId, seats }: Request): Promise<Response> {
    const webinar = await this.webinarRepository.findById(webinarId);

    if (!webinar) {
      throw new Error('Webinar not found');
    }

    if (webinar.props.organizerId !== user.props.id) {
      throw new Error('You are not allowed to update this webinar');
    }

    if (seats < webinar.props.seats) {
      throw new Error('You cannot the reduce the number of seats');
    }

    webinar.update({ seats });

    if (webinar.hasTooManySeats()) {
      throw new Error('The webinar must have a maximum of 1000 seats');
    }

    await this.webinarRepository.update(webinar);
  }
}