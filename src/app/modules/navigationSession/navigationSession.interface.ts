import { Model } from 'mongoose';
import { Types } from 'mongoose';

export type IRouteStep = {
     stepIndex: number;
     instructionText: string;
     maneuver: 'straight' | 'left' | 'right' | 'u_turn' | 'take_escalator' | 'take_elevator' | 'arrive' | 'depart';
     landmarkRef?: Types.ObjectId;
     landmarkName?: string;
     floor?: number;
     estimatedSteps?: number;
     isCorrection?: boolean;
     completedAt?: Date;
};

export type INavigationSession = {
     user: Types.ObjectId;
     venue?: Types.ObjectId;
     inputSource: 'voice' | 'photo' | 'text' | 'chat' | 'history';
     chatSession?: Types.ObjectId;
     mediaAssets?: Types.ObjectId[];
     origin: Types.ObjectId;
     destination: Types.ObjectId;
     destinationLabel?: string;
     destinationIconType?: 'shop' | 'restaurant' | 'hotel' | 'hospital' | 'pin' | 'other';
     indoorContext: {
          currentZone?: Types.ObjectId;
          currentFloor?: number;
          lastSeenLandmark?: Types.ObjectId;
          lastPhotoAsset?: Types.ObjectId;
          confidenceScore?: number;
          needsRecheckPhoto?: boolean;
          lastUpdatedAt?: Date;
     };
     currentGPS?: {
          lat?: number;
          lng?: number;
          capturedAt?: Date;
     };
     steps: IRouteStep[];
     currentStepIndex?: number;
     totalSteps?: number;
     status?: 'pending' | 'active' | 'completed' | 'cancelled';
     correctionCount?: number;
     recheckPhotoCount?: number;
     recenteredCount?: number;
     voiceGuidanceEnabled?: boolean;
     startedAt?: Date;
     completedAt?: Date;
     isDeleted?: boolean;
};

export type NavigationSessionModel = Model<INavigationSession>;