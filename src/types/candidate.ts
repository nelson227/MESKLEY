export type EducationLevel = "bac" | "bac2" | "bac3" | "bac45" | "doctorat" | "autre";
export type Availability = "immediate" | "1_mois" | "3_mois";
export type CandidatureStatus = "recue" | "en_etude" | "entretien" | "acceptee" | "non_retenue";

export interface JobApplication {
  _id: string;
  referenceId: string;
  fullName: string;
  email: string;
  phone: string;
  desiredPosition: string;
  educationLevel: EducationLevel;
  yearsExperience: string;
  availability: Availability;
  cvUrl: string;
  coverLetterUrl: string | null;
  message: string | null;
  status: CandidatureStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}
