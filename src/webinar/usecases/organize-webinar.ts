import { AbstractWebinarRepository } from '../ports/abstract-webinar-repository';
import { Webinar } from '../entities/webinar.entity';
import { AbstractDateGenerator, AbstractIDGenerator } from '../../core/ports';
import { IExecutable } from '../../shared/executable.interface';
import { User } from '../../user/entities/user.entity';
import { WebinarImminentException } from '../exceptions/webinar-cancel-impossible.exception';
import { DomainException } from '../../shared/exception';

type Request = {
  user: User;
  title: string;
  seats: number;
  startDate: Date;
  endDate: Date;
};

type Response = { id: string };

export class OrganizeWebinar implements IExecutable<Request, Response>{
  constructor(
    private readonly repository: AbstractWebinarRepository,
    private readonly idGenerator: AbstractIDGenerator,
    private readonly dateGenerator: AbstractDateGenerator,
  ) {}

  async execute(data: Request): Promise<Response> {
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
      throw new WebinarImminentException();
    }

    if (webinar.hasTooManySeats()) {
      throw new DomainException('The webinar must have a maximum of 1000 seats');
    }

    if (webinar.hasNoSeats()) {
      throw new DomainException('The webinar must have at least 1 seat');
    }

    await this.repository.create(webinar);

    return { id };
  }
}
