import { z } from 'zod';

const routeStepZodSchema = z.object({
     stepIndex: z.number(),
     instructionText: z.string(),
     maneuver: z.enum(['straight', 'left', 'right', 'u_turn', 'take_escalator', 'take_elevator', 'arrive', 'depart']),
     landmarkRef: z.string().optional(),
     landmarkName: z.string().optional(),
     floor: z.number().optional(),
     estimatedSteps: z.number().optional(),
     isCorrection: z.boolean().optional(),
     completedAt: z.date().optional(),
});

const createNavigationSessionZodSchema = z.object({
     body: z.object({
          user: z.string({ required_error: 'User ID is required' }),
          venue: z.string().optional(),
          inputSource: z.enum(['voice', 'photo', 'text', 'chat', 'history'], { required_error: 'Input source is required' }),
          chatSession: z.string().optional(),
          mediaAssets: z.array(z.string()).optional(),
          origin: z.string({ required_error: 'Origin is required' }),
          destination: z.string({ required_error: 'Destination is required' }),
          destinationLabel: z.string().optional(),
          destinationIconType: z.enum(['shop', 'restaurant', 'hotel', 'hospital', 'pin', 'other']).optional(),
          indoorContext: z.object({
               currentZone: z.string().optional(),
               currentFloor: z.number().optional(),
               lastSeenLandmark: z.string().optional(),
               lastPhotoAsset: z.string().optional(),
               confidenceScore: z.number().optional(),
               needsRecheckPhoto: z.boolean().optional(),
               lastUpdatedAt: z.date().optional(),
          }).optional(),
          currentGPS: z.object({
               lat: z.number().optional(),
               lng: z.number().optional(),
               capturedAt: z.date().optional(),
          }).optional(),
          steps: z.array(routeStepZodSchema).optional(),
          currentStepIndex: z.number().optional(),
          totalSteps: z.number().optional(),
          status: z.enum(['pending', 'active', 'completed', 'cancelled']).optional(),
          correctionCount: z.number().optional(),
          recheckPhotoCount: z.number().optional(),
          recenteredCount: z.number().optional(),
          voiceGuidanceEnabled: z.boolean().optional(),
          startedAt: z.date().optional(),
          completedAt: z.date().optional(),
     }),
});

const updateNavigationSessionZodSchema = z.object({
     body: z.object({
          user: z.string().optional(),
          venue: z.string().optional(),
          inputSource: z.enum(['voice', 'photo', 'text', 'chat', 'history']).optional(),
          chatSession: z.string().optional(),
          mediaAssets: z.array(z.string()).optional(),
          origin: z.string().optional(),
          destination: z.string().optional(),
          destinationLabel: z.string().optional(),
          destinationIconType: z.enum(['shop', 'restaurant', 'hotel', 'hospital', 'pin', 'other']).optional(),
          indoorContext: z.object({
               currentZone: z.string().optional(),
               currentFloor: z.number().optional(),
               lastSeenLandmark: z.string().optional(),
               lastPhotoAsset: z.string().optional(),
               confidenceScore: z.number().optional(),
               needsRecheckPhoto: z.boolean().optional(),
               lastUpdatedAt: z.date().optional(),
          }).optional(),
          currentGPS: z.object({
               lat: z.number().optional(),
               lng: z.number().optional(),
               capturedAt: z.date().optional(),
          }).optional(),
          steps: z.array(routeStepZodSchema).optional(),
          currentStepIndex: z.number().optional(),
          totalSteps: z.number().optional(),
          status: z.enum(['pending', 'active', 'completed', 'cancelled']).optional(),
          correctionCount: z.number().optional(),
          recheckPhotoCount: z.number().optional(),
          recenteredCount: z.number().optional(),
          voiceGuidanceEnabled: z.boolean().optional(),
          startedAt: z.date().optional(),
          completedAt: z.date().optional(),
     }),
});

export const NavigationSessionValidation = {
     createNavigationSessionZodSchema,
     updateNavigationSessionZodSchema,
};