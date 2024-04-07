import { ChangeSeats } from './change-seats';
import { User } from '../../users/entities/user.entity';
import { Webinar } from '../entities/webinar.entity';
import { InMemoryWebinarRepository } from '../adapters/in-memory-webinar-repository';

describe('Feature: changing the number of seats', () => {
  async function expectSeatsToRemainTheSame() {
    const webinar = await webinarRepository.findById('id-1');
    expect(webinar!.props.seats).toBe(50);
  }

  const johnDoe = new User({
    id: 'john-doe',
    email: 'johndoe@gmail.com',
    password: 'azerty',
  });

  const billyBob = new User({
    id: 'billy-bob',
    email: 'billybob@gmail.com',
    password: 'azerty',
  });

  const webinar = new Webinar({
    id: 'id-1',
    organizerId: 'john-doe',
    title: 'My first webinar',
    seats: 50,
    startDate: new Date('2023-01-10T10:00:00.000Z'),
    endDate: new Date('2023-01-10T11:00:00.000Z'),
  })

  let webinarRepository: InMemoryWebinarRepository;
  let useCase: ChangeSeats;

  beforeEach(() => {
    webinarRepository = new InMemoryWebinarRepository([webinar]);
    useCase = new ChangeSeats(webinarRepository);
  });

  describe('Scenario: happy path', () => {
    it('should change the number of seats', async () => {
      await useCase.execute({
        user: johnDoe,
        webinarId: 'id-1',
        seats: 100,
      });

      const webinar = await webinarRepository.findById('id-1');
      expect(webinar?.props.seats).toBe(100);
    });
  });

  describe('Scenario: webinar does not exist', () => {
    it('should fail', async () => {
      await expect(useCase.execute({
        user: johnDoe,
        webinarId: 'id-2',
        seats: 100,
      })).rejects.toThrow('Webinar not found');

      await expectSeatsToRemainTheSame();
    })
  });

  describe('Scenario: updating the webinar of someone else', () => {
    it('should fail', async () => {
      await expect(useCase.execute({
        user: billyBob,
        webinarId: 'id-1',
        seats: 100,
      })).rejects.toThrow('You are not allowed to update this webinar');

      await expectSeatsToRemainTheSame();
    })
  });

  describe('Scenario: reducing the number of seats', () => {
    it('should fail', async () => {
      await expect(useCase.execute({
        user: johnDoe,
        webinarId: 'id-1',
        seats: 49,
      })).rejects.toThrow('You cannot the reduce the number of seats');

      await expectSeatsToRemainTheSame();
    })
  });

  describe('Scenario: reducing the number of seats', () => {
    it('should fail', async () => {
      await expect(useCase.execute({
        user: johnDoe,
        webinarId: 'id-1',
        seats: 1001,
      })).rejects.toThrow('The webinar must have a maximum of 1000 seats');

      await expectSeatsToRemainTheSame();
    })
  });
});
