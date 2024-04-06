import { IDateGenerator, IIDGenerator, IWebinaireRepository } from '../ports';
import { User, Webinaire } from '../entities';

export class OrganizeWebinaire {
  constructor(
    private readonly repository: IWebinaireRepository,
    private readonly idGenerator: IIDGenerator,
    private readonly dateGenerator: IDateGenerator,
  ) {}

  async execute(data: {
    user: User;
    title: string;
    seats: number;
    startDate: Date;
    endDate: Date;
  }) {
    const id = this.idGenerator.generate();
    const webinaire = new Webinaire({
      id,
      organizerId: data.user.props.id,
      title: data.title,
      seats: data.seats,
      startDate: data.startDate,
      endDate: data.endDate,
    });

    if (webinaire.isTooClose(this.dateGenerator.now())) {
      throw new Error('The webinaire must happen at least 3 days from now');
    }

    if (webinaire.hasTooManySeats()) {
      throw new Error('The webinaire must have a maximum of 1000 seats');
    }

    if (!webinaire.hasNoSeats()) {
      throw new Error('The webinaire must have at least 1 seat');
    }

    await this.repository.create(webinaire);

    return id;
  }
}
