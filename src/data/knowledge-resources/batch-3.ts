import { cases } from '../knowledge-batches/batch-3';
export const resources = cases.map(c=>({track:c.track,title:c.title,description:'מקרה בדיוני עם חלופות מחושבות וקישורים למחשבונים שמולאו מראש.',href:`/knowledge/${c.track}/case-study/`,type:'מקרה לדוגמה'}));
