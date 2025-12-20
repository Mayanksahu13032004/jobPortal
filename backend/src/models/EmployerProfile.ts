import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployerProfile extends Document {
  user: mongoose.Types.ObjectId;
  companyName: string;
  website: string;
  industry: string;
  contactEmail: string;
  contactPhone: string;
}

const EmployerProfileSchema = new Schema<IEmployerProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    companyName: {
      type: String,
      required: true
    },
    website: {
      type: String
    },
    industry: {
      type: String
    },
    contactEmail: {
      type: String,
      required: true
    },
    contactPhone: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model<IEmployerProfile>(
  'EmployerProfile',
  EmployerProfileSchema
);
