import { ChangeDates } from '../change-dates';
import { Webinar } from '../../entities/webinar.entity';
import { InMemoryWebinarRepository } from '../../adapters/in-memory-webinar-repository';
import { FixedDateGenerator } from '../../../core/adapters';
import { InMemoryMailer } from '../../../core/adapters/in-memory-mailer';
import { testUsers } from '../../../user/tests/user.seeds';
import { Participation } from '../../../participation/entities/participation.entity';
import { InMemoryParticipationRepository } from '../../../participation/adapters/in-memory-participation-repository';
import { InMemoryUserRepository } from '../../../user/adapters/in-memory-user-repository';
import { WebinarUpdateForbiddenException } from '../../exceptions/webinar-update-forbidden.exception';
import { WebinarNotFoundException } from '../../exceptions/webinar-not-found.exception';
import { WebinarImminentException } from '../../exceptions/webinar-cancel-impossible.exception';

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
        to: testUsers.billyBob.props.emailAdress,
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

    it('should fail', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(new WebinarNotFoundException());

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

    it('should fail', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(new WebinarUpdateForbiddenException());

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
      await expect(() => useCase.execute(payload)).rejects.toThrow(new WebinarImminentException());

      await expectDatesToBeUnchanged();
    })
  });

});