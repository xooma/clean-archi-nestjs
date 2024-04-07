import { Webinar } from '../../entities/webinar.entity';
import { InMemoryWebinarRepository } from '../../adapters/in-memory-webinar-repository';
import { ChangeSeats } from '../change-seats';
import { testUsers } from '../../../users/tests/user.seeds';

describe('Feature: changing the number of seats', () => {
  async function expectSeatsToBeUnchanged() {
    const webinar = await webinarRepository.findById('id-1');
    expect(webinar!.props.seats).toBe(50);
  }

  const webinar = new Webinar({
    id: 'id-1',
    organizerId: testUsers.aliceFoo.props.id,
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
    const payload = {
      user: testUsers.aliceFoo,
      webinarId: 'id-1',
      seats: 100,
    };

    it('should change the number of seats', async () => {
      await useCase.execute(payload);

      const webinar = await webinarRepository.findById('id-1');
      expect(webinar?.props.seats).toBe(100);
    });
  });

  describe('Scenario: webinar does not exist', () => {
    const payload = {
      user: testUsers.aliceFoo,
      webinarId: 'id-2',
      seats: 100,
    };

    it('should fail', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow('Webinar not found');

      await expectSeatsToBeUnchanged();
    })
  });

  describe('Scenario: updating the webinar of someone else', () => {
    const payload = {
      user: testUsers.billyBob,
      webinarId: 'id-1',
      seats: 100,
    };

    it('should fail', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow('You are not allowed to update this webinar');

      await expectSeatsToBeUnchanged();
    })
  });

  describe('Scenario: reducing the number of seats', () => {
    const payload = {
      user: testUsers.aliceFoo,
      webinarId: 'id-1',
      seats: 49,
    };

    it('should fail', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow('You cannot the reduce the number of seats');

      await expectSeatsToBeUnchanged();
    })
  });

  describe('Scenario: reducing the number of seats', () => {
    const payload = {
      user: testUsers.aliceFoo,
      webinarId: 'id-1',
      seats: 1001,
    };

    it('should fail', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow('The webinar must have a maximum of 1000 seats');

      await expectSeatsToBeUnchanged();
    })
  });
});
