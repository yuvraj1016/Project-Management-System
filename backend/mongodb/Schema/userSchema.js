import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true,
    minlength: 8,
    maxlength: 8,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4,
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
  },
  section: {
    type: String,
    required: true,
    maxlength: 1,
  },
  password: {
    type: String,
    required: true,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  branch: {
    type: String,
    required: true
  },
  supervisor: {
    type: String,
    default: null
  },
  supervisorEmail: {
    type: String,
    default: null,
    lowercase: true,
  },
  submissionDate: {
    type: Date,
    default: null
  }
});

const User = model('User', userSchema);

export default User;
