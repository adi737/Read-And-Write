import { model, Schema } from 'mongoose';

const MessageSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'conversations',
      required: true
    },
    text: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

export default model("messages", MessageSchema);