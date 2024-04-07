import { ChangeDates } from '../change-dates';
import { testUsers } from '../../../users/tests/user.seeds';
import { Webinar } from '../../entities/webinar.entity';
import { InMemoryWebinarRepository } from '../../adapters/in-memory-webinar-repository';
import { FixedDateGenerator } from '../../../core/adapters';
import { Participation } from '../../entities/participation.entity';
import { InMemoryParticipationRepository } from '../../adapters/in-memory-participation-repository';
import { InMemoryMailer } from '../../../core/adapters/in-memory-mailer';
import { InMemoryUserRepository } from '../../../users/adapters/in-memory-user-repository';

describe('Feature: changing the date of a webinar', () => {
  async function expectDatesToBeUnchanged() {
    const updatedWebinar = await webinarRepository.findById('id-1');
    expect(updatedWebinar!.props.startDate).toEqual(webinar.props.startDate);
    expect(updatedWebinar!.props.endDate).toEqual(webinar.props.endDate);
  }

  const webinar = new Webinar({
    id: 'id-1',
    organizerId: testUsers.aliceFoo.props.id,
    title: 'My first webinar',
    seats: 50,
    startDate: new Date('2023-01-10T10:00:00.000Z'),
    endDate: new Date('2023-01-10T11:00:00.000Z'),
  })

  const bobParticipation = new Participation({
    userId: testUsers.billyBob.props.id,
    webinarId: webinar.props.id,
  });

  let webinarRepository: InMemoryWebinarRepository;
  let participationRepository: InMemoryParticipationRepository;
  let userRepository: InMemoryUserRepository;
  let mailer: InMemoryMailer;
  let dateGenerator: FixedDateGenerator;
  let useCase: ChangeDates;

  beforeEach(() => {
    webinarRepository = new InMemoryWebinarRepository([webinar]);
    participationRepository = new InMemoryParticipationRepository([bobParticipation]);
    userRepository = new InMemoryUserRepository([testUsers.aliceFoo, testUsers.billyBob]);
    mailer = new InMemoryMailer();
    dateGenerator = new FixedDateGenerator();
    useCase = new ChangeDates(webinarRepository, participationRepository, userRepository, mailer, dateGenerator);
  })

  describe('Scenario: happy path', () => {
    const payload = {
      user: testUsers.aliceFoo,
      webinarId: 'id-1',
      startDate: new Date('2023-01-20T07:00:00.000Z'),
      endDate: new Date('2023-01-21T08:00:00.000Z'),
    }

    it('should change the date', async () => {
      await useCase.execute(payload);

      const updatedWebinar = await webinarRepository.findById('id-1');
      expect(updatedWebinar!.props.endDate).toEqual(payload.endDate);
      expect(updatedWebinar!.props.startDate).toEqual(payload.startDate);
    })

    it('should send an email to the participants', async () => {
      await useCase.execute(payload);

      expect(mailer.sentEmails).toEqual([{
        to: testUsers.billyBob.props.email,
        subject: `"${webinar.props.title}" changed dates`,
        body: `The date of the webinar "${webinar.props.title}" has been changed.`,
      }])
    });
  });

  describe('Scenario: updating a webinar that does not exist', () => {
    const payload = {
      user: testUsers.aliceFoo,
      webinarId: 'not-existing-id',
      startDate: new Date('2023-01-20T07:00:00.000Z'),
      endDate: new Date('2023-01-21T08:00:00.000Z'),
    }

    it('should fail if the webinar does not exist', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow('Webinar not found');

      await expectDatesToBeUnchanged();
    })
  });

  describe('Scenario: updating the webinar of someone else', () => {
    const payload = {
      user: testUsers.billyBob,
      webinarId: 'id-1',
      startDate: new Date('2023-01-20T07:00:00.000Z'),
      endDate: new Date('2023-01-21T08:00:00.000Z'),
    }

    it('should fail if the webinar does not belong to user', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow('You are not the organizer of this webinar');

      await expectDatesToBeUnchanged();
    })
  });

  describe('Scenario: updating a webinar that takes place 3 days from now', () => {
    const payload = {
      user: testUsers.aliceFoo,
      webinarId: 'id-1',
      startDate: new Date('2023-01-03T00:00:00Z'),
      endDate: new Date('2023-01-03T01:00:00Z'),
    }

    it('should fail ', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow('The webinar must happen at least 3 days from now');

      await expectDatesToBeUnchanged();
    })
  });

});