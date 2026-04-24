import { Schema, model } from 'mongoose';

const dataCoverageSchema = new Schema(
  {
    venue: { type: Schema.Types.ObjectId, ref: 'Venue', default: null },
    center: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    radius: { type: Number, required: true }, // in meters
    coverageType: {
      type: String,
      enum: ['full', 'partial', 'none'],
      default: 'none',
    },
    lastUpdated: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

dataCoverageSchema.index({ center: '2dsphere' });

dataCoverageSchema.pre('find', function (this: any, next: (err?: any) => void) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

export const DataCoverage = model('DataCoverage', dataCoverageSchema);
