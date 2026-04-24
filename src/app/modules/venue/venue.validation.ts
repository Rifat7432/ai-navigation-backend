import { z } from 'zod';

const createVenueZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    venueType: z.enum(['mall', 'airport', 'supermarket', 'hospital', 'office', 'university', 'other']),
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    gpsCoordinates: z
      .object({
        type: z.literal('Point'),
        coordinates: z.tuple([z.number(), z.number()]),
      })
      .optional(),
    totalFloors: z.number().optional(),
    mappingStatus: z.enum(['unmapped', 'partial', 'complete']).optional(),
    coverImage: z.string().optional(),
    isVerified: z.boolean().optional(),
  }),
});

const updateVenueZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    venueType: z.enum(['mall', 'airport', 'supermarket', 'hospital', 'office', 'university', 'other']).optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    gpsCoordinates: z
      .object({
        type: z.literal('Point'),
        coordinates: z.tuple([z.number(), z.number()]),
      })
      .optional(),
    totalFloors: z.number().optional(),
    mappingStatus: z.enum(['unmapped', 'partial', 'complete']).optional(),
    coverImage: z.string().optional(),
    isVerified: z.boolean().optional(),
  }),
});

export const VenueValidation = {
  createVenueZodSchema,
  updateVenueZodSchema,
};
