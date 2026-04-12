import { z } from 'zod';

const createLocationZodSchema = z.object({
     body: z.object({
          user: z.string({ required_error: 'User ID is required' }),
          venue: z.string().optional(),
          zone: z.string().optional(),
          label: z.string().optional(),
          address: z.string().optional(),
          locationType: z.enum(['indoor', 'outdoor']).optional(),
          floor: z.number().optional(),
          gpsCoordinates: z.object({
               coordinates: z.array(z.number()).length(2),
          }).optional(),
          indoorPosition: z.object({
               x: z.number().optional(),
               y: z.number().optional(),
          }).optional(),
          isFavorite: z.boolean().optional(),
          visitedAt: z.date().optional(),
     }),
});

const updateLocationZodSchema = z.object({
     body: z.object({
          user: z.string().optional(),
          venue: z.string().optional(),
          zone: z.string().optional(),
          label: z.string().optional(),
          address: z.string().optional(),
          locationType: z.enum(['indoor', 'outdoor']).optional(),
          floor: z.number().optional(),
          gpsCoordinates: z.object({
               coordinates: z.array(z.number()).length(2),
          }).optional(),
          indoorPosition: z.object({
               x: z.number().optional(),
               y: z.number().optional(),
          }).optional(),
          isFavorite: z.boolean().optional(),
          visitedAt: z.date().optional(),
     }),
});

export const LocationValidation = {
     createLocationZodSchema,
     updateLocationZodSchema,
};