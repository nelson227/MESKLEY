export type FamilyStatus = "celibataire" | "marie" | "divorce" | "veuf" | "concubinage";
export type EmploymentStatus = "salarie" | "independant" | "fonctionnaire" | "etudiant" | "retraite" | "sans_emploi";
export type CurrentLivingStatus = "locataire" | "proprietaire" | "heberge" | "autre";
export type ApplicationStatus = "en_attente" | "en_examen" | "acceptee" | "refusee";

export interface Guarantor {
  fullName: string;
  relationship: string;
  phone: string;
  monthlyIncome: number;
}

export interface ApplicationDocuments {
  idDocument: string;
  incomeProof: string | null;
  addressProof: string | null;
  otherDocuments: string[];
}

export interface RentalApplication {
  _id: string;
  dossierId: string;
  fullName: string;
  birthDate: string;
  phone: string;
  email: string;
  idNumber: string;
  nationality: string;
  familyStatus: FamilyStatus;
  householdSize: number;
  employmentStatus: EmploymentStatus;
  employerName: string | null;
  jobTitle: string | null;
  monthlyIncome: number;
  employmentDuration: string | null;
  listingId: string | null;
  desiredMoveIn: string;
  desiredDuration: string;
  maxBudget: number;
  currentAddress: string | null;
  currentStatus: CurrentLivingStatus | null;
  movingReason: string | null;
  hasGuarantor: boolean;
  guarantor: Guarantor | null;
  documents: ApplicationDocuments;
  message: string | null;
  status: ApplicationStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}
