import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  employer: mongoose.Types.ObjectId;
  title: string;
  description: string;
  qualifications: string[];
  responsibilities: string[];
  location: string;
  salaryMin: number;
  salaryMax: number;
}

const JobSchema = new Schema<IJob>(
  {
    employer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    qualifications: {
      type: [String],
      default: []
    },
    responsibilities: {
      type: [String],
      default: []
    },
    location: {
      type: String,
      required: true
    },
    salaryMin: {
      type: Number,
      required: true
    },
    salaryMax: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model<IJob>('Job', JobSchema);
