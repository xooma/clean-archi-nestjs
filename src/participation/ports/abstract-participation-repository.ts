import { Participation } from '../entities/participation.entity';

export abstract class AbstractParticipationRepository {
  abstract findById(id: string): Promise<Participation[] | null>;
  abstract create(participation: Participation): Promise<void>;
  abstract update(participation: Participation): Promise<void>;
}