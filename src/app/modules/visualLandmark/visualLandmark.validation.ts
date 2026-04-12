import { z } from 'zod';

const createVisualLandmarkZodSchema = z.object({
     body: z.object({
          venue: z.string({ required_error: 'Venue ID is required' }),
          zone: z.string().optional(),
          floor: z.number().optional(),
          name: z.string({ required_error: 'Name is required' }),
          landmarkType: z.enum(['store_sign', 'aisle_sign', 'pillar', 'entrance_gate', 'escalator', 'elevator', 'restroom_sign', 'information_desk', 'other']).optional(),
          referenceImages: z.array(z.string()).optional(),
          visualDescriptor: z.string().optional(),
          relativePosition: z.object({
               x: z.number().optional(),
               y: z.number().optional(),
          }).optional(),
          isActive: z.boolean().optional(),
     }),
});

const updateVisualLandmarkZodSchema = z.object({
     body: z.object({
          venue: z.string().optional(),
          zone: z.string().optional(),
          floor: z.number().optional(),
          name: z.string().optional(),
          landmarkType: z.enum(['store_sign', 'aisle_sign', 'pillar', 'entrance_gate', 'escalator', 'elevator', 'restroom_sign', 'information_desk', 'other']).optional(),
          referenceImages: z.array(z.string()).optional(),
          visualDescriptor: z.string().optional(),
          relativePosition: z.object({
               x: z.number().optional(),
               y: z.number().optional(),
          }).optional(),
          isActive: z.boolean().optional(),
     }),
});

export const VisualLandmarkValidation = {
     createVisualLandmarkZodSchema,
     updateVisualLandmarkZodSchema,
};