import { TestApp } from '../utils/test-app';
import { IFixture } from '../utils/fixture.interface';
import { Webinar } from '../../webinars/entities/webinar.entity';
import { AbstractWebinarRepository } from '../../webinars/ports/abstract-webinar-repository';

export class WebinarFixture implements IFixture {
  constructor(public entity: Webinar) {}

  async load(app: TestApp): Promise<void> {
    const repository = app.get<AbstractWebinarRepository>(
      AbstractWebinarRepository,
    );
    await repository.create(this.entity);
  }
}
