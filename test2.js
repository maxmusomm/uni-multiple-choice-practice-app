const s = `{
"quiz\\_title": "Biology Practice Quiz: Carbohydrates",
"questions": [
{
"id": 1,
"question\\_type": ["text"],
"answer\\_type": "text",
"question": "What is the general chemical formula for carbohydrates and the specific ratio of hydrogen to oxygen found in them?",
"options": [
{ "text": "Cx(H2O)y with a 1:1 ratio", "correct": false },
{ "text": "Cx(H2O)y with a 2:1 ratio", "correct": true, "explanation": "Carbohydrates, or 'hydrates of carbon', follow the general formula Cx(H2O)y, meaning they contain hydrogen and oxygen in a 2:1 ratio, the same as in water." },
{ "text": "CnH2nOn with a 1:2 ratio", "correct": false },
{ "text": "CH2O with a 2:1 ratio", "correct": false }
]
},
{
"id": 2,
"question\\_type": [
"image",
"\\<svg width='200' height='200' viewBox='0 0 200 200' xmlns='[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)'\\>\\<g stroke='white' stroke-width='2' fill='none'\\>\\<line x1='100' y1='50' x2='100' y2='150'/\\>\\<line x1='80' y1='100' x2='120' y2='100'/\\>\\</g\\>\\<text x='105' y='45' fill='white' font-family='Arial' font-size='12'\\>CH2OH\\</text\\>\\<text x='125' y='105' fill='white' font-family='Arial' font-size='12'\\>C=O\\</text\\>\\<text x='105' y='165' fill='white' font-family='Arial' font-size='12'\\>CH2OH\\</text\\>\\</svg\\>"
],
"answer\\_type": "text",
"question": "The image represents a specific triose sugar. Which of the following correctly identifies this molecule and its classification?",
"options": [
{ "text": "Glyceraldehyde; an aldose", "correct": false },
{ "text": "Dihydroxyacetone; a ketose", "correct": true, "explanation": "The structure shows a three-carbon sugar (triose) with a non-terminal carbonyl group (C=O) at the center of the chain, which defines it as dihydroxyacetone, a ketotriose." },
{ "text": "Ribose; a pentose", "correct": false },
{ "text": "Glucose; a hexose", "correct": false }
]
}
]
}`;
let cleaned = s;
cleaned = cleaned.replace(/\`\`\`json/gi, '');
cleaned = cleaned.replace(/\`\`\`/g, '');
cleaned = cleaned.replace(/\\\\_/g, '_');
cleaned = cleaned.replace(/\\\\</g, '<');
cleaned = cleaned.replace(/\\\\>/g, '>');
cleaned = cleaned.replace(/\[(https?:\/\/[^\]]+)\]\((https?:\/\/[^)]+)\)/g, '$2');
cleaned = cleaned.replace(/\[cite_start\]/g, '');
cleaned = cleaned.replace(/\[cite:[^\]]*\]/g, '');

try { JSON.parse(cleaned); console.log('success'); } catch(e) { console.log(e); console.log(cleaned.substring(0, 1000)); }
