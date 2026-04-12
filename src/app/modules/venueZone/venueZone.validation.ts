import { z } from 'zod';

const createVenueZoneZodSchema = z.object({
     body: z.object({
          venue: z.string({ required_error: 'Venue ID is required' }),
          name: z.string({ required_error: 'Name is required' }),
          floor: z.number().optional(),
          zoneType: z.enum(['store', 'food_court', 'restroom', 'entrance', 'exit', 'corridor', 'elevator', 'escalator', 'parking', 'information', 'other']).optional(),
          description: z.string().optional(),
     }),
});

const updateVenueZoneZodSchema = z.object({
     body: z.object({
          venue: z.string().optional(),
          name: z.string().optional(),
          floor: z.number().optional(),
          zoneType: z.enum(['store', 'food_court', 'restroom', 'entrance', 'exit', 'corridor', 'elevator', 'escalator', 'parking', 'information', 'other']).optional(),
          description: z.string().optional(),
     }),
});

export const VenueZoneValidation = {
     createVenueZoneZodSchema,
     updateVenueZoneZodSchema,
};