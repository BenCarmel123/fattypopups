import { z } from 'zod';

export const DraftBodySchema = z.object({
  prompt: z.string().min(1),
});
