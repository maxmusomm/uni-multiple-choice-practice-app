# Biology Question Generation Prompt Template

Copy and paste the entire block below into an AI chat to generate questions for the BioQuiz app.

---

## AI Prompt Instructions

Act as a biology education expert. Your task is to generate a set of multiple-choice questions based on the provided notes. The questions must be formatted in a specific JSON structure so they can be directly uploaded to a quiz application.

### Requirements:
1. **JSON Format**: You must return ONLY the raw JSON object. Do not include any introductory or concluding text.
2. **Options**: Each question must have exactly 4 options.
3. **Correct Answer**: Exactly one option per question must be marked as `"correct": true`.
4. **Question Structure**:
   - `id`: An incrementing integer.
   - `question`: The text of the question.
   - `options`: An array of 4 objects, each with `text` (string) and `correct` (boolean).

### JSON Schema Example:
```json
{
  "quiz_title": "[Insert Subject Name] Practice Quiz",
  "questions": [
    {
      "id": 1,
      "question": "Sample Question Text",
      "options": [
        { "text": "Option A", "correct": false },
        { "text": "Option B", "correct": true },
        { "text": "Option C", "correct": false },
        { "text": "Option D", "correct": false }
      ]
    }
  ]
}
```

### Source Material (Notes):
[PASTE YOUR NOTES HERE]

---

### Generation Task:
Based on the notes above, please generate [NUMBER OF QUESTIONS] questions in the JSON format specified.

