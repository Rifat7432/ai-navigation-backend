import { Schema, model } from 'mongoose';

const mediaAssetSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mediaType: {
      type: String,
      enum: ['image', 'video', 'audio'],
      required: true,
    },
    purpose: {
      type: String,
      enum: [
        'grounding_photo',
        'recheck_photo',
        'destination_photo',
        'venue_contribution',
        'voice_command',
        'chat_attachment',
      ],
      required: true,
    },
    url: { type: String, required: true },
    mimeType: { type: String, default: null },
    sizeBytes: { type: Number, default: null },
    durationSec: { type: Number, default: null },
    thumbnail: { type: String, default: null },
    aiAnalysis: {
      detectedVenueType: { type: String, default: null },
      detectedZone: { type: String, default: null },
      detectedLandmarks: [
        {
          landmarkId: { type: Schema.Types.ObjectId, ref: 'VisualLandmark' },
          name: { type: String },
          confidence: { type: Number },
          boundingBox: {
            x: Number,
            y: Number,
            width: Number,
            height: Number,
          },
        },
      ],
      detectedText: { type: String, default: null },
      detectedLocation: { type: String, default: null },
      overallConfidence: { type: Number, default: null },
      tags: [{ type: String }],
      analysedAt: { type: Date, default: null },
    },
    linkedVenue: { type: Schema.Types.ObjectId, ref: 'Venue', default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

mediaAssetSchema.pre('find', function (this: any, next: (err?: any) => void) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

export const MediaAsset = model('MediaAsset', mediaAssetSchema);
