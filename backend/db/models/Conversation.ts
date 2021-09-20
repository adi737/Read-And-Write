import { model, Schema } from 'mongoose';

const ConversationSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true
    }
  },

  { timestamps: true }
);

export default model('conversations', ConversationSchema);