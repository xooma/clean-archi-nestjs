import { IExecutable } from '../../shared/executable.interface';
import { AbstractParticipationRepository } from '../../participation/ports/abstract-participation-repository';
import { User } from '../../user/entities/user.entity';
import { AbstractMailer } from '../../core/ports/abstract-mailer';
import { Webinar } from '../entities/webinar.entity';
import { AbstractUserRepository } from '../../user/ports/abstract-user-repository';
import { AbstractWebinarRepository } from '../ports/abstract-webinar-repository';
import { WebinarNotFoundException } from '../exceptions/webinar-not-found.exception';
import { DomainException } from '../../shared/exception';

type Request = {
  user: User;
  webinarId: string;
};

type Response = void;

export class CancelSeat implements IExecutable<Request, Response> {
  constructor(
    private readonly participationRepository: AbstractParticipationRepository,
    private readonly webinarRepository: AbstractWebinarRepository,
    private readonly userRepository: AbstractUserRepository,
    private readonly mailer: AbstractMailer,
  ) {}

  async execute({ user, webinarId }: Request): Promise<Response> {
    const webinar = await this.webinarRepository.findById(webinarId);

    if (!webinar) throw new WebinarNotFoundException();

    const participation = await this.participationRepository.findOne(user.props.id, webinarId);

    if (!participation) throw new DomainException('Participation not found');

    await this.participationRepository.delete(participation);
    await this.sendEmailToOrganizer(webinar);
    await this.sendEmailToParticipant(webinar, user);
  }

  private async sendEmailToOrganizer(webinar: Webinar): Promise<void> {
    const organizer = await this.userRepository.findById(webinar.props.organizerId);

    await this.mailer.send({
      to: organizer!.props.emailAdress,
      subject: 'A participant has canceled their reservation',
      body: `A participant has canceled their reservation for the webinar "${webinar.props.title}".`,
    });
  }

  private async sendEmailToParticipant(webinar: Webinar, user: User): Promise<void> {
    await this.mailer.send({
      to: user.props.emailAdress,
      subject: 'Reservation canceled',
      body: `You have successfully canceled your reservation for the webinar "${webinar.props.title}".`,
    });
  }
}
