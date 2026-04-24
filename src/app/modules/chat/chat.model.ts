import { Schema, model } from 'mongoose';

const chatMessageSchema = new Schema(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    text: { type: String, default: null },
    attachments: [
      {
        assetId: { type: Schema.Types.ObjectId, ref: 'MediaAsset' },
        mediaType: { type: String, enum: ['image', 'video', 'audio'] },
        url: { type: String },
        purpose: { type: String },
      },
    ],
    actionCard: {
      cardType: {
        type: String,
        enum: ['start_navigation', 'directions', 'location_info', 'product_location', 'recheck_request', null],
        default: null,
      },
      locationId: { type: Schema.Types.ObjectId, ref: 'Location', default: null },
      venueZoneId: { type: Schema.Types.ObjectId, ref: 'VenueZone', default: null },
      address: { type: String, default: null },
      label: { type: String, default: null },
      ctaLabel: { type: String, default: null },
    },
    navigationInstruction: {
      instructionText: { type: String, default: null },
      landmarkRef: { type: Schema.Types.ObjectId, ref: 'VisualLandmark', default: null },
      maneuver: { type: String, enum: ['straight', 'left', 'right', 'u_turn', 'arrive', null], default: null },
      isCorrection: { type: Boolean, default: false },
    },
    voiceTranscript: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const chatSessionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    venue: { type: Schema.Types.ObjectId, ref: 'Venue', default: null },
    title: { type: String, default: 'New Chat' },
    messages: [chatMessageSchema],
    resolvedDestination: { type: Schema.Types.ObjectId, ref: 'Location', default: null },
    resolvedVenueZone: { type: Schema.Types.ObjectId, ref: 'VenueZone', default: null },
    status: { type: String, enum: ['active', 'closed'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

chatSessionSchema.pre('find', function (this: any, next: (err?: any) => void) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

export const ChatSession = model('ChatSession', chatSessionSchema);
