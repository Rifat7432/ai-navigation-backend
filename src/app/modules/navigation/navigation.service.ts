import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import { AIService } from '../ai/ai.service';
import { NavigationSession } from './navigation.model';
import { MediaAsset } from '../media/media.model';

const startNavigation = async (userId: string, payload: any) => {
  // 1. Create a navigation session
  const session = await NavigationSession.create({
    user: userId,
    ...payload,
    status: 'active',
    startedAt: new Date(),
  });

  return session;
};

const processGrounding = async (userId: string, mediaAssetId: string) => {
  const mediaAsset = await MediaAsset.findById(mediaAssetId);
  if (!mediaAsset) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Media asset not found');
  }

  // 1. Analyze photo using AI
  const analysis = await AIService.analyzeGroundingPhoto(mediaAsset.url);

  // 2. Update media asset with AI analysis
  const updatedMedia = await MediaAsset.findByIdAndUpdate(
    mediaAssetId,
    { aiAnalysis: analysis },
    { new: true }
  );

  return updatedMedia;
};

const getNextInstruction = async (sessionId: string, userMessage?: string) => {
  const session = await NavigationSession.findById(sessionId)
    .populate('origin')
    .populate('destination');
    
  if (!session) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Session not found');
  }

  // Logic to determine next step based on AI and current context
  const originName = (session.origin as any)?.name || 'current location';
  const destinationName = (session.destination as any)?.name || session.destinationLabel || 'destination';
  const landmarks = session.steps?.map(step => step.landmarkName).filter(Boolean) as string[] || [];

  const instruction = await AIService.generateNavigationInstruction(
    originName,
    destinationName,
    landmarks.length > 0 ? landmarks : ['any visible signs'],
    session.user.toString()
  );

  // Update conversation history if user message exists
  if (userMessage) {
    await NavigationSession.findByIdAndUpdate(sessionId, {
      $push: {
        aiConversationHistory: [
          { role: 'user', content: userMessage },
          { role: 'assistant', content: instruction }
        ]
      }
    });
  }

  return { instruction };
};

const updateAiConversation = async (sessionId: string, message: { role: 'user' | 'assistant', content: string }) => {
  const session = await NavigationSession.findByIdAndUpdate(
    sessionId,
    {
      $push: { aiConversationHistory: { ...message, timestamp: new Date() } }
    },
    { new: true }
  );

  if (!session) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Session not found');
  }

  return session;
};

const verifyInboundLocation = async (sessionId: string, mediaAssetId: string) => {
  const session = await NavigationSession.findById(sessionId).populate('destination');
  if (!session) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Navigation session not found');
  }

  const mediaAsset = await MediaAsset.findById(mediaAssetId);
  if (!mediaAsset) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Media asset not found');
  }

  // 1. Analyze the photo using AI Vision (GPT-4o)
  const photoContext = await AIService.analyzeGroundingPhoto(mediaAsset.url);
  
  // 2. Resolve target floor (defaulting to destination floor if available)
  const targetFloor = (session.destination as any)?.floor || 4; 

  // 3. Ask AI to verify presence on the correct floor
  const prompt = `I've uploaded an image of my current floor. Based on your analysis, am I on the right floor? The target floor is ${targetFloor}. Detected floor from the image: ${photoContext.detectedFloor || 'unknown'}. Give me specific instructions on what to do next.`;

  const instruction = await AIService.generateChatResponse(
    session.aiConversationHistory || [],
    prompt,
    session.user.toString()
  );

  // 4. Update session history and status
  await NavigationSession.findByIdAndUpdate(sessionId, {
    $push: {
      aiConversationHistory: [
        { role: 'user', content: "[Verification Photo Uploaded]" },
        { role: 'assistant', content: instruction }
      ]
    },
    'indoorContext.currentFloor': photoContext.detectedFloor,
    'indoorContext.lastPhotoAsset': mediaAssetId,
  });

  return { instruction, photoContext };
};

export const NavigationService = {
  startNavigation,
  processGrounding,
  getNextInstruction,
  updateAiConversation,
  verifyInboundLocation,
};
