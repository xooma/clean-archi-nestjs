import { testUsers } from '../../../user/tests/user.seeds';
import { InMemoryParticipationRepository } from '../../../participation/adapters/in-memory-participation-repository';
import { ReserveSeat } from '../reserve-seat';
import { Webinar } from '../../entities/webinar.entity';
import { InMemoryMailer } from '../../../core/adapters/in-memory-mailer';
import { WebinarNotFoundException } from '../../exceptions/webinar-not-found.exception';
import { InMemoryUserRepository } from '../../../user/adapters/in-memory-user-repository';
import { InMemoryWebinarRepository } from '../../adapters/in-memory-webinar-repository';
import { WebinarFullException } from '../../exceptions/webinar-full.exception';
import { Participation } from '../../../participation/entities/participation.entity';
import { DomainException } from '../../../shared/exception';

describe('Feature: reserving a seat for a webinar', () => {
  async function expectSeatNotToBeReserved() {
    const storedParticipation = await participationRepository.findOne(testUsers.billyBob.props.id, webinar.props.id);
    expect(storedParticipation).toBeNull();
  }

  async function expectUserIsNotAlreadyParticipating() {
    const storedParticipation = await participationRepository.findOne(testUsers.charlesCat.props.id, webinarFull.props.id);
    expect(storedParticipation).not.toBeNull();
  }

  const webinar = new Webinar({
    id: 'id-1',
    organizerId: testUsers.aliceFoo.props.id,
    title: 'My first webinar',
    seats: 50,
    startDate: new Date('2023-01-10T10:00:00.000Z'),
    endDate: new Date('2023-01-10T11:00:00.000Z'),
  });

  const webinarFull = new Webinar({
    id: 'id-2',
    organizerId: testUsers.aliceFoo.props.id,
    title: 'My first webinar',
    seats: 1,
    startDate: new Date('2023-01-10T10:00:00.000Z'),
    endDate: new Date('2023-01-10T11:00:00.000Z'),
  });

  const charlesParticipation = new Participation({
    userId: testUsers.charlesCat.props.id,
    webinarId: webinarFull.props.id,
  });

  let participationRepository: InMemoryParticipationRepository;
  let userRepository: InMemoryUserRepository;
  let webinarRepository: InMemoryWebinarRepository;
  let mailer: InMemoryMailer;
  let useCase: ReserveSeat;

  beforeEach(() => {
    participationRepository = new InMemoryParticipationRepository([charlesParticipation]);
    userRepository = new InMemoryUserRepository([testUsers.aliceFoo, testUsers.charlesCat]);
    webinarRepository = new InMemoryWebinarRepository([webinar, webinarFull]);
    mailer = new InMemoryMailer();
    useCase = new ReserveSeat(participationRepository, webinarRepository, userRepository, mailer);
  });

  describe('Scenario: Happy path', () => {
    const payload = {
      user: testUsers.billyBob,
      webinarId: webinar.props.id,
    };

    it('should reserve a seat', async () => {
      await useCase.execute(payload);

      const storedParticipation = await participationRepository.findOne(payload.user.props.id, webinar.props.id);
      expect(storedParticipation).not.toBeNull();
    });

    it('should send an email to the organizer', async () => {
      await useCase.execute(payload);

      expect(mailer.sentEmails[0]).toEqual({
        to: testUsers.aliceFoo.props.email,
        subject: 'New seat reserved',
        body: `A new seat has been reserved for the webinar "${webinar.props.title}".`,
      });
    });

    it('should send an email to the participant', async () => {
      await useCase.execute(payload);

      expect(mailer.sentEmails[1]).toEqual({
        to: testUsers.billyBob.props.email,
        subject: 'Reservation confirmed',
        body: `You have successfully reserved a seat for the webinar "${webinar.props.title}".`,
      });
    });
  });

  describe('Scenario: webinar does not exist', () => {
    const payload = {
      user: testUsers.billyBob,
      webinarId: 'not-existing-id',
    };

    it('should fail', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(new WebinarNotFoundException());

      await expectSeatNotToBeReserved();
    });
  });

  describe('Scenario: no seat available', () => {
    const payload = {
      user: testUsers.billyBob,
      webinarId: 'id-2',
    };

    it('should fail', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(new WebinarFullException());

      await expectSeatNotToBeReserved();
    });
  });

  describe('Scenario: the user already participates in the webinar', () => {
    const payload = {
      user: testUsers.charlesCat,
      webinarId: 'id-2',
    };

    it('should fail', async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(new DomainException('You have already reserved a seat for this webinar'));

      await expectSeatNotToBeReserved();
    });
  });
});
