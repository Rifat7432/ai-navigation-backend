import { model, Schema } from 'mongoose';
import { IChatSession, ChatSessionModel, IChatMessage } from './chatSession.interface';

// 6a. Embedded message sub-document
const chatMessageSchema = new Schema<IChatMessage>(
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
const chatSessionSchema = new Schema<IChatSession, ChatSessionModel>(
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

chatSessionSchema.pre('find', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});
chatSessionSchema.pre('findOne', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});
chatSessionSchema.pre('aggregate', function (next) {
     this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
     next();
});

export const ChatSession = model<IChatSession, ChatSessionModel>('ChatSession', chatSessionSchema);