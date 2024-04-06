import { IWebinaireRepository } from '../ports';
import { Webinaire } from '../entities';

export class InMemoryWebinaireRepository implements IWebinaireRepository {
  public database: Webinaire[] = [];

  async create(webinaire: Webinaire): Promise<void> {
    this.database.push(webinaire);
  }
}