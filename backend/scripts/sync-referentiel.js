// Copies the official referential from the frontend so server and website
// use the same criteria, weights and hospital list. Run after editing it.
import { copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const from = fileURLToPath(new URL('../../expert-visiteur/src/data/referentiel.js', import.meta.url));
const to = fileURLToPath(new URL('../src/referentiel.js', import.meta.url));
copyFileSync(from, to);
console.log('referentiel.js copied to backend/src');
