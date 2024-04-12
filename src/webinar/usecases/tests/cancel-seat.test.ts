import { testUsers } from '../../../user/tests/user.seeds';
import { InMemoryParticipationRepository } from '../../../participation/adapters/in-memory-participation-repository';
import { Webinar } from '../../entities/webinar.entity';
import { InMemoryMailer } from '../../../core/adapters/in-memory-mailer';
import { WebinarNotFoundException } from '../../exceptions/webinar-not-found.exception';
import { InMemoryUserRepository } from '../../../user/adapters/in-memory-user-repository';
import { InMemoryWebinarRepository } from '../../adapters/in-memory-webinar-repository';
import { WebinarFullException } from '../../exceptions/webinar-full.exception';
import { Participation } from '../../../participation/entities/participation.entity';
import { CancelSeat } from '../cancel-seat';
import { DomainException } from '../../../shared/exception';

describe('Feature: canceling a seat', () => {
  const webinar = new Webinar({
    id: 'id-1',
    organizerId: testUsers.aliceFoo.props.id,
    title: 'My first webinar',
    seats: 50,
    startDate: new Date('2023-01-10T10:00:00.000Z'),
    endDate: new Date('2023-01-10T11:00:00.000Z'),
  });

  const charlesParticipation = new Participation({
    userId: testUsers.charlesCat.props.id,
    webinarId: webinar.props.id,
  });

  let participationRepository: InMemoryParticipationRepository;
  let userRepository: InMemoryUserRepository;
  let webinarRepository: InMemoryWebinarRepository;
  let mailer: InMemoryMailer;
  let useCase: CancelSeat;

  beforeEach(() => {
    participationRepository = new InMemoryParticipationRepository([charlesParticipation]);
    userRepository = new InMemoryUserRepository([testUsers.aliceFoo, testUsers.charlesCat]);
    webinarRepository = new InMemoryWebinarRepository([webinar]);
    mailer = new InMemoryMailer();
    useCase = new CancelSeat(participationRepository, webinarRepository, userRepository, mailer);
  });

  describe('Scenario: Happy path', () => {
    const payload = {
      user: testUsers.charlesCat,
      webinarId: webinar.props.id,
    };

    it('should cancel the seat', async () => {
      await useCase.execute(payload);

      const storedParticipation = await participationRepository.findOne(payload.user.props.id, webinar.props.id);
      expect(storedParticipation).toBeNull();
    });

    it('should send an email to the organizer', async () => {
      await useCase.execute(payload);

      expect(mailer.sentEmails[0]).toEqual({
        to: testUsers.aliceFoo.props.email,
        subject: 'A participant has canceled their reservation',
        body: `A participant has canceled their reservation for the webinar "${webinar.props.title}".`,
      });
    });

    it('should send an email to the participant', async () => {
      await useCase.execute(payload);

      expect(mailer.sentEmails[1]).toEqual({
        to: testUsers.charlesCat.props.email,
        subject: 'Reservation canceled',
        body: `You have successfully canceled your reservation for the webinar "${webinar.props.title}".`,
      });
    });
  });

  describe('Scenario: webinar does not exist', () => {
    const payload = {
      user: testUsers.charlesCat,
      webinarId: 'not-existing-id',
    };

    it('should fail', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(new WebinarNotFoundException());
    });
  });

  describe('Scenario: no participation found', () => {
    const payload = {
      user: testUsers.billyBob,
      webinarId: webinar.props.id,
    };

    it('should fail', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(new DomainException('Participation not found'));
    });
  });
});
