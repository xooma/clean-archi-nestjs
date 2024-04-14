import { z } from 'zod';
import { WebinarDTO } from './dtos/webinar.dto';

export namespace WebinarApi {
  export namespace Webinar {
    export const schema = z.object({
      title: z.string(),
      seats: z.number(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
    });

    export type Request = z.infer<typeof schema>;

    export type Response = { id: string };
  }

  export namespace ChangeSeats {
    export const schema = z.object({
      seats: z.number()
    });

    export type Request = z.infer<typeof schema>;
    export type Response = void;
  }

  export namespace ChangeDates {
    export const schema = z.object({
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
    });

    export type Request = z.infer<typeof schema>;
    export type Response = void;
  }

  export namespace Cancel {
    export type Response = void;
  }

  export namespace ReserveSeat {
    export type Response = void;
  }

  export namespace CancelSeat {
    export type Response = void;
  }

  export namespace GetWebinarById {
    export const schema = z.object({
      id: z.string(),
    });

    export type Request = z.infer<typeof schema>;
    export type Response = WebinarDTO;
  }
}