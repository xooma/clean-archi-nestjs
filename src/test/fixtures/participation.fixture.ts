import { TestApp } from '../utils/test-app';
import { IFixture } from '../utils/fixture.interface';
import { Participation } from '../../participation/entities/participation.entity';
import { AbstractParticipationRepository } from '../../participation/ports/abstract-participation-repository';

export class ParticipationFixture implements IFixture {
  constructor(public entity: Participation) {}

  async load(app: TestApp): Promise<void> {
    const repository = app.get<AbstractParticipationRepository>(AbstractParticipationRepository);
    await repository.create(this.entity);
  }
}
