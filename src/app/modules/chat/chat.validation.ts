import { z } from 'zod';

const createChatSessionZodSchema = z.object({
  body: z.object({
    venue: z.string().optional(),
    title: z.string().optional(),
  }),
});

const sendMessageZodSchema = z.object({
  body: z.object({
    text: z.string().optional(),
    attachments: z
      .array(
        z.object({
          assetId: z.string(),
          mediaType: z.enum(['image', 'video', 'audio']),
          url: z.string(),
          purpose: z.string(),
        })
      )
      .optional(),
    voiceTranscript: z.string().optional(),
  }),
});

export const ChatValidation = {
  createChatSessionZodSchema,
  sendMessageZodSchema,
};
