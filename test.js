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
},
{
"id": 3,
"question\\_type": ["text"],
"answer\\_type": "text",
"question": "Which of the following statements correctly explains why sucrose is classified as a non-reducing sugar?",
"options": [
{ "text": "It lacks a glycosidic bond between its monomers.", "correct": false },
{ "text": "It is composed of two glucose molecules which are both aldoses.", "correct": false },
{ "text": "The aldehyde group of glucose and the ketone group of fructose are involved in the 1,2-glycosidic bond.", "correct": true, "explanation": "Sucrose is non-reducing because the bond forms between Carbon 1 of glucose (aldehyde group) and Carbon 2 of fructose (ketone group), 'locking' the groups that normally provide reducing properties." },
{ "text": "It can be easily hydrolyzed into reducing monosaccharides.", "correct": false }
]
},
{
"id": 4,
"question\\_type": ["text"],
"answer\\_type": "text",
"question": "Starch and glycogen are both storage polysaccharides made of alpha-glucose. How do they differ structurally?",
"options": [
{ "text": "Starch is found in animals while glycogen is found in plants.", "correct": false },
{ "text": "Glycogen has shorter and more frequent branches than the amylopectin in starch.", "correct": true, "explanation": "While both contain alpha-1,4 and alpha-1,6 glycosidic bonds, glycogen is more highly branched with shorter chains compared to the amylopectin component of starch." },
{ "text": "Starch contains beta-1,4 bonds while glycogen contains alpha-1,4 bonds.", "correct": false },
{ "text": "Glycogen forms a straight chain helix while starch is always branched.", "correct": false }
]
},
{
"id": 5,
"question\\_type": [
"image",
"\\<svg width='300' height='150' viewBox='0 0 300 150' xmlns='[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)'\\>\\<g stroke='white' stroke-width='2' fill='none'\\>\\<polygon points='40,60 70,30 110,30 140,60 110,90 70,90'/\\>\\<polygon points='180,60 210,30 250,30 280,60 250,90 210,90' transform='rotate(180, 230, 60)'/\\>\\<line x1='140' y1='60' x2='180' y2='60'/\\>\\<circle cx='160' cy='60' r='5' fill='white'/\\>\\</g\\>\\<text x='65' y='110' fill='white' font-family='Arial' font-size='10'\\>Beta-glucose\\</text\\>\\<text x='205' y='25' fill='white' font-family='Arial' font-size='10'\\>Rotated Beta-glucose\\</text\\>\\</svg\\>"
],
"answer\\_type": "text",
"question": "The diagram illustrates the arrangement of monomers in a specific polysaccharide. Which molecule is formed by this 180-degree rotation of adjacent units?",
"options": [
{ "text": "Amylose", "correct": false },
{ "text": "Glycogen", "correct": false },
{ "text": "Cellulose", "correct": true, "explanation": "In cellulose, the monomers are beta-glucose. To form a beta-1,4-glycosidic bond, each successive glucose molecule must be rotated 180 degrees relative to its neighbor, resulting in a straight, high-tensile strength fibre." },
{ "text": "Lactose", "correct": false }
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
cleaned = cleaned.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$2');
cleaned = cleaned.replace(/\[cite_start\]/g, '');
cleaned = cleaned.replace(/\[cite:[^\]]*\]/g, '');

try { JSON.parse(cleaned); console.log('success'); } catch(e) { console.log(e); console.log(cleaned.substring(0, 1000)); }
