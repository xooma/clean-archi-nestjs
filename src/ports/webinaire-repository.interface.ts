import { Webinaire } from '../entities';

export interface IWebinaireRepository {
  create(webinaire: Webinaire): Promise<void>;
}