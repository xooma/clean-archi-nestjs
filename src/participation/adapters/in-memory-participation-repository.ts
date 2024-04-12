import { AbstractParticipationRepository } from '../ports/abstract-participation-repository';
import { Participation } from '../entities/participation.entity';
import { id } from 'date-fns/locale';
import { count } from 'rxjs';
import { undefined } from 'zod';

export class InMemoryParticipationRepository implements AbstractParticipationRepository {
  constructor(public readonly database: Participation[] = []) {}

  async findOne(userId: string, webinarId: string): Promise<Participation | null> {
    return (
      this.database.find(
        (participation) => participation.props.userId === userId && participation.props.webinarId === webinarId,
      ) ?? null
    );
  }

  async findByWebinarId(id: string): Promise<Participation[] | null> {
    return this.database.filter((participation) => participation.props.webinarId === id) || null;
  }

  async countParticipations(webinarId: string): Promise<number> {
    return this.database.reduce((count, participation) => {
      return participation.props.webinarId === webinarId ? count + 1 : count;
    }, 0)
  }

  async create(participation: Participation): Promise<void> {
    this.database.push(participation);
  }

  async delete(participation: Participation): Promise<void> {
    this.database.splice(this.database.indexOf(participation), 1);
  }
}
