import { AbstractWebinarRepository } from '../ports/abstract-webinar-repository';
import { Webinar } from '../entities/webinar.entity';
import { User } from '../../users/entities/user.entity';
import { AbstractDateGenerator, AbstractIDGenerator } from '../../core/ports';

export class OrganizeWebinar {
  constructor(
    private readonly repository: AbstractWebinarRepository,
    private readonly idGenerator: AbstractIDGenerator,
    private readonly dateGenerator: AbstractDateGenerator,
  ) {}

  async execute(data: {
    user: User;
    title: string;
    seats: number;
    startDate: Date;
    endDate: Date;
  }): Promise<{ id: string }> {
    const id = this.idGenerator.generate();
    const webinar = new Webinar({
      id,
      organizerId: data.user.props.id,
      title: data.title,
      seats: data.seats,
      startDate: data.startDate,
      endDate: data.endDate,
    });

    if (webinar.isTooClose(this.dateGenerator.now())) {
      throw new Error('The webinar must happen at least 3 days from now');
    }

    if (webinar.hasTooManySeats()) {
      throw new Error('The webinar must have a maximum of 1000 seats');
    }

    if (webinar.hasNoSeats()) {
      throw new Error('The webinar must have at least 1 seat');
    }

    await this.repository.create(webinar);

    return { id };
  }
}
