import { DOMAINS, ACCREDITATION_LEVELS } from './referentiel.js';

export const CRITERION_IDS = new Set(DOMAINS.flatMap((d) => d.criteria.map((c) => c.id)));

// Same rule as the website: criterion weight * (score / 100), summed.
export function computeScore(grades) {
  let total = 0;
  for (const d of DOMAINS) {
    for (const c of d.criteria) {
      const s = grades[c.id];
      if (typeof s === 'number') total += c.weight * (s / 100);
    }
  }
  return Math.round(total * 10) / 10;
}

// Levels are sorted high to low, so the first one the score reaches wins
// (avoids the gap between e.g. 89 and 90 for scores like 89.5).
export function accreditationLevel(score) {
  return (ACCREDITATION_LEVELS.find((l) => score >= l.min) || ACCREDITATION_LEVELS.at(-1)).label;
}
