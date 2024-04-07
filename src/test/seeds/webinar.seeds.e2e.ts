import { WebinarFixture } from '../fixtures/webinar.fixture';
import { Webinar } from '../../webinar/entities/webinar.entity';

export const e2eWebinars = {
  johnDoe: new WebinarFixture(
    new Webinar({
      id: 'id-1',
      organizerId: 'john-doe',
      title: 'My first webinar',
      startDate: new Date('2021-01-01T10:00:00Z'),
      endDate: new Date('2021-01-01T11:00:00Z'),
      seats: 100,
    }),
  ),
};