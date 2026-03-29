import { z } from 'zod';

export const MapsResponseSchema = z.object({
  places: z.array(
    z.object({
      formattedAddress: z.string().min(1),
    })
  ).min(1),
});

export const TranslateResponseSchema = z.object({
  data: z.object({
    translations: z.array(
      z.object({
        translatedText: z.string(),
      })
    ).min(1),
  }),
});
