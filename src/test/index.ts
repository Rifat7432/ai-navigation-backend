import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { model, Schema } from 'mongoose';
import { IUser, UserModel } from '../app/modules/user/user.interface';
import { USER_ROLES } from '../enums/user';
import AppError from '../errors/AppError';
import config from '../config';

// ═══════════════════════════════════════════════════════════════
// HELPER — reusable soft-delete middleware
// ═══════════════════════════════════════════════════════════════
const softDeleteMiddleware = (schema: Schema<any>) => {
     schema.pre('find', function (next) {
          (this as any).find({ isDeleted: { $ne: true } });
          next();
     });
     schema.pre('findOne', function (next) {
          (this as any).find({ isDeleted: { $ne: true } });
          next();
     });
     schema.pre('aggregate', function (next) {
          (this as any).pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
          next();
     });
};

// ═══════════════════════════════════════════════════════════════
// 1. USER  (your existing model — untouched)
// ═══════════════════════════════════════════════════════════════
const userSchema = new Schema<IUser, UserModel>(
     {
          email: { type: String, unique: true, lowercase: true },
          fullName: { type: String },
          image: { type: String },
          role: {
               type: String,
               enum: Object.values(USER_ROLES) as string[],
               default: USER_ROLES.USER,
          },
          password: {
               type: String,
               required: false,
               select: false,
               minlength: 8,
          },
          verified: { type: Boolean, default: false },
          status: { type: String, default: 'active' },
          region: { type: String, default: '' },
          location: { type: String, default: '' },
          authProvider: { type: String, default: 'local' },
          socialId: { type: String, default: '' },
          isResetPassword: { type: Boolean, default: false },
          oneTimeCode: { type: Number, default: null },
          OTPExpireAt: { type: Date, default: null },
          isDeleted: { type: Boolean, default: false },

          // ── Wallet (for venue contribution rewards) ──────────────
          //   wallet: {
          //        balance: { type: Number, default: 0 }, // current earnable balance in USD
          //        totalEarned: { type: Number, default: 0 }, // lifetime earnings
          //        totalWithdrawn: { type: Number, default: 0 },
          //   },
     },
     { timestamps: true },
);

userSchema.statics.isExistUserById = async (id: string) => await User.findById(id);
userSchema.statics.isExistUserByEmail = async (email: string) => await User.findOne({ email });
userSchema.statics.isExistUserByPhone = async (phoneNumber: string) => await User.findOne({ phoneNumber });
userSchema.statics.isMatchPassword = async (password: string, hashPassword: string): Promise<boolean> => await bcrypt.compare(password, hashPassword);

userSchema.pre('save', async function (this: any, next: any) {
     if (this.isModified('email')) {
          const isExist = await User.findOne({ email: this.get('email') });
          if (isExist && String(isExist._id) !== String(this._id)) throw new AppError(StatusCodes.BAD_REQUEST, 'Email already exists!');
     }
     if (this.isModified('password') && this.password) this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt_rounds));
     if (this.isModified('firstName') || this.isModified('lastName')) {
          const firstName = this.firstName?.trim() || '';
          const lastName = this.lastName?.trim() || '';
          this.fullName = [firstName, lastName].filter(Boolean).join(' ');
     }
     next();
});

softDeleteMiddleware(userSchema as any);
export const User = model<IUser, UserModel>('User', userSchema);

