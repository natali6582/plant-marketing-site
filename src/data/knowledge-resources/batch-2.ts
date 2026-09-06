import { kits } from '../knowledge-batches/batch-2';
export const resources = kits.map(k => ({ track: k.track, title: k.title, description: 'מדריך קצר, תבנית למילוי ולהדפסה ודוגמה בדיונית מלאה.', href: `/knowledge/${k.track}/${k.slug}/`, type: 'ערכת פגישה' }));
