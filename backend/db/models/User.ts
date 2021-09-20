import { model, Schema } from 'mongoose';

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  nick: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    minlength: 4,
    maxlength: 15
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  date: {
    type: Date,
    default: Date.now
  },
  avatar: String,
});

export default model('users', UserSchema);