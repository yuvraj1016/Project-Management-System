import { Schema, model } from 'mongoose';

const professorSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  department: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isCoordinator: {
    type: Boolean,
    default: false
  },
  coordinatingSem: {
    type: Number,
    min: 1,
    max: 4,
    default: null
  }
});

const Professor = model('Professor', professorSchema);

export default Professor;
