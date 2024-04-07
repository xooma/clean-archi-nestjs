import { IExecutable } from '../../shared/executable.interface';
import { User } from '../../users/entities/user.entity';
import { AbstractWebinarRepository } from '../ports/abstract-webinar-repository';
import { AbstractDateGenerator } from '../../core/ports';
import { AbstractParticipationRepository } from '../ports/abstract-participation-repository';
import { AbstractMailer } from '../../core/ports/abstract-mailer';
import { AbstractUserRepository } from '../../users/ports/abstract-user-repository';
import { Webinar } from '../entities/webinar.entity';

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

  async execute(request: Request): Promise<Response> {
    const webinar = await this.webinarRepository.findById(request.webinarId);

    if (!webinar) {
      throw new Error('Webinar not found');
    }

    if (webinar.props.organizerId !== request.user.props.id) {
      throw new Error('You are not the organizer of this webinar');
    }

    webinar!.update({
      startDate: request.startDate,
      endDate: request.endDate,
    });

    if (webinar.isTooClose(this.dateGenerator.now())) {
      throw new Error('The webinar must happen at least 3 days from now');
    }

    await this.webinarRepository.update(webinar);
    await this.sendEmails(webinar);
  }

  async sendEmails(webinar: Webinar) {
    const participations = await this.participationRepository.findById(
      webinar.props.id,
    );

    const users = await Promise.all(
      participations!
        .map(async (participation) => {
          return await this.userRepository.findById(participation.props.userId);
        })
        .filter((user) => user !== null),
    );

    await Promise.all(users.map(async (user: User) => {
      await this.mailer.send({
        to: user.props.email,
        subject: `"${webinar.props.title}" changed dates`,
        body: `The date of the webinar "${webinar.props.title}" has been changed.`,
      });
    }));
  }
}
