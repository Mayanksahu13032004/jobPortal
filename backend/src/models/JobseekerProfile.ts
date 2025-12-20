import mongoose, { Schema, Document } from 'mongoose';

export interface IJobseekerProfile extends Document {
  user: mongoose.Types.ObjectId;
  phone: string;
  location: string;
  skills: string[];
  experience: number;
  resumeUrl: string;
}

const JobseekerProfileSchema = new Schema<IJobseekerProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    phone: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    skills: {
      type: [String],
      default: []
    },
    experience: {
      type: Number,
      default: 0
    },
    resumeUrl: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model<IJobseekerProfile>(
  'JobseekerProfile',
  JobseekerProfileSchema
);
