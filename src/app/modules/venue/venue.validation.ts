import { z } from 'zod';

const createVenueZodSchema = z.object({
     body: z.object({
          name: z.string({ required_error: 'Name is required' }),
          venueType: z.enum(['mall', 'airport', 'supermarket', 'hospital', 'office', 'university', 'other'], { required_error: 'Venue type is required' }),
          address: z.string().optional(),
          city: z.string().optional(),
          country: z.string().optional(),
          gpsCoordinates: z.object({
               coordinates: z.array(z.number()).length(2),
          }).optional(),
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
          gpsCoordinates: z.object({
               coordinates: z.array(z.number()).length(2),
          }).optional(),
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