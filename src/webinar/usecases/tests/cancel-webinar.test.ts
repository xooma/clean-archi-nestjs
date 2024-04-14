import { testUsers } from '../../../user/tests/user.seeds';
import { Webinar } from '../../entities/webinar.entity';
import { CancelWebinar } from '../cancel-webinar';
import { InMemoryWebinarRepository } from '../../adapters/in-memory-webinar-repository';
import { WebinarNotFoundException } from '../../exceptions/webinar-not-found.exception';
import { WebinarUpdateForbiddenException } from '../../exceptions/webinar-update-forbidden.exception';
import { InMemoryMailer } from '../../../core/adapters/in-memory-mailer';
import { InMemoryParticipationRepository } from '../../../participation/adapters/in-memory-participation-repository';
import { InMemoryUserRepository } from '../../../user/adapters/in-memory-user-repository';
import { Participation } from '../../../participation/entities/participation.entity';

describe('Feature: cancel a webinar', () => {
  async function expectWebinarNotToBeCanceled() {
    const webinar = await webinarRepository.findById('id-1');
    expect(webinar).not.toBeNull();
  }

  async function expectWebinarToBeCanceled() {
    const webinar = await webinarRepository.findById('id-1');
    expect(webinar).toBeNull();
  }

  const webinar = new Webinar({
    id: 'id-1',
    organizerId: testUsers.aliceFoo.props.id,
    title: 'My first webinar',
    seats: 50,
    startDate: new Date('2023-01-10T10:00:00.000Z'),
    endDate: new Date('2023-01-10T11:00:00.000Z'),
  });

  let webinarRepository: InMemoryWebinarRepository;
  let participationRepository: InMemoryParticipationRepository;
  let userRepository: InMemoryUserRepository;
  let mailer: InMemoryMailer;
  let useCase: CancelWebinar;

  const bobParticipation = new Participation({
    userId: testUsers.billyBob.props.id,
    webinarId: webinar.props.id,
  });

  beforeEach(() => {
    webinarRepository = new InMemoryWebinarRepository([webinar]);
    participationRepository = new InMemoryParticipationRepository([bobParticipation]);
    userRepository = new InMemoryUserRepository([testUsers.aliceFoo, testUsers.billyBob]);
    mailer = new InMemoryMailer();
    useCase = new CancelWebinar(webinarRepository, participationRepository, userRepository, mailer);
  });

  describe('Scenario: happy path', () => {
    const payload = {
      user: testUsers.aliceFoo,
      webinarId: 'id-1',
    };

    it('should cancel the webinar', async () => {
      await useCase.execute(payload);
      await expectWebinarToBeCanceled();
    });

    it('should send an email to the participants', async () => {
      await useCase.execute(payload);

      expect(mailer.sentEmails).toEqual([{
        to: testUsers.billyBob.props.emailAdress,
        subject: 'Webinar canceled',
        body: `The webinar "${webinar.props.title}" has been canceled.`,
      }])
    });
  });

  describe('Scenario: webinar does not exist', () => {
    it('should fail', async () => {
      await expect(() =>
        useCase.execute({
          user: testUsers.aliceFoo,
          webinarId: 'not-existing-id',
        }),
      ).rejects.toThrow(new WebinarNotFoundException());

      await expectWebinarNotToBeCanceled();
    });
  });

  describe('Scenario: cancel the webinar of someone else', () => {
    it('should fail', async () => {
      await expect(() =>
        useCase.execute({
          user: testUsers.billyBob,
          webinarId: 'id-1',
        }),
      ).rejects.toThrow(new WebinarUpdateForbiddenException());

      await expectWebinarNotToBeCanceled();
    });
  });
});
