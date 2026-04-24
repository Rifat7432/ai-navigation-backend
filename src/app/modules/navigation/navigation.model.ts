import { Schema, model } from 'mongoose';

const routeStepSchema = new Schema(
  {
    stepIndex: { type: Number, required: true },
    instructionText: { type: String, required: true },
    maneuver: {
      type: String,
      enum: ['straight', 'left', 'right', 'u_turn', 'take_escalator', 'take_elevator', 'arrive', 'depart'],
    },
    landmarkRef: { type: Schema.Types.ObjectId, ref: 'VisualLandmark', default: null },
    landmarkName: { type: String, default: null },
    floor: { type: Number, default: null },
    estimatedSteps: { type: Number, default: null },
    isCorrection: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
  },
  { _id: true }
);

const navigationSessionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    venue: { type: Schema.Types.ObjectId, ref: 'Venue', default: null },
    inputSource: {
      type: String,
      enum: ['voice', 'photo', 'text', 'chat', 'history'],
      required: true,
    },
    chatSession: { type: Schema.Types.ObjectId, ref: 'ChatSession', default: null },
    mediaAssets: [{ type: Schema.Types.ObjectId, ref: 'MediaAsset' }],
    origin: { type: Schema.Types.ObjectId, ref: 'Location', required: false },
    originImage: { type: Schema.Types.ObjectId, ref: 'MediaAsset', default: null },
    destination: { type: Schema.Types.ObjectId, ref: 'Location', required: false },
    destinationImage: { type: Schema.Types.ObjectId, ref: 'MediaAsset', default: null },
    destinationLabel: { type: String, default: null },
    destinationIconType: {
      type: String,
      enum: ['shop', 'restaurant', 'hotel', 'hospital', 'pin', 'other'],
      default: 'pin',
    },
    indoorContext: {
      currentZone: { type: Schema.Types.ObjectId, ref: 'VenueZone', default: null },
      currentFloor: { type: Number, default: null },
      lastSeenLandmark: { type: Schema.Types.ObjectId, ref: 'VisualLandmark', default: null },
      lastPhotoAsset: { type: Schema.Types.ObjectId, ref: 'MediaAsset', default: null },
      confidenceScore: { type: Number, default: null },
      needsRecheckPhoto: { type: Boolean, default: false },
      lastUpdatedAt: { type: Date, default: null },
    },
    currentGPS: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
      capturedAt: { type: Date, default: null },
    },
    steps: [routeStepSchema],
    currentStepIndex: { type: Number, default: 0 },
    totalSteps: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'active', 'completed', 'cancelled'],
      default: 'pending',
    },
    correctionCount: { type: Number, default: 0 },
    recheckPhotoCount: { type: Number, default: 0 },
    recenteredCount: { type: Number, default: 0 },
    voiceGuidanceEnabled: { type: Boolean, default: true },
    aiConversationHistory: [
      {
        role: { type: String, enum: ['user', 'assistant'] },
        content: { type: String },
        timestamp: { type: Date, default: Date.now },
      }
    ],
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

navigationSessionSchema.pre('find', function (this: any, next: (err?: any) => void) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

export const NavigationSession = model('NavigationSession', navigationSessionSchema);
