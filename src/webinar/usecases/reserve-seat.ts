import { IExecutable } from '../../shared/executable.interface';
import { AbstractParticipationRepository } from '../../participation/ports/abstract-participation-repository';
import { User } from '../../user/entities/user.entity';
import { Participation } from '../../participation/entities/participation.entity';
import { AbstractMailer } from '../../core/ports/abstract-mailer';
import { Webinar } from '../entities/webinar.entity';
import { AbstractUserRepository } from '../../user/ports/abstract-user-repository';
import { AbstractWebinarRepository } from '../ports/abstract-webinar-repository';
import { WebinarNotFoundException } from '../exceptions/webinar-not-found.exception';
import { WebinarFullException } from '../exceptions/webinar-full.exception';
import { DomainException } from '../../shared/exception';

type Request = {
  user: User;
  webinarId: string;
};

type Response = void;

export class ReserveSeat implements IExecutable<Request, Response> {
  constructor(
    private readonly participationRepository: AbstractParticipationRepository,
    private readonly webinarRepository: AbstractWebinarRepository,
    private readonly userRepository: AbstractUserRepository,
    private readonly mailer: AbstractMailer,
  ) {}

  async execute({ user, webinarId }: Request): Promise<Response> {
    const webinar = await this.webinarRepository.findById(webinarId);

    if (!webinar) throw new WebinarNotFoundException();

    await this.assertUserIsNotAlreadyRegistered(user, webinar);
    await this.assertWebinarIsNotFull(webinar);

    const participation = new Participation({
      userId: user.props.id,
      webinarId,
    });

    await this.participationRepository.create(participation);
    await this.sendEmailToOrganizer(webinar);
    await this.sendEmailToParticipant(webinar, user);
  }

  private async assertWebinarIsNotFull(webinar: Webinar) {
    const participationCount = await this.participationRepository.countParticipations(webinar.props.id);
    if (webinar.isFull(participationCount)) throw new WebinarFullException();
  }

  private async assertUserIsNotAlreadyRegistered(user: User, webinar: Webinar) {
    const participationExists = await this.participationRepository.findOne(user.props.id, webinar.props.id);
    if (participationExists) throw new DomainException('You have already reserved a seat for this webinar');
  }

  private async sendEmailToOrganizer(webinar: Webinar): Promise<void> {
    const organizer = await this.userRepository.findById(webinar.props.organizerId);

    await this.mailer.send({
      to: organizer!.props.email,
      subject: 'New seat reserved',
      body: `A new seat has been reserved for the webinar "${webinar.props.title}".`,
    });
  }

  private async sendEmailToParticipant(webinar: Webinar, user: User): Promise<void> {
    await this.mailer.send({
      to: user.props.email,
      subject: 'Reservation confirmed',
      body: `You have successfully reserved a seat for the webinar "${webinar.props.title}".`,
    });
  }
}
