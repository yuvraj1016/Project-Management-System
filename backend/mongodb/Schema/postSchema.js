import { Schema, model } from 'mongoose';
import User from './userSchema.js';

const projectSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
    maxLength: 30,
  },
  firstName: {
    type: String,
    required: true,
    ref: User
  },
  lastName: {
    type: String,
    required: true,
    ref: User
  },
  rollNumber: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 8,
    ref: User
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4,
    ref: User
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
    ref: User
  },
  projectImage: {
    data: Buffer,
    contentType: String,
  },
  projectDescription: {
    type: String,
    maxLength: 1000,
  },
  supervisorName: {
    type: String,
    default: null
  },
  supervisorEmail: {
    type: String,
    default: null,
  },
  projectFile: {
    data: Buffer,
    contentType: String,
  },
  domain: {
    type: String,
    required: true,
  },
  viewed: {
    type: Number,
    default: 0,
  },
  grade: {
    type: String,
    default: null,
  },
  status:{
    type:String,
    default:"Pending"
  }
});

const Project = model('Project', projectSchema);

export default Project;
