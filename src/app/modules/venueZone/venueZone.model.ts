import { Schema, model } from 'mongoose';

const venueZoneSchema = new Schema(
  {
    venue: { type: Schema.Types.ObjectId, ref: 'Venue', required: true },
    name: { type: String, required: true, trim: true },
    floor: { type: Number, default: 0 },
    zoneType: {
      type: String,
      enum: ['store', 'food_court', 'restroom', 'entrance', 'exit', 'corridor', 'elevator', 'escalator', 'parking', 'information', 'other'],
      default: 'other',
    },
    description: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

venueZoneSchema.index({ venue: 1, floor: 1 });

venueZoneSchema.pre('find', function (this: any, next: (err?: any) => void) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

export const VenueZone = model('VenueZone', venueZoneSchema);
