import { z } from 'zod';

const detectedLandmarkSchema = z.object({
     landmarkId: z.string(),
     name: z.string(),
     confidence: z.coerce.number(),
     boundingBox: z.object({
          x: z.coerce.number(),
          y: z.coerce.number(),
          width: z.coerce.number(),
          height: z.coerce.number(),
     }),
});

const aiAnalysisSchema = z.object({
     detectedVenueType: z.string().optional(),
     detectedZone: z.string().optional(),
     detectedLandmarks: z.array(detectedLandmarkSchema).optional(),
     detectedText: z.string().optional(),
     detectedLocation: z.string().optional(),
     overallConfidence: z.coerce.number().optional(),
     tags: z.array(z.string()).optional(),
     analysedAt: z.preprocess((value) => (value ? new Date(value as string) : undefined), z.date().optional()),
});

const createMediaAssetZodSchema = z.object({
     body: z.object({
          user: z.string().optional(),
          mediaType: z.enum(['image', 'video', 'audio']).optional(),
          purpose: z.enum([
               'grounding_photo',
               'recheck_photo',
               'destination_photo',
               'venue_contribution',
               'voice_command',
               'chat_attachment',
          ]).optional(),
          url: z.string().optional(),
          mimeType: z.string().optional(),
          sizeBytes: z.coerce.number().optional(),
          durationSec: z.coerce.number().optional(),
          thumbnail: z.string().optional(),
          aiAnalysis: aiAnalysisSchema.optional(),
          linkedVenue: z.string().optional(),
     }),
});

const updateMediaAssetZodSchema = z.object({
     body: z.object({
          user: z.string().optional(),
          mediaType: z.enum(['image', 'video', 'audio']).optional(),
          purpose: z.enum([
               'grounding_photo',
               'recheck_photo',
               'destination_photo',
               'venue_contribution',
               'voice_command',
               'chat_attachment',
          ]).optional(),
          url: z.string().optional(),
          mimeType: z.string().optional(),
          sizeBytes: z.coerce.number().optional(),
          durationSec: z.coerce.number().optional(),
          thumbnail: z.string().optional(),
          aiAnalysis: aiAnalysisSchema.optional(),
          linkedVenue: z.string().optional(),
     }),
});

export const MediaAssetValidation = {
     createMediaAssetZodSchema,
     updateMediaAssetZodSchema,
};