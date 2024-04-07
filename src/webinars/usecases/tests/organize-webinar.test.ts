import { Webinar } from '../../entities/webinar.entity';
import { InMemoryWebinarRepository } from '../../adapters/in-memory-webinar-repository';
import { FixedDateGenerator, FixedIDGenerator } from '../../../core/adapters';
import { OrganizeWebinar } from '../organize-webinar';
import { testUsers } from '../../../users/tests/user.seeds';

describe('Feature: organizing a webinar', () => {
  function expectedWebinarToEqual(webinar: Webinar) {
    expect(webinar.props).toEqual({
      id: 'id-1',
      organizerId: testUsers.aliceFoo.props.id,
      title: 'My first webinar',
      seats: 100,
      startDate: new Date('2024-01-10T10:00:00Z'),
      endDate: new Date('2024-01-10T11:00:00Z'),
    });
  }

  let repository: InMemoryWebinarRepository;
  let idGenerator: FixedIDGenerator;
  let dateGenerator: FixedDateGenerator;
  let useCase: OrganizeWebinar;

  beforeEach(() => {
    repository = new InMemoryWebinarRepository();
    idGenerator = new FixedIDGenerator();
    dateGenerator = new FixedDateGenerator();
    useCase = new OrganizeWebinar(repository, idGenerator, dateGenerator);
  });

  describe('Scenario: Happy path', () => {
    const payload = {
      user: testUsers.aliceFoo,
      title: 'My first webinar',
      seats: 100,
      startDate: new Date('2024-01-10T10:00:00Z'),
      endDate: new Date('2024-01-10T11:00:00Z'),
    };

    it('should return the id', async () => {
      const result = await useCase.execute(payload);

      expect(result).toEqual({ id: 'id-1' });
    });

    it('should insert the webinar to the database', async () => {
      await useCase.execute(payload);

      expect(repository.database.length).toBe(1);

      const createdWebinar = repository.database[0];
      expectedWebinarToEqual(createdWebinar);
    });
  });

  describe('Scenario: the webinar happens too soon', () => {
    const payload = {
      user: testUsers.aliceFoo,
      title: 'My first webinar',
      seats: 1001,
      startDate: new Date('2024-01-10T10:00:00Z'),
      endDate: new Date('2024-01-10T11:00:00Z'),
    };

    it('should throw an error', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        'The webinar must have a maximum of 1000 seats',
      );
    });

    it('should not insert the webinar to the database', async () => {
      try {
        await useCase.execute(payload);
      } catch (e) {}

      expect(repository.database.length).toBe(0);
    });
  });

  describe('Scenario: the webinar have too many seats', () => {
    const payload = {
      user: testUsers.aliceFoo,
      title: 'My first webinar',
      seats: 1001,
      startDate: new Date('2024-01-10T10:00:00Z'),
      endDate: new Date('2024-01-10T11:00:00Z'),
    };

    it('should throw an error', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        'The webinar must have a maximum of 1000 seats',
      );
    });

    it('should not insert the webinar to the database', async () => {
      try {
        await useCase.execute(payload);
      } catch (e) {}

      expect(repository.database.length).toBe(0);
    });
  });

  describe('Scenario: the webinar does not have enough seats', () => {
    const payload = {
      user: testUsers.aliceFoo,
      title: 'My first webinar',
      seats: 0,
      startDate: new Date('2024-01-10T10:00:00Z'),
      endDate: new Date('2024-01-10T11:00:00Z'),
    };

    it('should throw an error', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        'The webinar must have at least 1 seat',
      );
    });

    it('should not insert the webinar to the database', async () => {
      try {
        await useCase.execute(payload);
      } catch (e) {}

      expect(repository.database.length).toBe(0);
    });
  });
});
