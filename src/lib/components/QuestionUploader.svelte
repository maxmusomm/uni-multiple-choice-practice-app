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
</script>

<div class="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800">
	<h2 class="text-2xl font-bold text-slate-100 mb-4">Upload Questions</h2>

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
