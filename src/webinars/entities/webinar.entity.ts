import { differenceInDays } from 'date-fns';

type WebinarProps = {
  id: string;
  organizerId: string;
  title: string;
  seats: number;
  startDate: Date;
  endDate: Date;
};

export class Webinar {
  constructor(public props: WebinarProps) {}

  isTooClose(now: Date): boolean {
    const diff = differenceInDays(this.props.startDate, now);

    return diff < 3;
  }

  hasTooManySeats() {
    return this.props.seats > 1000
  }

  hasNoSeats() {
    return this.props.seats < 1
  }

  update(webinar: Partial<WebinarProps>): void {
    this.props = { ...this.props, ...webinar };
  }
}