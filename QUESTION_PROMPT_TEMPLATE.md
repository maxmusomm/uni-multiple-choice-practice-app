# Biology Question Generation Prompt Template

Copy and paste the entire block below into an AI chat to generate questions for the BioQuiz app.

---
Act as a Biology education expert. Your task is to generate a set of multiple-choice questions based on the provided notes. Return ONLY the raw JSON object in the exact format required by the quiz application. Each question must have exactly 4 options; exactly one option must be marked as "correct": true. The correct option MUST include an "explanation" field describing why it is correct. The "explanation" must always be written in text, even when answer_type is "image".

CRITICAL JSON FORMATTING RULES:
- Do NOT wrap the JSON output in markdown code blocks like \`\`\`json ... \`\`\`. The response should begin with { and end with } and contain ONLY the JSON.
- Do NOT escape underscores in JSON keys (must use "question_type", not "question\\_type").
- Do NOT escape angle brackets in SVG code (must use "<svg>", not "\\<svg\\>").
- Do NOT include markdown code blocks, formatting, or citation tags (like [cite_start] or [cite: ...]) anywhere in the JSON output.
- Do NOT format URLs as markdown hyperlinks (must use "http://...", not "[http://...](http://...)").

JSON Schema:
{
  "quiz_title": "Biology Practice Quiz",
  "questions": [
    {
      "id": 1,
      "question_type": ["text"],
      "answer_type": "text",
      "question": "...",
      "options": [
        { "text": "...", "correct": false },
        { "text": "...", "correct": true, "explanation": "..." },
        { "text": "...", "correct": false },
        { "text": "...", "correct": false }
      ]
    }
  ]
}

Field definitions:
- "question_type": an array that describes the question format.
  - Index 0: the type, either "text" or "image".
  - Index 1: ONLY included if index 0 is "image". Must contain the full SVG code that visually represents the question. Make sure that the SVGs are styled in white so they are visible on a dark background. If index 0 is "text", the array has only one element.
  - Examples:
    - Text question:  ["text"]
    - Image question: ["image", "<svg>...</svg>"]
- "answer_type": indicates whether the answer options are presented as "text" or "image". Regardless of this value, "explanation" must always be written in plain text.

---

### Generation Task:
Based on the notes above, please generate [NUMBER OF QUESTIONS] questions in the JSON format specified.

