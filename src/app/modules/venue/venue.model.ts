import { Schema, model } from 'mongoose';

const venueSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    venueType: {
      type: String,
      enum: ['mall', 'airport', 'supermarket', 'hospital', 'office', 'university', 'other'],
      required: true,
    },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    country: { type: String, default: '' },
    gpsCoordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    totalFloors: { type: Number, default: 1 },
    mappingStatus: {
      type: String,
      enum: ['unmapped', 'partial', 'complete'],
      default: 'unmapped',
    },
    coverImage: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

venueSchema.index({ gpsCoordinates: '2dsphere' });

venueSchema.pre('find', function (this: any, next: (err?: any) => void) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

export const Venue = model('Venue', venueSchema);
