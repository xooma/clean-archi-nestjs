import { z } from 'zod';

export namespace WebinarApi {
  export namespace Webinar {
    export const schema = z.object({
      title: z.string(),
      seats: z.number(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
    });

    export type Request = z.infer<typeof WebinarApi.Webinar.schema>;

    export type Response = { id: string };
  }
}