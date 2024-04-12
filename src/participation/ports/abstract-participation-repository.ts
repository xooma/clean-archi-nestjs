import { Participation } from '../entities/participation.entity';

export abstract class AbstractParticipationRepository {
  abstract findOne(userId: string, webinarId: string): Promise<Participation | null>;
  abstract findByWebinarId(webinarId: string): Promise<Participation[] | null>;
  abstract countParticipations(webinarId: string): Promise<number>;
  abstract create(participation: Participation): Promise<void>;
  abstract delete(participation: Participation): Promise<void>;
}