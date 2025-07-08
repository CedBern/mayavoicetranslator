
import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  // We will store a hashed password, not the plain text
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    enum: ['contributor', 'validator', 'admin'],
    default: ['contributor'],
    required: true,
  },
  // For OAuth integration
  googleId: { type: String },
  githubId: { type: String },

}, { timestamps: true });


// TODO: Add pre-save hook to hash password before saving

const User = mongoose.model('User', UserSchema);

export default User;
