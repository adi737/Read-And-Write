import { model, Schema } from 'mongoose';

const ArticleSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  intro: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  picture: [
    {
      imgUrl: {
        type: String,
        required: true
      },
      imgName: {
        type: String,
        required: true
      }
    }
  ],
  likes: [
    {
      userID: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
      }
    }
  ],
  dislikes: [
    {
      userID: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
      }
    }
  ],
  comments: [
    {
      userID: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
      text: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      },
      likes: [
        {
          userID: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true
          }
        }
      ],
      dislikes: [
        {
          userID: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true
          }
        }
      ]
    }
  ],
  date: {
    type: Date,
    default: Date.now
  },
});

export default model('articles', ArticleSchema);