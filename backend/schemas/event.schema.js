import { z } from 'zod';

const DateTimeString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD');

export const EventBodySchema = z.object({
  title: z.string().min(1),
  start_datetime: DateTimeString,
  end_datetime: DateTimeString,
  venue_name: z.string().min(1),
  venue_instagram: z.string().min(1),
  venue_address: z.string().min(1),
  chef_names: z.string().min(1),
  chef_instagrams: z.string().min(1),
  reservation_url: z.string().min(1),
  english_description: z.string().min(1),
  hebrew_description: z.string().min(1),
  is_draft: z.string().optional(),
  poster: z.string().optional(),
});

export const DraftEventBodySchema = z.object({
  title: z.string().min(1),
  start_datetime: DateTimeString.optional(),
  end_datetime: DateTimeString.optional(),
  venue_name: z.string().optional(),
  venue_instagram: z.string().optional(),
  venue_address: z.string().optional(),
  chef_names: z.string().optional(),
  chef_instagrams: z.string().optional(),
  reservation_url: z.string().optional(),
  english_description: z.string().optional(),
  hebrew_description: z.string().optional(),
  is_draft: z.string().optional(),
  poster: z.string().optional(),
});

export const DeleteBodySchema = z.object({
  titles: z.array(z.string().min(1)).min(1),
});
