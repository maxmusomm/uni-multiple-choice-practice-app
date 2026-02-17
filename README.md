# BioTest Practice 🧬

**BioTest Practice** is a high-performance, responsive web application built with **SvelteKit** and **Tailwind CSS**. It is designed to help students and professionals master Biology through rigorous question practice with a focus on accuracy, timing, and progress tracking.

---

## ✨ Features

- 📂 **Dynamic Question Loading**: Upload your own question sets via a simple JSON-based system.
- ⏱️ **Integrated Timer**: Customizable countdown timer to simulate real exam conditions.
- 🎯 **Advanced Scoring**: Strategic scoring model (+1 correct, -1 wrong) to encourage thoughtful answers.
- 💾 **Smart Persistence**: Automatically saves your progress to `localStorage` – refresh the page and pick up exactly where you left off.
- 🎉 **Victory Celebration**: Interactive confetti effects upon quiz completion.
- 📱 **Mobile-First Design**: Fully responsive UI that looks stunning on desktops, tablets, and smartphones.

---

## 🚀 Getting Started

### Prerequisites

You will need [Bun](https://bun.sh/) or [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/BioTestPractice.git
   cd BioTestPractice
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Start the development server**
   ```bash
   bun run dev
   # or
   npm run dev
   ```

Visit `http://localhost:5173` to start practicing!

---

## 📊 JSON Schema Guide

To load your own questions, provide a JSON object in the following format:

```json
{
  "quiz_title": "Biology Practice Quiz",
  "questions": [
    {
      "id": 1,
      "question": "What is the powerhouse of the cell?",
      "options": [
        { "text": "Nucleus", "correct": false },
        { "text": "Mitochondria", "correct": true },
        { "text": "Ribosome", "correct": false },
        { "text": "Golgi apparatus", "correct": false }
      ]
    }
  ]
}
```

*Note: Each question must have exactly 4 options. The "I Don't Know" option is automatically added by the system.*

---

## 🛠️ Tech Stack

- **Framework**: [SvelteKit 5](https://svelte.dev/) (utilizing runes for reactive state management)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: Svelte Writable Stores with `localStorage` integration
- **Animations**: `canvas-confetti` for celebratory effects

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ for Biology students everywhere.

