<script lang="ts">
	import { quizStore, type Question } from "$lib/stores/quizStore";

	let jsonInput = $state("");
	let timerMinutes = $state(10);
	let error = $state<string | null>(null);

	function validateAndStart() {
		error = null;
		try {
			if (!jsonInput.trim()) {
				throw new Error("Please enter JSON content");
			}

			const parsed = JSON.parse(jsonInput);

			// Basic validation
			if (!parsed.questions || !Array.isArray(parsed.questions)) {
				throw new Error('JSON must contain a "questions" array');
			}

			if (parsed.questions.length === 0) {
				throw new Error("Questions array cannot be empty");
			}

			// Validate each question structure
			const validQuestions: Question[] = parsed.questions.map(
				(q: any, i: number) => {
					if (!q.question || typeof q.question !== "string") {
						throw new Error(
							`Question ${i + 1} is missing "question" text`,
						);
					}
					if (
						!q.options ||
						!Array.isArray(q.options) ||
						q.options.length !== 4
					) {
						throw new Error(
							`Question ${i + 1} must have exactly 4 options`,
						);
					}
					return {
						id: q.id || i + 1,
						question: q.question,
						options: q.options.map((o: any) => ({
							text: o.text || "",
							correct: !!o.correct,
							explanation: o.explanation,
						})),
					};
				},
			);

			// Start quiz
			quizStore.startQuiz(validQuestions, timerMinutes * 60);
		} catch (e) {
			if (e instanceof Error) {
				error = e.message;
			} else {
				error = "Invalid JSON format";
			}
		}
	}

	function loadExample() {
		const example = {
			quiz_title: "Biology Example",
			questions: [
				{
					id: 1,
					question: "What is the powerhouse of the cell?",
					options: [
						{ text: "Nucleus", correct: false },
						{
							text: "Mitochondria",
							correct: true,
							explanation:
								"Mitochondria generate most of the chemical energy needed to power the cell's biochemical reactions.",
						},
						{ text: "Ribosome", correct: false },
						{ text: "Golgi apparatus", correct: false },
					],
				},
			],
		};
		jsonInput = JSON.stringify(example, null, 2);
	}

	const placeholderText = `{
  "questions": [
    {
      "question": "...",
      "options": [
        { "text": "...", "correct": false },
        { "text": "...", "correct": true, "explanation": "..." } 
      ] 
    }
  ]
}`;

	const aiPrompt = `Act as a biology education expert. Your task is to generate a set of multiple-choice questions based on the provided notes. The questions must be formatted in a specific JSON structure so they can be directly uploaded to a quiz application.

Requirements:
1. JSON Format: You must return ONLY the raw JSON object. Do not include any introductory or concluding text.
2. Options: Each question must have exactly 4 options.
3. Correct Answer: Exactly one option per question must be marked as "correct": true.
4. Explanation: The correct option MUST include an "explanation" field describing why it is correct.
5. Question Structure:
   - id: An incrementing integer.
   - question: The text of the question.
   - options: An array of 4 objects.

JSON Schema Example:
{
  "quiz_title": "Biology Practice Quiz",
  "questions": [
    {
      "id": 1,
      "question": "Sample Question Text",
      "options": [
        { "text": "Option A", "correct": false },
        { "text": "Option B", "correct": true, "explanation": "Detailed reason why Option B is correct." },
        { "text": "Option C", "correct": false },
        { "text": "Option D", "correct": false }
      ]
    }
  ]
}

Source Material (Notes):
[PASTE YOUR NOTES HERE]

Generation Task:
Based on the notes above, please generate 20 questions in the JSON format specified.`;

	let copySuccess = $state(false);

	function copyPrompt() {
		navigator.clipboard.writeText(aiPrompt).then(() => {
			copySuccess = true;
			setTimeout(() => {
				copySuccess = false;
			}, 2000);
		});
	}
</script>

<div class="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800">
	<h2 class="text-2xl font-bold text-slate-100 mb-4">Upload Questions</h2>

	<!-- AI Generation Guide -->
	<div
		class="mb-8 p-5 bg-gradient-to-br from-indigo-950/50 to-slate-900/50 border border-indigo-500/30 rounded-xl relative overflow-hidden group"
	>
		<div
			class="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
		></div>

		<div class="relative z-10">
			<h3
				class="flex items-center gap-2 text-lg font-bold text-indigo-300 mb-3"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="w-5 h-5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><path
						d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3 3 3 0 0 1-3-3V5a3 3 0 0 1 3-3Z"
					/><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line
						x1="12"
						x2="12"
						y1="19"
						y2="22"
					/><line x1="8" x2="16" y1="22" y2="22" /></svg
				>
				Generate with AI
			</h3>

			<p class="text-slate-300 text-sm mb-4 leading-relaxed">
				We highly recommend using
				<a
					href="https://gemini.google.com"
					target="_blank"
					rel="noopener noreferrer"
					class="text-indigo-400 hover:text-indigo-300 font-semibold underline decoration-indigo-500/50 hover:decoration-indigo-300"
					>Google Gemini</a
				>
				to generate your quiz questions. It produces the most reliable JSON
				output for this app.
			</p>

			<div
				class="bg-slate-950/80 rounded-lg border border-slate-800 p-4 relative"
			>
				<div
					class="text-xs font-mono text-slate-500 mb-2 uppercase tracking-wider"
				>
					System Prompt
				</div>
				<div class="text-sm text-slate-400 line-clamp-3 font-mono mb-2">
					{aiPrompt}
				</div>
				<div
					class="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/50"
				>
					<span class="text-xs text-slate-500 italic"
						>Copy this prompt + your notes into Gemini</span
					>
					<button
						onclick={copyPrompt}
						class="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-md transition-all active:scale-95"
					>
						{#if copySuccess}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-3.5 h-3.5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								><polyline points="20 6 9 17 4 12" /></svg
							>
							Copied!
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-3.5 h-3.5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								><rect
									width="14"
									height="14"
									x="8"
									y="8"
									rx="2"
									ry="2"
								/><path
									d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
								/></svg
							>
							Copy Prompt
						{/if}
					</button>
				</div>
			</div>
		</div>
	</div>

	<div class="mb-6">
		<label
			for="json-input"
			class="block text-sm font-medium text-slate-300 mb-2"
			>Paste JSON Data</label
		>
		<textarea
			id="json-input"
			bind:value={jsonInput}
			rows="12"
			class="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg font-mono text-sm text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-slate-600"
			placeholder={placeholderText}
		></textarea>
		{#if error}
			<div
				class="mt-2 p-3 bg-red-950/50 text-red-200 text-sm rounded-lg border border-red-900/50 flex items-start gap-2"
			>
				<span class="font-bold">Error:</span>
				{error}
			</div>
		{/if}
	</div>

	<div class="flex flex-col sm:flex-row gap-4 items-end justify-between">
		<div class="w-full sm:w-1/3">
			<label
				for="timer"
				class="block text-sm font-medium text-slate-300 mb-2"
				>Timer (minutes)</label
			>
			<input
				type="number"
				id="timer"
				bind:value={timerMinutes}
				min="1"
				max="120"
				class="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
			/>
		</div>

		<div class="flex gap-3 w-full sm:w-auto">
			<button
				onclick={loadExample}
				class="px-4 py-2 text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors border border-slate-700"
			>
				Load Example
			</button>
			<button
				onclick={validateAndStart}
				class="flex-1 sm:flex-none px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-lg shadow-emerald-900/20 transition-all hover:translate-y-[-1px]"
			>
				Start Quiz
			</button>
		</div>
	</div>
</div>
