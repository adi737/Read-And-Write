import { model, Schema } from 'mongoose';

const ProfileSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  status: {
    type: String,
    required: true
  },
  company: {
    type: String,
  },
  location: {
    type: String,
  },
  skills: {
    type: [String],
    required: true
  },
  experience: [
    {
      position: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      location: {
        type: String,
        required: true
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean
      },
      description: {
        type: String
      }
    }
  ],
  education: [
    {
      school: {
        type: String,
        required: true
      },
      fieldofstudy: {
        type: String,
      },
      degree: {
        type: String,
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean
      },
      description: {
        type: String
      }
    }
  ],

  youtube: {
    type: String
  },
  twitter: {
    type: String
  },
  facebook: {
    type: String
  },
  linkedin: {
    type: String
  },
  instagram: {
    type: String
  },

  date: {
    type: Date,
    default: Date.now
  }
});

export default model('profiles', ProfileSchema);