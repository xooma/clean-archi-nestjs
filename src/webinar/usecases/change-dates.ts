import { IExecutable } from '../../shared/executable.interface';
import { AbstractWebinarRepository } from '../ports/abstract-webinar-repository';
import { AbstractDateGenerator } from '../../core/ports';
import { AbstractMailer } from '../../core/ports/abstract-mailer';
import { Webinar } from '../entities/webinar.entity';
import { AbstractParticipationRepository } from '../../participation/ports/abstract-participation-repository';
import { User } from '../../user/entities/user.entity';
import { AbstractUserRepository } from '../../user/ports/abstract-user-repository';
import { WebinarNotFoundException } from '../exceptions/webinar-not-found.exception';
import { WebinarUpdateForbiddenException } from '../exceptions/webinar-update-forbidden.exception';
import { WebinarImminentException } from '../exceptions/webinar-cancel-impossible.exception';

type Request = {
  user: User;
  webinarId: string;
  startDate: Date;
  endDate: Date;
};

type Response = void;

export class ChangeDates implements IExecutable<Request, Response> {
  constructor(
    private readonly webinarRepository: AbstractWebinarRepository,
    private readonly participationRepository: AbstractParticipationRepository,
    private readonly userRepository: AbstractUserRepository,
    private readonly mailer: AbstractMailer,
    private readonly dateGenerator: AbstractDateGenerator,
  ) {}

  async execute({ webinarId, user, endDate, startDate }: Request): Promise<Response> {
    const webinar = await this.webinarRepository.findById(webinarId);

    if (!webinar) throw new WebinarNotFoundException();

    if (!webinar.isOrganizer(user.props.id))
      throw new WebinarUpdateForbiddenException();

    webinar!.update({
      startDate: startDate,
      endDate: endDate,
    });

    if (webinar.isTooClose(this.dateGenerator.now()))
      throw new WebinarImminentException();

    await this.webinarRepository.update(webinar);
    await this.sendEmails(webinar);
  }

  private async sendEmails(webinar: Webinar): Promise<void> {
    const participations = await this.participationRepository.findByWebinarId(
      webinar.props.id,
    );

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
          subject: `"${webinar.props.title}" changed dates`,
          body: `The date of the webinar "${webinar.props.title}" has been changed.`,
        });
      }),
    );
  }
}