// ═══════════════════════════════════════════════════════════════
// 2. VENUE
//    A physical place: mall, airport, supermarket, etc.
//    Populated by the team OR by user contributions.
// ═══════════════════════════════════════════════════════════════
const venueSchema = new Schema(
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
softDeleteMiddleware(venueSchema);
export const Venue = model('Venue', venueSchema);

// ═══════════════════════════════════════════════════════════════
// 3. VENUE ZONE
//    A named section within a venue on a specific floor.
//    e.g. "Food Court – Floor 2", "Electronics Aisle – Ground"
// ═══════════════════════════════════════════════════════════════
const venueZoneSchema = new Schema(
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
softDeleteMiddleware(venueZoneSchema);
export const VenueZone = model('VenueZone', venueZoneSchema);

// ═══════════════════════════════════════════════════════════════
// 4. VISUAL LANDMARK
//    A specific visual anchor the AI can recognise in a photo.
//    e.g. a store sign, a pillar, a specific aisle marker.
// ═══════════════════════════════════════════════════════════════
const visualLandmarkSchema = new Schema(
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
softDeleteMiddleware(visualLandmarkSchema);
export const VisualLandmark = model('VisualLandmark', visualLandmarkSchema);

// ═══════════════════════════════════════════════════════════════
// 5. MEDIA ASSET
//    Photos, videos, and audio clips uploaded by users.
//    Used for: initial grounding photo, re-check photos,
//              voice commands, venue contributions.
// ═══════════════════════════════════════════════════════════════
const mediaAssetSchema = new Schema(
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

softDeleteMiddleware(mediaAssetSchema);
export const MediaAsset = model('MediaAsset', mediaAssetSchema);

// ═══════════════════════════════════════════════════════════════
// 6. CHAT SESSION  (MAIZ AI conversational guidance thread)
//    One session = one full conversation with the AI guide.
//    Messages are embedded for fast reads.
// ═══════════════════════════════════════════════════════════════

// 6a. Embedded message sub-document
const chatMessageSchema = new Schema(
     {
          role: { type: String, enum: ['user', 'assistant'], required: true },

          // Plain text content  e.g. "I can't find it" / "Walk forward until you see the fish store"
          text: { type: String, default: null },

          // Multimodal attachments
          attachments: [
               {
                    assetId: { type: Schema.Types.ObjectId, ref: 'MediaAsset' },
                    mediaType: { type: String, enum: ['image', 'video', 'audio'] },
                    url: { type: String },
                    purpose: { type: String },
               },
          ],

          // Structured action card returned by AI  (e.g. "Get Directions" button)
          actionCard: {
               cardType: {
                    type: String,
                    enum: ['start_navigation', 'directions', 'location_info', 'product_location', 'recheck_request', null],
                    default: null,
               },
               locationId: { type: Schema.Types.ObjectId, ref: 'Location', default: null },
               venueZoneId: { type: Schema.Types.ObjectId, ref: 'VenueZone', default: null },
               address: { type: String, default: null },
               label: { type: String, default: null },
               ctaLabel: { type: String, default: null }, // "Get Directions", "Take Photo"
          },

          // Conversational guidance instruction (landmark-based, human style)
          navigationInstruction: {
               instructionText: { type: String, default: null }, // "Walk forward until you see the fish store"
               landmarkRef: { type: Schema.Types.ObjectId, ref: 'VisualLandmark', default: null },
               maneuver: { type: String, enum: ['straight', 'left', 'right', 'u_turn', 'arrive', null], default: null },
               isCorrection: { type: Boolean, default: false }, // true = user said "I can't find it"
          },

          // Voice transcription
          voiceTranscript: { type: String, default: null },

          createdAt: { type: Date, default: Date.now },
     },
     { _id: true },
);

// 6b. Chat session root document
const chatSessionSchema = new Schema(
     {
          user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
          venue: { type: Schema.Types.ObjectId, ref: 'Venue', default: null },
          title: { type: String, default: 'New Chat' },

          messages: [chatMessageSchema],

          resolvedDestination: { type: Schema.Types.ObjectId, ref: 'Location', default: null },
          resolvedVenueZone: { type: Schema.Types.ObjectId, ref: 'VenueZone', default: null },

          status: { type: String, enum: ['active', 'closed'], default: 'active' },
          isDeleted: { type: Boolean, default: false },
     },
     { timestamps: true },
);

softDeleteMiddleware(chatSessionSchema);
export const ChatSession = model('ChatSession', chatSessionSchema);

// ═══════════════════════════════════════════════════════════════
// 7. LOCATION
//    A saved point of interest — origin or destination.
//    For indoors: linked to a venue zone + landmark.
//    For outdoors: GPS coordinates only.
// ═══════════════════════════════════════════════════════════════
const locationSchema = new Schema(
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
softDeleteMiddleware(locationSchema);
export const Location = model('Location', locationSchema);

// ═══════════════════════════════════════════════════════════════
// 8. NAVIGATION SESSION
//    One record = one complete journey attempt.
//    Origin → Destination guided by landmarks and AI conversation.
// ═══════════════════════════════════════════════════════════════

// 8a. Embedded landmark-based route step (NO GPS polylines — indoor is visual)
const routeStepSchema = new Schema(
     {
          stepIndex: { type: Number, required: true },
          instructionText: { type: String, required: true }, // "Walk forward until you see the fish store"
          maneuver: {
               type: String,
               enum: ['straight', 'left', 'right', 'u_turn', 'take_escalator', 'take_elevator', 'arrive', 'depart'],
          },
          landmarkRef: { type: Schema.Types.ObjectId, ref: 'VisualLandmark', default: null },
          landmarkName: { type: String, default: null }, // "Fish Store", "Starbucks Sign"
          floor: { type: Number, default: null },
          estimatedSteps: { type: Number, default: null }, // walking steps estimate
          isCorrection: { type: Boolean, default: false }, // generated after "I can't find it"
          completedAt: { type: Date, default: null },
     },
     { _id: true },
);

// 8b. Navigation session root document
const navigationSessionSchema = new Schema(
     {
          user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
          venue: { type: Schema.Types.ObjectId, ref: 'Venue', default: null },

          // How was this session triggered?
          inputSource: {
               type: String,
               enum: ['voice', 'photo', 'text', 'chat', 'history'],
               required: true,
          },

          // Linked context that triggered navigation
          chatSession: { type: Schema.Types.ObjectId, ref: 'ChatSession', default: null },
          mediaAssets: [{ type: Schema.Types.ObjectId, ref: 'MediaAsset' }],

          // Origin & Destination
          origin: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
          destination: { type: Schema.Types.ObjectId, ref: 'Location', required: true },

          destinationLabel: { type: String, default: null }, // "Super Shop"
          destinationIconType: {
               type: String,
               enum: ['shop', 'restaurant', 'hotel', 'hospital', 'pin', 'other'],
               default: 'pin',
          },

          // AI's current understanding of where the user is (updated in real-time)
          indoorContext: {
               currentZone: { type: Schema.Types.ObjectId, ref: 'VenueZone', default: null },
               currentFloor: { type: Number, default: null },
               lastSeenLandmark: { type: Schema.Types.ObjectId, ref: 'VisualLandmark', default: null },
               lastPhotoAsset: { type: Schema.Types.ObjectId, ref: 'MediaAsset', default: null },
               confidenceScore: { type: Number, default: null }, // 0–1: how sure AI is of location
               needsRecheckPhoto: { type: Boolean, default: false }, // AI flagged confusion
               lastUpdatedAt: { type: Date, default: null },
          },

          // Current GPS (outdoors only / venue entrance)
          currentGPS: {
               lat: { type: Number, default: null },
               lng: { type: Number, default: null },
               capturedAt: { type: Date, default: null },
          },

          // Route
          steps: [routeStepSchema],
          currentStepIndex: { type: Number, default: 0 },
          totalSteps: { type: Number, default: 0 },

          // Stats
          status: {
               type: String,
               enum: ['pending', 'active', 'completed', 'cancelled'],
               default: 'pending',
          },
          correctionCount: { type: Number, default: 0 }, // times user said "I can't find it"
          recheckPhotoCount: { type: Number, default: 0 }, // times AI asked for a new photo
          recenteredCount: { type: Number, default: 0 }, // times user hit Recenter
          voiceGuidanceEnabled: { type: Boolean, default: true },

          startedAt: { type: Date, default: null },
          completedAt: { type: Date, default: null },
          isDeleted: { type: Boolean, default: false },
     },
     { timestamps: true },
);

softDeleteMiddleware(navigationSessionSchema);
export const NavigationSession = model('NavigationSession', navigationSessionSchema);

// ═══════════════════════════════════════════════════════════════
// 9. SEARCH HISTORY
//    Powers History screen — Today / Last Week / Last Month
// ═══════════════════════════════════════════════════════════════
const searchHistorySchema = new Schema(
     {
          user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
          venue: { type: Schema.Types.ObjectId, ref: 'Venue', default: null },

          query: { type: String, default: null }, // raw voice / text query
          resolvedAddress: { type: String, default: null }, // "Tv gate, Mohakhali, Dhaka 1212"
          location: { type: Schema.Types.ObjectId, ref: 'Location', default: null },

          inputType: {
               type: String,
               enum: ['text', 'voice', 'photo'],
               default: 'text',
          },

          searchedAt: { type: Date, default: Date.now, index: true },
          isDeleted: { type: Boolean, default: false },
     },
     { timestamps: false },
);

// Compound index — fast Today / Last Week / Last Month queries
searchHistorySchema.index({ user: 1, searchedAt: -1 });
softDeleteMiddleware(searchHistorySchema);
export const SearchHistory = model('SearchHistory', searchHistorySchema);

// ═══════════════════════════════════════════════════════════════
// 10. VENUE CONTRIBUTION
//     Users upload photos/videos of unmapped venues to earn money.
//     Each approved contribution credits the user's wallet.
// ═══════════════════════════════════════════════════════════════
const venueContributionSchema = new Schema(
     {
          contributor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
          venue: { type: Schema.Types.ObjectId, ref: 'Venue', default: null }, // null = new venue suggestion
          zone: { type: Schema.Types.ObjectId, ref: 'VenueZone', default: null },

          // What they submitted
          mediaAssets: [{ type: Schema.Types.ObjectId, ref: 'MediaAsset', required: true }],
          description: { type: String, default: null }, // optional note from contributor

          // New venue details (if venue doesn't exist yet)
          suggestedVenueDetails: {
               name: { type: String, default: null },
               venueType: { type: String, default: null },
               address: { type: String, default: null },
               city: { type: String, default: null },
               country: { type: String, default: null },
          },

          // Review workflow
          status: {
               type: String,
               enum: ['pending', 'under_review', 'approved', 'rejected'],
               default: 'pending',
          },
          reviewedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }, // MAIZ admin
          reviewNote: { type: String, default: null },
          reviewedAt: { type: Date, default: null },

          // Reward
          rewardAmount: { type: Number, default: 0 }, // USD credited on approval
          rewardPaid: { type: Boolean, default: false },
          rewardPaidAt: { type: Date, default: null },

          isDeleted: { type: Boolean, default: false },
     },
     { timestamps: true },
);

softDeleteMiddleware(venueContributionSchema);
export const VenueContribution = model('VenueContribution', venueContributionSchema);

// ═══════════════════════════════════════════════════════════════
// 11. WALLET TRANSACTION
//     Logs every credit / debit on a user's wallet.
// ═══════════════════════════════════════════════════════════════
const walletTransactionSchema = new Schema(
     {
          user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
          type: {
               type: String,
               enum: ['credit', 'debit', 'withdrawal'],
               required: true,
          },
          amount: { type: Number, required: true }, // USD
          balanceAfter: { type: Number, required: true }, // wallet balance after this tx

          reason: {
               type: String,
               enum: ['venue_contribution_reward', 'withdrawal', 'bonus', 'refund'],
               required: true,
          },

          // Reference to what triggered this transaction
          contributionId: { type: Schema.Types.ObjectId, ref: 'VenueContribution', default: null },

          note: { type: String, default: null },
          isDeleted: { type: Boolean, default: false },
     },
     { timestamps: true },
);

walletTransactionSchema.index({ user: 1, createdAt: -1 });
softDeleteMiddleware(walletTransactionSchema);
export const WalletTransaction = model('WalletTransaction', walletTransactionSchema);
