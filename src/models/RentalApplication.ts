import mongoose, { Schema, Document } from "mongoose";

export interface IRentalApplication extends Document {
  dossierId: string;
  fullName: string;
  birthDate: Date;
  phone: string;
  email: string;
  idNumber: string;
  nationality: string;
  familyStatus: string;
  householdSize: number;
  employmentStatus: string;
  employerName: string | null;
  jobTitle: string | null;
  monthlyIncome: number;
  employmentDuration: string | null;
  listingId: mongoose.Types.ObjectId | null;
  desiredMoveIn: Date;
  desiredDuration: string;
  maxBudget: number;
  currentAddress: string | null;
  currentStatus: string | null;
  movingReason: string | null;
  hasGuarantor: boolean;
  guarantor: {
    fullName: string;
    relationship: string;
    phone: string;
    monthlyIncome: number;
  } | null;
  documents: {
    idDocument: string;
    incomeProof: string | null;
    addressProof: string | null;
    otherDocuments: string[];
  };
  message: string | null;
  status: string;
  adminNotes: string | null;
}

const RentalApplicationSchema = new Schema<IRentalApplication>(
  {
    dossierId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    birthDate: { type: Date, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    idNumber: { type: String, required: true },
    nationality: { type: String, required: true },
    familyStatus: { type: String, enum: ["celibataire", "marie", "divorce", "veuf", "concubinage"], required: true },
    householdSize: { type: Number, required: true },
    employmentStatus: { type: String, enum: ["salarie", "independant", "fonctionnaire", "etudiant", "retraite", "sans_emploi"], required: true },
    employerName: { type: String, default: null },
    jobTitle: { type: String, default: null },
    monthlyIncome: { type: Number, required: true },
    employmentDuration: { type: String, default: null },
    listingId: { type: Schema.Types.ObjectId, ref: "Listing", default: null },
    desiredMoveIn: { type: Date, required: true },
    desiredDuration: { type: String, required: true },
    maxBudget: { type: Number, required: true },
    currentAddress: { type: String, default: null },
    currentStatus: { type: String, enum: ["locataire", "proprietaire", "heberge", "autre", null], default: null },
    movingReason: { type: String, default: null },
    hasGuarantor: { type: Boolean, default: false },
    guarantor: {
      type: {
        fullName: String,
        relationship: String,
        phone: String,
        monthlyIncome: Number,
      },
      default: null,
    },
    documents: {
      idDocument: { type: String, required: true },
      incomeProof: { type: String, default: null },
      addressProof: { type: String, default: null },
      otherDocuments: [{ type: String }],
    },
    message: { type: String, default: null },
    status: { type: String, enum: ["en_attente", "en_examen", "acceptee", "refusee"], default: "en_attente" },
    adminNotes: { type: String, default: null },
  },
  { timestamps: true }
);

RentalApplicationSchema.index({ status: 1 });
RentalApplicationSchema.index({ dossierId: 1 });

export default mongoose.models.RentalApplication || mongoose.model<IRentalApplication>("RentalApplication", RentalApplicationSchema);
