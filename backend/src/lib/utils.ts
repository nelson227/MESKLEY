export function generateReference(prefix?: string): string {
  const year = new Date().getFullYear();
  const rand = String(Math.floor(Math.random() * 100000)).padStart(5, "0");
  return prefix ? `MLK-${prefix}-${year}-${rand}` : `MLK-${year}-${rand}`;
}

export function generateDossierId(): string {
  return generateReference("DEM");
}
