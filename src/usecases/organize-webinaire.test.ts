import { OrganizeWebinaire } from './organize-webinaire';
import { FixedDateGenerator, FixedIDGenerator, InMemoryWebinaireRepository } from '../adapters';
import { User, Webinaire } from '../entities';

describe('Feature: organizing a webinaire', () => {
  function expectedWebinaireToEqual(webinaire: Webinaire) {
    expect(webinaire.props).toEqual({
      id: 'id-1',
      organizerId: 'john-doe',
      title: 'My first webinaire',
      seats: 100,
      startDate: new Date('2024-01-10T10:00:00Z'),
      endDate: new Date('2024-01-10T11:00:00Z'),
    });
  }

  const johnDoe = new User({ id: 'john-doe', email: 'johndoe@gmail.com', password: 'azerty' });
  let repository: InMemoryWebinaireRepository;
  let idGenerator: FixedIDGenerator;
  let dateGenerator: FixedDateGenerator;
  let useCase: OrganizeWebinaire;

  beforeEach(() => {
    repository = new InMemoryWebinaireRepository();
    idGenerator = new FixedIDGenerator();
    dateGenerator = new FixedDateGenerator();
    useCase = new OrganizeWebinaire(repository, idGenerator, dateGenerator);
  });

  describe('Scenario: Happy path', () => {
    const payload = {
      user: johnDoe,
      title: 'My first webinaire',
      seats: 100,
      startDate: new Date('2024-01-10T10:00:00Z'),
      endDate: new Date('2024-01-10T11:00:00Z'),
    };

    it('should return the id', async () => {
      const result = await useCase.execute(payload);

      expect(result).toEqual({ id: 'id-1' });
    });

    it('should insert the webinaire to the database', async () => {
      await useCase.execute(payload);

      expect(repository.database.length).toBe(1);

      const createdWebinaire = repository.database[0];
      expectedWebinaireToEqual(createdWebinaire);
    });
  });

  describe('Scenario: the webinaire happens too soon', () => {
    const payload = {
      user: johnDoe,
      title: 'My first webinaire',
      seats: 1001,
      startDate: new Date('2024-01-10T10:00:00Z'),
      endDate: new Date('2024-01-10T11:00:00Z'),
    };

    it('should throw an error', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        'The webinaire must have a maximum of 1000 seats',
      );
    });

    it('should not insert the webinaire to the database', async () => {
      try {
        await useCase.execute(payload)
      } catch (e) {}

      expect(repository.database.length).toBe(0);
    });
  });

  describe('Scenario: the webinaire have too many seats', () => {
    const payload = {
      user: johnDoe,
      title: 'My first webinaire',
      seats: 1001,
      startDate: new Date('2024-01-10T10:00:00Z'),
      endDate: new Date('2024-01-10T11:00:00Z'),
    };

    it('should throw an error', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        'The webinaire must have a maximum of 1000 seats',
      );
    });

    it('should not insert the webinaire to the database', async () => {
      try {
        await useCase.execute(payload)
      } catch (e) {}

      expect(repository.database.length).toBe(0);
    });
  });

  describe('Scenario: the webinaire does not have enough seats', () => {
    const payload = {
      user: johnDoe,
      title: 'My first webinaire',
      seats: 0,
      startDate: new Date('2024-01-10T10:00:00Z'),
      endDate: new Date('2024-01-10T11:00:00Z'),
    };

    it('should throw an error', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        'The webinaire must have at least 1 seat',
      );
    });

    it('should not insert the webinaire to the database', async () => {
      try {
        await useCase.execute(payload)
      } catch (e) {}

      expect(repository.database.length).toBe(0);
    });
  });
});
