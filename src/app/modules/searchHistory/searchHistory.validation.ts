import { z } from 'zod';

const createSearchHistoryZodSchema = z.object({
  body: z.object({
    venue: z.string().optional(),
    query: z.string().optional(),
    resolvedAddress: z.string().optional(),
    location: z.string().optional(),
    inputType: z.enum(['text', 'voice', 'photo']).optional(),
  }),
});

export const SearchHistoryValidation = {
  createSearchHistoryZodSchema,
};
