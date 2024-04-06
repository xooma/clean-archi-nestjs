type WebinaireProps = {
  id: string;
  title: string;
  seats: number;
  startDate: Date;
  endDate: Date;
};

export class Webinaire {
  constructor(public props: WebinaireProps) {}
}

export interface IWebinaireRepository {
  create(webinaire: Webinaire): Promise<void>;
}

export interface IIDGenerator {
  generate(): string;
}

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
