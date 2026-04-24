import { Schema, model } from 'mongoose';

const locationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    venue: { type: Schema.Types.ObjectId, ref: 'Venue', default: null },
    zone: { type: Schema.Types.ObjectId, ref: 'VenueZone', default: null },
    label: { type: String, trim: true },
    address: { type: String, default: '' },
    locationType: {
      type: String,
      enum: ['indoor', 'outdoor'],
      default: 'indoor',
    },
    floor: { type: Number, default: null },
    gpsCoordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    indoorPosition: {
      x: { type: Number, default: null },
      y: { type: Number, default: null },
    },
    isFavorite: { type: Boolean, default: false },
    visitedAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

locationSchema.index({ gpsCoordinates: '2dsphere' });

locationSchema.pre('find', function (this: any, next: (err?: any) => void) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

export const Location = model('Location', locationSchema);
