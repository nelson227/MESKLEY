import mongoose, { Schema, Document } from "mongoose";

export interface IJobApplication extends Document {
  referenceId: string;
  fullName: string;
  email: string;
  phone: string;
  desiredPosition: string;
  educationLevel: string;
  yearsExperience: string;
  availability: string;
  cvUrl: string;
  coverLetterUrl: string | null;
  message: string | null;
  status: string;
  adminNotes: string | null;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    referenceId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    desiredPosition: { type: String, required: true },
    educationLevel: { type: String, enum: ["bac", "bac2", "bac3", "bac45", "doctorat", "autre"], required: true },
    yearsExperience: { type: String, required: true },
    availability: { type: String, enum: ["immediate", "1_mois", "3_mois"], required: true },
    cvUrl: { type: String, required: true },
    coverLetterUrl: { type: String, default: null },
    message: { type: String, default: null },
    status: { type: String, enum: ["recue", "en_etude", "entretien", "acceptee", "non_retenue"], default: "recue" },
    adminNotes: { type: String, default: null },
  },
  { timestamps: true }
);

JobApplicationSchema.index({ status: 1 });
JobApplicationSchema.index({ referenceId: 1 });

export default mongoose.models.JobApplication || mongoose.model<IJobApplication>("JobApplication", JobApplicationSchema);
