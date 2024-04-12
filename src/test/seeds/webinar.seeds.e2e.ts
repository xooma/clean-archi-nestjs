import { WebinarFixture } from '../fixtures/webinar.fixture';
import { Webinar } from '../../webinar/entities/webinar.entity';
import { addDays } from 'date-fns';
import { e2eUsers } from './user.seeds.e2e';

export const e2eWebinars = {
  johnDoe: new WebinarFixture(
    new Webinar({
      id: 'id-1',
      organizerId: e2eUsers.johnDoe.entity.props.id,
      title: 'My first webinar',
      startDate: addDays(new Date(), 4),
      endDate: addDays(new Date(), 5),
      seats: 50,
    }),
  ),
};