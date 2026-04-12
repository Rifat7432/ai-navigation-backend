import { model, Schema } from 'mongoose';
import { INavigationSession, NavigationSessionModel, IRouteStep } from './navigationSession.interface';

// 8a. Embedded landmark-based route step (NO GPS polylines — indoor is visual)
const routeStepSchema = new Schema<IRouteStep>(
     {
          stepIndex: { type: Number, required: true },
          instructionText: { type: String, required: true }, // "Walk forward until you see the fish store"
          maneuver: {
               type: String,
               enum: ['straight', 'left', 'right', 'u_turn', 'take_escalator', 'take_elevator', 'arrive', 'depart'],
          },
          landmarkRef: { type: Schema.Types.ObjectId, ref: 'VisualLandmark', default: null },
          landmarkName: { type: String, default: null }, // "Fish Store", "Starbucks Sign"
          floor: { type: Number, default: null },
          estimatedSteps: { type: Number, default: null }, // walking steps estimate
          isCorrection: { type: Boolean, default: false }, // generated after "I can't find it"
          completedAt: { type: Date, default: null },
     },
     { _id: true },
);

// 8b. Navigation session root document
const navigationSessionSchema = new Schema<INavigationSession, NavigationSessionModel>(
     {
          user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
          venue: { type: Schema.Types.ObjectId, ref: 'Venue', default: null },

          // How was this session triggered?
          inputSource: {
               type: String,
               enum: ['voice', 'photo', 'text', 'chat', 'history'],
               required: true,
          },

          // Linked context that triggered navigation
          chatSession: { type: Schema.Types.ObjectId, ref: 'ChatSession', default: null },
          mediaAssets: [{ type: Schema.Types.ObjectId, ref: 'MediaAsset' }],

          // Origin & Destination
          origin: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
          destination: { type: Schema.Types.ObjectId, ref: 'Location', required: true },

          destinationLabel: { type: String, default: null }, // "Super Shop"
          destinationIconType: {
               type: String,
               enum: ['shop', 'restaurant', 'hotel', 'hospital', 'pin', 'other'],
               default: 'pin',
          },

          // AI's current understanding of where the user is (updated in real-time)
          indoorContext: {
               currentZone: { type: Schema.Types.ObjectId, ref: 'VenueZone', default: null },
               currentFloor: { type: Number, default: null },
               lastSeenLandmark: { type: Schema.Types.ObjectId, ref: 'VisualLandmark', default: null },
               lastPhotoAsset: { type: Schema.Types.ObjectId, ref: 'MediaAsset', default: null },
               confidenceScore: { type: Number, default: null }, // 0–1: how sure AI is of location
               needsRecheckPhoto: { type: Boolean, default: false }, // AI flagged confusion
               lastUpdatedAt: { type: Date, default: null },
          },

          // Current GPS (outdoors only / venue entrance)
          currentGPS: {
               lat: { type: Number, default: null },
               lng: { type: Number, default: null },
               capturedAt: { type: Date, default: null },
          },

          // Route
          steps: [routeStepSchema],
          currentStepIndex: { type: Number, default: 0 },
          totalSteps: { type: Number, default: 0 },

          // Stats
          status: {
               type: String,
               enum: ['pending', 'active', 'completed', 'cancelled'],
               default: 'pending',
          },
          correctionCount: { type: Number, default: 0 }, // times user said "I can't find it"
          recheckPhotoCount: { type: Number, default: 0 }, // times AI asked for a new photo
          recenteredCount: { type: Number, default: 0 }, // times user hit Recenter
          voiceGuidanceEnabled: { type: Boolean, default: true },

          startedAt: { type: Date, default: null },
          completedAt: { type: Date, default: null },
          isDeleted: { type: Boolean, default: false },
     },
     { timestamps: true },
);

navigationSessionSchema.pre('find', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});
navigationSessionSchema.pre('findOne', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});
navigationSessionSchema.pre('aggregate', function (next) {
     this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
     next();
});

export const NavigationSession = model<INavigationSession, NavigationSessionModel>('NavigationSession', navigationSessionSchema);