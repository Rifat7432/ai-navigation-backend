import { z } from 'zod';

const createSearchHistoryZodSchema = z.object({
     body: z.object({
          user: z.string({ required_error: 'User ID is required' }),
          venue: z.string().optional(),
          query: z.string().optional(),
          resolvedAddress: z.string().optional(),
          location: z.string().optional(),
          inputType: z.enum(['text', 'voice', 'photo']).optional(),
          searchedAt: z.date().optional(),
     }),
});

const updateSearchHistoryZodSchema = z.object({
     body: z.object({
          user: z.string().optional(),
          venue: z.string().optional(),
          query: z.string().optional(),
          resolvedAddress: z.string().optional(),
          location: z.string().optional(),
          inputType: z.enum(['text', 'voice', 'photo']).optional(),
          searchedAt: z.date().optional(),
     }),
});

export const SearchHistoryValidation = {
     createSearchHistoryZodSchema,
     updateSearchHistoryZodSchema,
};