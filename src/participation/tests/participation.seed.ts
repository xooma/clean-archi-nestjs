import { Participation } from '../entities/participation.entity';
import { testUsers } from '../../user/tests/user.seeds';
import { testWebinars } from '../../webinar/tests/webinar.seeds';

export const testParticipations = {
  aliceFoo: new Participation({
    userId: testUsers.aliceFoo.props.id,
    webinarId: testWebinars.billyBob.props.id,
  }),
  billyBob: new Participation({
    userId: testUsers.billyBob.props.id,
    webinarId: testWebinars.aliceFoo.props.id,
  }),
};
