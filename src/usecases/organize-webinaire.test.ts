import { IIDGenerator, IWebinaireRepository, OrganizeWebinaire, Webinaire } from './organize-webinaire';

describe('Feature: organizing a webinaire', () => {
  it('should create a webinaire', async () => {
    class WebinaireRepository implements IWebinaireRepository {
      public database: Webinaire[] = [];

      async create(webinaire: Webinaire): Promise<void> {
        this.database.push(webinaire);
      }
    }

    class FixedIDGenerator implements IIDGenerator {
      generate() {
        return 'id-1';
      }
    }

    const repository = new WebinaireRepository();
    const idGenerator = new FixedIDGenerator();

    const useCase = new OrganizeWebinaire(repository, idGenerator);
    const result = await useCase.execute({
      title: 'My first webinaire',
      seats: 100,
      startDate: new Date('2024-01-01T10:00:00Z'),
      endDate: new Date('2024-01-01T11:00:00Z'),
    });

    expect(repository.database.length).toBe(1);

    const createdWebinaire = repository.database[0];

    expect(createdWebinaire.props.id).toEqual('id-1');
    expect(createdWebinaire.props.title).toBe('My first webinaire');
    expect(createdWebinaire.props.seats).toBe(100);
    expect(createdWebinaire.props.startDate).toEqual(new Date('2024-01-01T10:00:00Z'));
    expect(createdWebinaire.props.endDate).toEqual(new Date('2024-01-01T11:00:00Z'));
    expect(result.id).toEqual('id-1');
  });
});
