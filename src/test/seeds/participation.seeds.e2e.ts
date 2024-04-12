import { e2eUsers } from './user.seeds.e2e';
import { ParticipationFixture } from '../fixtures/participation.fixture';
import { Participation } from '../../participation/entities/participation.entity';
import { e2eWebinars } from './webinar.seeds.e2e';

export const e2eParticipation = {
  charlesLeclerc: new ParticipationFixture(
    new Participation({
      userId: e2eUsers.charlesLeclerc.entity.props.id,
      webinarId: e2eWebinars.johnDoe.entity.props.id,
    }),
  ),
};