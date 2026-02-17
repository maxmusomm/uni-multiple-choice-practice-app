Project: Biology Quiz Practice Application
Create a SvelteKit application for practicing biology questions with the following specifications:
Core Features

Question Upload System

Provide a textarea where users can paste JSON data
Parse and validate the JSON format
Load questions into the application state


Quiz Functionality

Display questions one at a time
Show 4 answer options plus an "I Don't Know" option
Scoring system:

Correct answer: +1 point
Wrong answer: -1 point
"I Don't Know": 0 points


Track total score throughout the quiz
Show progress (e.g., "Question 5 of 20")


Timer Feature

Allow users to set a custom timer duration before starting the quiz
Display a countdown timer during the quiz
Alert/notify when time expires
Option to continue or auto-submit when timer reaches zero


State Persistence

Save quiz progress to browser's localStorage (current question index, score, timer state, loaded questions)
Automatically restore state if user refreshes the page
Clear localStorage when:

User completes the quiz
User explicitly ends the session
User closes/leaves the page (use beforeunload event)





JSON Format
The application should expect questions in this exact format:
json{
  "quiz_title": "Biology Practice Quiz",
  "questions": [
    {
      "id": 1,
      "question": "What is the powerhouse of the cell?",
      "options": [
        {
          "text": "Nucleus",
          "correct": false
        },
        {
          "text": "Mitochondria",
          "correct": true
        },
        {
          "text": "Ribosome",
          "correct": false
        },
        {
          "text": "Golgi apparatus",
          "correct": false
        }
      ]
    },
    {
      "id": 2,
      "question": "Which process do plants use to convert sunlight into energy?",
      "options": [
        {
          "text": "Respiration",
          "correct": false
        },
        {
          "text": "Photosynthesis",
          "correct": true
        },
        {
          "text": "Fermentation",
          "correct": false
        },
        {
          "text": "Glycolysis",
          "correct": false
        }
      ]
    }
  ]
}
Technical Requirements
Tech Stack:

SvelteKit (latest version)
Tailwind CSS for all styling
TypeScript (recommended for type safety)

UI/UX Requirements:

Clean, responsive design that works on mobile and desktop
Clear visual feedback for selected answers
Display current score prominently
Show timer countdown clearly
Provide a results summary at the end showing:

Final score
Number of correct/incorrect/"I don't know" answers
Option to start a new quiz



State Management:

Use localStorage with a unique key (e.g., 'biology-quiz-state')
Store: current question index, score, timer remaining, answers given, loaded questions
Implement proper cleanup on session end

Validation:

Validate JSON structure before loading
Show error messages for invalid JSON
Ensure exactly 4 options per question (plus the implicit "I Don't Know")

Implementation Steps

Set up SvelteKit project with Tailwind CSS
Create the JSON upload/input component
Build the quiz interface (question display, options, timer)
Implement scoring logic
Add localStorage persistence
Create results/summary page
Add cleanup logic for session end
Style with Tailwind CSS for a polished look

Nice-to-Have Features

Animation transitions between questions
Visual progress bar
Option to review incorrect answers at the end
Export results functionality

Build this as a single-page application with clear navigation and intuitive controls