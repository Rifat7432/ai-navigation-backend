import { model, Schema } from 'mongoose';
import { IVenue, VenueModel } from './venue.interface';

// ═══════════════════════════════════════════════════════════════
// VENUE
//    A physical place: mall, airport, supermarket, etc.
//    Populated by the team OR by user contributions.
// ═══════════════════════════════════════════════════════════════
const venueSchema = new Schema<IVenue, VenueModel>(
     {
          name: { type: String, required: true, trim: true }, // "Bashundhara City Mall"
          venueType: {
               type: String,
               enum: ['mall', 'airport', 'supermarket', 'hospital', 'office', 'university', 'other'],
               required: true,
          },
          address: { type: String, default: '' },
          city: { type: String, default: '' },
          country: { type: String, default: '' },

          // Outdoor GPS coordinates for the venue entrance (used to match arriving users)
          gpsCoordinates: {
               type: { type: String, enum: ['Point'], default: 'Point' },
               coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
          },

          // How many floors does this venue have
          totalFloors: { type: Number, default: 1 },

          // Overall data quality — updated as contributions are approved
          mappingStatus: {
               type: String,
               enum: ['unmapped', 'partial', 'complete'],
               default: 'unmapped',
          },
          coverImage: { type: String, default: null }, // representative photo URL
          isVerified: { type: Boolean, default: false }, // verified by MAIZ team
          isDeleted: { type: Boolean, default: false },
     },
     { timestamps: true },
);

venueSchema.index({ gpsCoordinates: '2dsphere' }); // geospatial queries — find nearest venue

venueSchema.pre('find', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});
venueSchema.pre('findOne', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});
venueSchema.pre('aggregate', function (next) {
     this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
     next();
});

export const Venue = model<IVenue, VenueModel>('Venue', venueSchema);