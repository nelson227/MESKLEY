import mongoose, { Schema, Document } from "mongoose";

export interface IContactMessage extends Document {
  fullName: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, enum: ["logement", "renseignement", "partenariat", "autre"], required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.ContactMessage || mongoose.model<IContactMessage>("ContactMessage", ContactMessageSchema);
