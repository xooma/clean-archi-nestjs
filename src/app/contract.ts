import { z } from 'zod';

export namespace WebinaireApi {
  export namespace Webinaire {
    export const schema = z.object({
      title: z.string(),
      seats: z.number(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
    });

    export type Request = z.infer<typeof WebinaireApi.Webinaire.schema>;

    export type Response = { id: string };
  }
}