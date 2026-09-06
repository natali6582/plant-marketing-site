import { scenarioTools } from '../knowledge-batches/batch-4';
export const resources=scenarioTools.map(t=>({track:t.track,title:t.title,description:'תרחישים, הנחות גלויות, דוגמה מחושבת והדפסה.',href:`/knowledge/${t.track}/scenario-tool/`,type:'מחשבון תרחישים'}));
