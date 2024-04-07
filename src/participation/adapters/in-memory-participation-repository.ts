import { AbstractParticipationRepository } from '../ports/abstract-participation-repository';
import { Participation } from '../entities/participation.entity';

export class InMemoryParticipationRepository implements AbstractParticipationRepository {
  constructor(public readonly database: Participation[] = []) {}

  async findById(id: string): Promise<Participation[] | null> {
    return this.database.filter((participation) => participation.props.webinarId === id) || null;
  }

  async create(participation: Participation): Promise<void> {
    return;
  }

  async update(participation: Participation): Promise<void> {
    return;
  }
}