export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function generateReference(prefix: string, count: number): string {
  const year = new Date().getFullYear();
  const num = String(count).padStart(3, "0");
  return `MLK-${prefix}-${year}-${num}`;
}

export function generateDossierId(count: number): string {
  return generateReference("DEM", count);
}

export function generateCandidatureId(count: number): string {
  return generateReference("CAND", count);
}

export function generateListingReference(count: number): string {
  const year = new Date().getFullYear();
  const num = String(count).padStart(3, "0");
  return `MLK-${year}-${num}`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function isNewListing(createdAt: string): boolean {
  const created = new Date(createdAt);
  const now = new Date();
  const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    brouillon: "Brouillon",
    disponible: "Disponible",
    reserve: "Réservé",
    loue: "Loué",
    retire: "Retiré",
    en_attente: "En attente",
    en_examen: "En examen",
    acceptee: "Acceptée",
    refusee: "Refusée",
    recue: "Reçue",
    en_etude: "En étude",
    entretien: "Entretien",
    non_retenue: "Non retenue",
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    brouillon: "bg-gray-100 text-gray-800",
    disponible: "bg-green-100 text-green-800",
    reserve: "bg-yellow-100 text-yellow-800",
    loue: "bg-blue-100 text-blue-800",
    retire: "bg-red-100 text-red-800",
    en_attente: "bg-yellow-100 text-yellow-800",
    en_examen: "bg-blue-100 text-blue-800",
    acceptee: "bg-green-100 text-green-800",
    refusee: "bg-red-100 text-red-800",
    recue: "bg-yellow-100 text-yellow-800",
    en_etude: "bg-blue-100 text-blue-800",
    entretien: "bg-purple-100 text-purple-800",
    non_retenue: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    appartement: "Appartement",
    studio: "Studio",
    maison: "Maison",
    villa: "Villa",
    chambre: "Chambre",
    duplex: "Duplex",
  };
  return labels[type] || type;
}
