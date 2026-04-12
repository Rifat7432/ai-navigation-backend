import { model, Schema } from 'mongoose';
import { ILocation, LocationModel } from './location.interface';

// 7. LOCATION
//    A saved point of interest — origin or destination.
//    For indoors: linked to a venue zone + landmark.
//    For outdoors: GPS coordinates only.
const locationSchema = new Schema<ILocation, LocationModel>(
     {
          user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
          venue: { type: Schema.Types.ObjectId, ref: 'Venue', default: null },
          zone: { type: Schema.Types.ObjectId, ref: 'VenueZone', default: null },

          label: { type: String, trim: true }, // "Super Shop", "Pharmacy"
          address: { type: String, default: '' },

          locationType: {
               type: String,
               enum: ['indoor', 'outdoor'],
               default: 'indoor',
          },
          floor: { type: Number, default: null },

          // GPS — used only for outdoor or venue entrance detection
          gpsCoordinates: {
               type: { type: String, enum: ['Point'], default: 'Point' },
               coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
          },

          // Indoor relative position (% of floor plan)
          indoorPosition: {
               x: { type: Number, default: null },
               y: { type: Number, default: null },
          },

          isFavorite: { type: Boolean, default: false },
          visitedAt: { type: Date, default: Date.now },
          isDeleted: { type: Boolean, default: false },
     },
     { timestamps: true },
);

locationSchema.index({ gpsCoordinates: '2dsphere' });

locationSchema.pre('find', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});
locationSchema.pre('findOne', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});
locationSchema.pre('aggregate', function (next) {
     this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
     next();
});

export const Location = model<ILocation, LocationModel>('Location', locationSchema);