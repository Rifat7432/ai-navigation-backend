import { model, Schema } from 'mongoose';
import { IMediaAsset, MediaAssetModel } from './mediaAsset.interface';

// ═══════════════════════════════════════════════════════════════
// MEDIA ASSET
//    Photos, videos, and audio clips uploaded by users.
//    Used for: initial grounding photo, re-check photos,
//              voice commands, venue contributions.
// ═══════════════════════════════════════════════════════════════
const mediaAssetSchema = new Schema<IMediaAsset, MediaAssetModel>(
     {
          user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
          mediaType: {
               type: String,
               enum: ['image', 'video', 'audio'],
               required: true,
          },

          // Purpose of this media asset
          purpose: {
               type: String,
               enum: [
                    'grounding_photo', // first photo user takes to orient the AI
                    'recheck_photo', // mid-navigation confusion re-check photo
                    'destination_photo', // photo of destination user wants to reach
                    'venue_contribution', // user uploading venue data to earn money
                    'voice_command', // voice message input
                    'chat_attachment', // general chat attachment
               ],
               required: true,
          },

          url: { type: String, required: true }, // cloud storage URL
          mimeType: { type: String, default: null },
          sizeBytes: { type: Number, default: null },
          durationSec: { type: Number, default: null }, // audio / video only
          thumbnail: { type: String, default: null },

          // What the AI extracted after processing this file
          aiAnalysis: {
               detectedVenueType: { type: String, default: null }, // "mall", "supermarket"
               detectedZone: { type: String, default: null }, // "Food Court", "Aisle 3"
               detectedLandmarks: [
                    {
                         landmarkId: { type: Schema.Types.ObjectId, ref: 'VisualLandmark' },
                         name: { type: String },
                         confidence: { type: Number }, // 0–1
                         boundingBox: {
                              x: Number,
                              y: Number,
                              width: Number,
                              height: Number,
                         },
                    },
               ],
               detectedText: { type: String, default: null }, // OCR text from signs
               detectedLocation: { type: String, default: null }, // human-readable location
               overallConfidence: { type: Number, default: null }, // 0–1
               tags: [{ type: String }], // ["shampoo", "aisle-3"]
               analysedAt: { type: Date, default: null },
          },

          // Optional link to venue if this was a venue contribution
          linkedVenue: { type: Schema.Types.ObjectId, ref: 'Venue', default: null },
          isDeleted: { type: Boolean, default: false },
     },
     { timestamps: true },
);

mediaAssetSchema.pre('find', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});
mediaAssetSchema.pre('findOne', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});
mediaAssetSchema.pre('aggregate', function (next) {
     this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
     next();
});

export const MediaAsset = model<IMediaAsset, MediaAssetModel>('MediaAsset', mediaAssetSchema);