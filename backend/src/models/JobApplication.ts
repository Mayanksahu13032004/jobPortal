import mongoose, { Schema, Document } from 'mongoose';

export interface IJobApplication extends Document {
  job: mongoose.Types.ObjectId;
  applicant: mongoose.Types.ObjectId;
  status: 'applied' | 'reviewed' | 'rejected' | 'accepted';
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    applicant: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['applied', 'reviewed', 'rejected', 'accepted'],
      default: 'applied'
    }
  },
  { timestamps: true }
);

// Prevent duplicate applications
JobApplicationSchema.index(
  { job: 1, applicant: 1 },
  { unique: true }
);

export default mongoose.model<IJobApplication>(
  'JobApplication',
  JobApplicationSchema
);
