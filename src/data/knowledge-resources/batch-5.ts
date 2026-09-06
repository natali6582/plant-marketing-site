import { guides } from '../knowledge-batches/batch-5';
export const resources=guides.map(g=>({track:g.track,title:g.title,description:'מדריך הכנה עם שאלות, מקורות רשמיים ותאריך בדיקה גלוי.',href:`/knowledge/${g.track}/decision-guide/`,type:'מדריך החלטה'}));
