import { IIDGenerator, IWebinaireRepository } from '../ports';
import { Webinaire } from '../entities';

export class OrganizeWebinaire {
  constructor(private repository: IWebinaireRepository, private readonly idGenerator: IIDGenerator) {}

  async execute(data: {
    title: string;
    seats: number;
    startDate: Date;
    endDate: Date;
  }) {
    const id = this.idGenerator.generate();

    await this.repository.create(new Webinaire({ id, ...data }));

    return { id: 'id-1' };
  }
}
