import { model, Schema } from 'mongoose';
import { IVenueZone, VenueZoneModel } from './venueZone.interface';

// ═══════════════════════════════════════════════════════════════
// VENUE ZONE
//    A named section within a venue on a specific floor.
//    e.g. "Food Court – Floor 2", "Electronics Aisle – Ground"
// ═══════════════════════════════════════════════════════════════
const venueZoneSchema = new Schema<IVenueZone, VenueZoneModel>(
     {
          venue: { type: Schema.Types.ObjectId, ref: 'Venue', required: true },
          name: { type: String, required: true, trim: true }, // "Fish Store", "Pharmacy"
          floor: { type: Number, default: 0 },
          zoneType: {
               type: String,
               enum: ['store', 'food_court', 'restroom', 'entrance', 'exit', 'corridor', 'elevator', 'escalator', 'parking', 'information', 'other'],
               default: 'other',
          },
          description: { type: String, default: null },
          isDeleted: { type: Boolean, default: false },
     },
     { timestamps: true },
);

venueZoneSchema.index({ venue: 1, floor: 1 });

venueZoneSchema.pre('find', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});
venueZoneSchema.pre('findOne', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});
venueZoneSchema.pre('aggregate', function (next) {
     this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
     next();
});

export const VenueZone = model<IVenueZone, VenueZoneModel>('VenueZone', venueZoneSchema);