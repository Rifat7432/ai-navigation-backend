import { z } from 'zod';

const chatMessageZodSchema = z.object({
     role: z.enum(['user', 'assistant']),
     text: z.string().optional(),
     attachments: z.array(z.object({
          assetId: z.string(),
          mediaType: z.enum(['image', 'video', 'audio']),
          url: z.string(),
          purpose: z.string(),
     })).optional(),
     actionCard: z.object({
          cardType: z.enum(['start_navigation', 'directions', 'location_info', 'product_location', 'recheck_request']).nullable().optional(),
          locationId: z.string().optional(),
          venueZoneId: z.string().optional(),
          address: z.string().optional(),
          label: z.string().optional(),
          ctaLabel: z.string().optional(),
     }).optional(),
     navigationInstruction: z.object({
          instructionText: z.string().optional(),
          landmarkRef: z.string().optional(),
          maneuver: z.enum(['straight', 'left', 'right', 'u_turn', 'arrive']).nullable().optional(),
          isCorrection: z.boolean().optional(),
     }).optional(),
     voiceTranscript: z.string().optional(),
     createdAt: z.date().optional(),
});

const createChatSessionZodSchema = z.object({
     body: z.object({
          user: z.string({ required_error: 'User ID is required' }),
          venue: z.string().optional(),
          title: z.string().optional(),
          messages: z.array(chatMessageZodSchema).optional(),
          resolvedDestination: z.string().optional(),
          resolvedVenueZone: z.string().optional(),
          status: z.enum(['active', 'closed']).optional(),
     }),
});

const updateChatSessionZodSchema = z.object({
     body: z.object({
          user: z.string().optional(),
          venue: z.string().optional(),
          title: z.string().optional(),
          messages: z.array(chatMessageZodSchema).optional(),
          resolvedDestination: z.string().optional(),
          resolvedVenueZone: z.string().optional(),
          status: z.enum(['active', 'closed']).optional(),
     }),
});

export const ChatSessionValidation = {
     createChatSessionZodSchema,
     updateChatSessionZodSchema,
};