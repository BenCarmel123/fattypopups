import { z } from 'zod';

const DateTimeString = z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Must be YYYY-MM-DDTHH:MM');

export const EventBodySchema = z.object({
  title: z.string().min(1),
  start_datetime: DateTimeString,
  end_datetime: DateTimeString,
  venue_name: z.string().min(1),
  venue_instagram: z.string().optional(),
  venue_address: z.string().optional(),
  chef_names: z.string().min(1),
  chef_instagrams: z.string().optional(),
  reservation_url: z.string().url().optional(),
  english_description: z.string().optional(),
  hebrew_description: z.string().optional(),
  is_draft: z.string().optional(),
  poster: z.string().optional(),
});

export const DeleteBodySchema = z.object({
  titles: z.array(z.string().min(1)).min(1),
});
