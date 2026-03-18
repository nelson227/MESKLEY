import { z } from "zod";

export const listingSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères").max(200),
  description: z.string().min(20, "La description doit contenir au moins 20 caractères").max(5000),
  type: z.enum(["appartement", "studio", "maison", "villa", "chambre", "duplex"]),
  price: z.number().positive("Le prix doit être positif").max(10000000),
  deposit: z.number().nonnegative("La caution ne peut pas être négative"),
  charges: z.number().nonnegative().optional().default(0),
  chargesIncluded: z.boolean().optional().default(false),
  surface: z.number().positive("La surface doit être positive").max(10000),
  rooms: z.number().int().positive().max(50),
  bedrooms: z.number().int().nonnegative().max(30),
  bathrooms: z.number().int().positive().max(20),
  floor: z.number().int().nullable().optional(),
  furnished: z.boolean(),
  availableDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (AAAA-MM-JJ)"),
  address: z.string().min(5).max(300),
  city: z.string().min(2, "La ville est requise").max(100),
  neighborhood: z.string().min(2, "Le quartier est requis").max(100),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  features: z.array(z.string()).optional().default([]),
  facebookMarketplaceUrl: z.string().url().nullable().optional(),
  messengerLink: z.string().optional().default(""),
  status: z.enum(["brouillon", "disponible", "reserve", "loue", "retire"]).optional().default("brouillon"),
});

export const rentalApplicationSchema = z.object({
  fullName: z.string().min(2, "Le nom est requis").max(100),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide").max(20),
  email: z.string().email("Adresse e-mail invalide"),
  idNumber: z.string().min(5, "Numéro de pièce d'identité requis").max(50),
  nationality: z.string().min(2, "La nationalité est requise").max(50),
  familyStatus: z.enum(["celibataire", "marie", "divorce", "veuf", "concubinage"]),
  householdSize: z.number().int().positive().max(20),
  employmentStatus: z.enum(["salarie", "independant", "fonctionnaire", "etudiant", "retraite", "sans_emploi"]),
  employerName: z.string().max(100).optional().nullable(),
  jobTitle: z.string().max(100).optional().nullable(),
  monthlyIncome: z.number().nonnegative("Le revenu ne peut pas être négatif"),
  employmentDuration: z.string().optional().nullable(),
  listingId: z.string().optional().nullable(),
  desiredMoveIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide"),
  desiredDuration: z.string().min(1, "La durée est requise"),
  maxBudget: z.number().positive("Le budget doit être positif"),
  currentAddress: z.string().max(300).optional().nullable(),
  currentStatus: z.enum(["locataire", "proprietaire", "heberge", "autre"]).optional().nullable(),
  movingReason: z.string().max(1000).optional().nullable(),
  hasGuarantor: z.boolean().optional().default(false),
  guarantorName: z.string().max(100).optional().nullable(),
  guarantorRelation: z.string().max(100).optional().nullable(),
  guarantorPhone: z.string().max(20).optional().nullable(),
  guarantorIncome: z.number().nonnegative().optional().nullable(),
  message: z.string().max(2000).optional().nullable(),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: "Vous devez accepter les conditions" }) }),
});

export const jobApplicationSchema = z.object({
  fullName: z.string().min(2, "Le nom est requis").max(100),
  email: z.string().email("Adresse e-mail invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide").max(20),
  desiredPosition: z.string().min(2, "Le poste souhaité est requis").max(100),
  educationLevel: z.enum(["bac", "bac2", "bac3", "bac45", "doctorat", "autre"]),
  yearsExperience: z.enum(["0-1", "1-3", "3-5", "5-10", "10+"]),
  availability: z.enum(["immediate", "1_mois", "3_mois"]),
  message: z.string().max(2000).optional().nullable(),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: "Vous devez accepter les conditions" }) }),
});

export const contactSchema = z.object({
  fullName: z.string().min(2, "Le nom est requis").max(100),
  email: z.string().email("Adresse e-mail invalide"),
  subject: z.enum(["logement", "renseignement", "partenariat", "autre"]),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères").max(2000),
});

export const loginSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});
