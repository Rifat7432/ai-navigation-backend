import { model, Schema } from 'mongoose';
import { IVisualLandmark, VisualLandmarkModel } from './visualLandmark.interface';

// ═══════════════════════════════════════════════════════════════
// VISUAL LANDMARK
//    A specific visual anchor the AI can recognise in a photo.
//    e.g. a store sign, a pillar, a specific aisle marker.
// ═══════════════════════════════════════════════════════════════
const visualLandmarkSchema = new Schema<IVisualLandmark, VisualLandmarkModel>(
     {
          venue: { type: Schema.Types.ObjectId, ref: 'Venue', required: true },
          zone: { type: Schema.Types.ObjectId, ref: 'VenueZone', default: null },
          floor: { type: Number, default: 0 },

          name: { type: String, required: true }, // "Starbucks Sign", "Aisle 5 Marker"
          landmarkType: {
               type: String,
               enum: ['store_sign', 'aisle_sign', 'pillar', 'entrance_gate', 'escalator', 'elevator', 'restroom_sign', 'information_desk', 'other'],
               default: 'other',
          },

          // Reference photos of this landmark for AI training
          referenceImages: [{ type: String }], // array of image URLs

          // AI visual descriptor (embedding / feature vector stored as string ref or array)
          visualDescriptor: { type: String, default: null },

          // Approximate position within the venue (relative, not GPS)
          relativePosition: {
               x: { type: Number, default: null }, // % from left of floor plan
               y: { type: Number, default: null }, // % from top of floor plan
          },

          isActive: { type: Boolean, default: true },
          isDeleted: { type: Boolean, default: false },
     },
     { timestamps: true },
);

visualLandmarkSchema.index({ venue: 1, floor: 1 });

visualLandmarkSchema.pre('find', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});
visualLandmarkSchema.pre('findOne', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});
visualLandmarkSchema.pre('aggregate', function (next) {
     this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
     next();
});

export const VisualLandmark = model<IVisualLandmark, VisualLandmarkModel>('VisualLandmark', visualLandmarkSchema);