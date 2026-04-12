import { z } from 'zod';

const createMediaAssetZodSchema = z.object({
     body: z.object({
          user: z.string({ required_error: 'User ID is required' }),
          mediaType: z.enum(['image', 'video', 'audio'], { required_error: 'Media type is required' }),
          purpose: z.enum(['grounding_photo', 'recheck_photo', 'destination_photo', 'venue_contribution', 'voice_command', 'chat_attachment'], { required_error: 'Purpose is required' }),
          url: z.string({ required_error: 'URL is required' }),
          mimeType: z.string().optional(),
          sizeBytes: z.number().optional(),
          durationSec: z.number().optional(),
          thumbnail: z.string().optional(),
          aiAnalysis: z.object({
               detectedVenueType: z.string().optional(),
               detectedZone: z.string().optional(),
               detectedLandmarks: z.array(z.object({
                    landmarkId: z.string(),
                    name: z.string(),
                    confidence: z.number(),
                    boundingBox: z.object({
                         x: z.number(),
                         y: z.number(),
                         width: z.number(),
                         height: z.number(),
                    }),
               })).optional(),
               detectedText: z.string().optional(),
               detectedLocation: z.string().optional(),
               overallConfidence: z.number().optional(),
               tags: z.array(z.string()).optional(),
               analysedAt: z.date().optional(),
          }).optional(),
          linkedVenue: z.string().optional(),
     }),
});

const updateMediaAssetZodSchema = z.object({
     body: z.object({
          user: z.string().optional(),
          mediaType: z.enum(['image', 'video', 'audio']).optional(),
          purpose: z.enum(['grounding_photo', 'recheck_photo', 'destination_photo', 'venue_contribution', 'voice_command', 'chat_attachment']).optional(),
          url: z.string().optional(),
          mimeType: z.string().optional(),
          sizeBytes: z.number().optional(),
          durationSec: z.number().optional(),
          thumbnail: z.string().optional(),
          aiAnalysis: z.object({
               detectedVenueType: z.string().optional(),
               detectedZone: z.string().optional(),
               detectedLandmarks: z.array(z.object({
                    landmarkId: z.string(),
                    name: z.string(),
                    confidence: z.number(),
                    boundingBox: z.object({
                         x: z.number(),
                         y: z.number(),
                         width: z.number(),
                         height: z.number(),
                    }),
               })).optional(),
               detectedText: z.string().optional(),
               detectedLocation: z.string().optional(),
               overallConfidence: z.number().optional(),
               tags: z.array(z.string()).optional(),
               analysedAt: z.date().optional(),
          }).optional(),
          linkedVenue: z.string().optional(),
     }),
});

export const MediaAssetValidation = {
     createMediaAssetZodSchema,
     updateMediaAssetZodSchema,
};