import { Webinar } from '../entities/webinar.entity';
import { testUsers } from '../../user/tests/user.seeds';

export const testWebinars = {
  aliceFoo: new Webinar({
    id: 'id-1',
    organizerId: testUsers.aliceFoo.props.id,
    title: 'My first webinar',
    seats: 50,
    startDate: new Date('2023-01-10T10:00:00.000Z'),
    endDate: new Date('2023-01-10T11:00:00.000Z'),
  }),
  billyBob: new Webinar({
    id: 'id-2',
    organizerId: testUsers.billyBob.props.id,
    title: 'My first webinar',
    seats: 100,
    startDate: new Date('2023-03-20T10:00:00.000Z'),
    endDate: new Date('2023-03-20T11:00:00.000Z'),
  }),
};
