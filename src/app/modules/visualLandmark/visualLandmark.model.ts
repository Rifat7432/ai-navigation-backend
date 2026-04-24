import { Schema, model } from 'mongoose';

const visualLandmarkSchema = new Schema(
  {
    venue: { type: Schema.Types.ObjectId, ref: 'Venue', required: true },
    zone: { type: Schema.Types.ObjectId, ref: 'VenueZone', default: null },
    floor: { type: Number, default: 0 },
    name: { type: String, required: true },
    landmarkType: {
      type: String,
      enum: ['store_sign', 'aisle_sign', 'pillar', 'entrance_gate', 'escalator', 'elevator', 'restroom_sign', 'information_desk', 'other'],
      default: 'other',
    },
    gpsCoordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    referenceImages: [{ type: String }],
    visualDescriptor: { type: String, default: null },
    relativePosition: {
      x: { type: Number, default: null },
      y: { type: Number, default: null },
    },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

visualLandmarkSchema.index({ venue: 1, floor: 1 });

visualLandmarkSchema.pre('find', function (this: any, next: (err?: any) => void) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

export const VisualLandmark = model('VisualLandmark', visualLandmarkSchema);
