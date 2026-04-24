import { z } from 'zod';

const createContributionZodSchema = z.object({
  body: z.object({
    venue: z.string().optional(),
    zone: z.string().optional(),
    mediaAssets: z.array(z.string()).min(1, 'At least one media asset is required'),
    description: z.string().optional(),
    suggestedVenueDetails: z
      .object({
        name: z.string().optional(),
        venueType: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
      })
      .optional(),
  }),
});

const reviewContributionZodSchema = z.object({
  body: z.object({
    status: z.enum(['approved', 'rejected']),
    reviewNote: z.string().optional(),
    rewardAmount: z.number().optional(),
  }),
});

export const ContributionValidation = {
  createContributionZodSchema,
  reviewContributionZodSchema,
};
