import coachingDataRaw from '../public/coachingInstitutes.json';
const coachingData: Record<string, { name: string; url: string }[]> = coachingDataRaw as any;

/**
 * Get coaching institutes for a job title (case-insensitive, trimmed).
 * Returns array of {name, url} or empty array if not found.
 */
export function getCoachingInstitutesForTitle(title: string): { name: string; url: string }[] {
  if (!title) return [];
  const normalize = (str: string) => str.trim().toLowerCase().replace(/\s+/g, ' ');
  const normalizedTitle = normalize(title);
  const foundKey = Object.keys(coachingData).find(
    key => normalize(key) === normalizedTitle ||
      normalize(key).includes(normalizedTitle) ||
      normalizedTitle.includes(normalize(key))
  );
  if (foundKey) return coachingData[foundKey];
  return [];
}
