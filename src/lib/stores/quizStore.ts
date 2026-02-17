import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface Option {
    text: string;
    correct: boolean;
}

export interface Question {
    id: number;
    question: string;
    options: Option[];
}

export interface QuizState {
    questions: Question[];
    currentQuestionIndex: number;
    score: number;
    timer: number; // in seconds
    isActive: boolean;
    answers: { questionId: number; isCorrect: boolean; skipped: boolean }[];
    isFinished: boolean;
}

const STORAGE_KEY = 'biology-quiz-state';

const initialState: QuizState = {
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    timer: 0,
    isActive: false,
    answers: [],
    isFinished: false
};

function createQuizStore() {
    // Initialize from localStorage if available
    let startState = initialState;
    if (browser) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                startState = JSON.parse(stored);
            } catch (e) {
                console.error('Failed to parse stored quiz state', e);
            }
        }
    }

    const { subscribe, set, update } = writable<QuizState>(startState);

    return {
        subscribe,

        // Load questions and start the quiz
        startQuiz: (questions: Question[], timerDuration: number = 0) => {
            update(state => {
                const newState = {
                    ...initialState,
                    questions,
                    timer: timerDuration,
                    isActive: true
                };
                saveToStorage(newState);
                return newState;
            });
        },

        // Submit an answer
        submitAnswer: (isCorrect: boolean, skipped: boolean = false) => {
            update(state => {
                const currentQuestion = state.questions[state.currentQuestionIndex];
                if (!currentQuestion) return state;

                let scoreChange = 0;
                if (skipped) {
                    scoreChange = 0;
                } else if (isCorrect) {
                    scoreChange = 1;
                } else {
                    scoreChange = -1;
                }

                const newAnswers = [
                    ...state.answers,
                    { questionId: currentQuestion.id, isCorrect, skipped }
                ];

                // Check if this was the last question
                const isFinished = state.currentQuestionIndex >= state.questions.length - 1;

                const newState = {
                    ...state,
                    score: state.score + scoreChange,
                    answers: newAnswers,
                    // Move to next question if not finished, otherwise stay on last but mark finished
                    currentQuestionIndex: isFinished ? state.currentQuestionIndex : state.currentQuestionIndex + 1,
                    isActive: !isFinished,
                    isFinished: isFinished
                };

                saveToStorage(newState);
                return newState;
            });
        },

        // Utility to skip current question (functionally same as submitting skipped)
        skipQuestion: () => {
            // Reuse submitAnswer with skipped=true
            // We need to access the store methods, so we can't call this.submitAnswer directly easily 
            // without extracting the logic. 
            // Let's just duplicate the update logic or expose a helper.
            // Actually simpler to just have the UI call submitAnswer(false, true)
        },

        // Decrement timer
        tick: () => {
            update(state => {
                if (!state.isActive || state.timer <= 0) return state;

                const newTime = state.timer - 1;
                const isFinished = newTime <= 0;

                const newState = {
                    ...state,
                    timer: newTime,
                    isActive: !isFinished,
                    isFinished: state.isFinished || isFinished // If time runs out, quiz finishes? Project plan says "Option to continue or auto-submit". Let's pause for now.
                    // Actually plan says "Option to continue or auto-submit". For MVP let's auto-finish or just stop timer.
                    // Let's just stop the timer for now and let the UI handle the "Time's up" state.
                };

                saveToStorage(newState);
                return newState;
            });
        },

        // Reset completely
        reset: () => {
            set(initialState);
            if (browser) {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    };
}

// Helper to save to localStorage
function saveToStorage(state: QuizState) {
    if (browser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
}

export const quizStore = createQuizStore();
