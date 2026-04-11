import { z } from 'zod';

export const DraftBodySchema = z.object({
  prompt: z.string().min(1),
  toCrop: z.preprocess((v) => v === true || v === 'true', z.boolean()).optional().default(true),
});
