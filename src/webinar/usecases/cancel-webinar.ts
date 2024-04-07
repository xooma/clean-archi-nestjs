import { IExecutable } from '../../shared/executable.interface';
import { User } from '../../user/entities/user.entity';
import { AbstractWebinarRepository } from '../ports/abstract-webinar-repository';
import { WebinarNotFoundException } from '../exceptions/webinar-not-found.exception';
import { WebinarUpdateForbiddenException } from '../exceptions/webinar-update-forbidden.exception';
import { AbstractMailer } from '../../core/ports/abstract-mailer';
import { AbstractParticipationRepository } from '../../participation/ports/abstract-participation-repository';
import { AbstractUserRepository } from '../../user/ports/abstract-user-repository';
import { Webinar } from '../entities/webinar.entity';

type Request = {
  user: User;
  webinarId: string;
};

type Response = void;

export class CancelWebinar implements IExecutable<Request, Response> {
  constructor(
    private readonly webinarRepository: AbstractWebinarRepository,
    private readonly participationRepository: AbstractParticipationRepository,
    private readonly userRepository: AbstractUserRepository,
    private readonly mailer: AbstractMailer,
  ) {}

  async execute({ webinarId, user }: Request): Promise<Response> {
    const webinar = await this.webinarRepository.findById(webinarId);

    if (!webinar) throw new WebinarNotFoundException();

    if (!webinar.isOrganizer(user.props.id)) throw new WebinarUpdateForbiddenException();

    await this.webinarRepository.delete(webinar!);

    await this.sendEmails(webinar!);
  }

  private async sendEmails(webinar: Webinar): Promise<void> {
    const participations = await this.participationRepository.findById(webinar.props.id);

    const users = await Promise.all(
      participations!
        .map(async (participation) => {
          return await this.userRepository.findById(participation.props.userId);
        })
        .filter((user) => user !== null),
    );

    await Promise.all(
      users.map(async (user: User) => {
        await this.mailer.send({
          to: user.props.email,
          subject: 'Webinar canceled',
          body: `The webinar "${webinar.props.title}" has been canceled.`,
        });
      }),
    );
  }
}
