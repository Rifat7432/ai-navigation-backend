import { z } from 'zod';

const createVenueContributionZodSchema = z.object({
     body: z.object({
          contributor: z.string({ required_error: 'Contributor ID is required' }),
          venue: z.string().optional(),
          zone: z.string().optional(),
          mediaAssets: z.array(z.string()).min(1, 'At least one media asset is required'),
          description: z.string().optional(),
          suggestedVenueDetails: z.object({
               name: z.string().optional(),
               venueType: z.string().optional(),
               address: z.string().optional(),
               city: z.string().optional(),
               country: z.string().optional(),
          }).optional(),
          status: z.enum(['pending', 'under_review', 'approved', 'rejected']).optional(),
          reviewedBy: z.string().optional(),
          reviewNote: z.string().optional(),
          reviewedAt: z.date().optional(),
          rewardAmount: z.number().optional(),
          rewardPaid: z.boolean().optional(),
          rewardPaidAt: z.date().optional(),
     }),
});

const updateVenueContributionZodSchema = z.object({
     body: z.object({
          contributor: z.string().optional(),
          venue: z.string().optional(),
          zone: z.string().optional(),
          mediaAssets: z.array(z.string()).optional(),
          description: z.string().optional(),
          suggestedVenueDetails: z.object({
               name: z.string().optional(),
               venueType: z.string().optional(),
               address: z.string().optional(),
               city: z.string().optional(),
               country: z.string().optional(),
          }).optional(),
          status: z.enum(['pending', 'under_review', 'approved', 'rejected']).optional(),
          reviewedBy: z.string().optional(),
          reviewNote: z.string().optional(),
          reviewedAt: z.date().optional(),
          rewardAmount: z.number().optional(),
          rewardPaid: z.boolean().optional(),
          rewardPaidAt: z.date().optional(),
     }),
});

export const VenueContributionValidation = {
     createVenueContributionZodSchema,
     updateVenueContributionZodSchema,
};