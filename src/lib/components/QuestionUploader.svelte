<script lang="ts">
	import { quizStore, type Question } from '$lib/stores/quizStore';

	let jsonInput = $state('');
	let timerMinutes = $state(10);
	let error = $state<string | null>(null);

	function validateAndStart() {
		error = null;
		try {
			if (!jsonInput.trim()) {
				throw new Error('Please enter JSON content');
			}

			const parsed = JSON.parse(jsonInput);

			// Basic validation
			if (!parsed.questions || !Array.isArray(parsed.questions)) {
				throw new Error('JSON must contain a "questions" array');
			}

			if (parsed.questions.length === 0) {
				throw new Error('Questions array cannot be empty');
			}

			// Validate each question structure
			const validQuestions: Question[] = parsed.questions.map((q: any, i: number) => {
				if (!q.question || typeof q.question !== 'string') {
					throw new Error(`Question ${i + 1} is missing "question" text`);
				}
				if (!q.options || !Array.isArray(q.options) || q.options.length !== 4) {
					throw new Error(`Question ${i + 1} must have exactly 4 options`);
				}
				return {
					id: q.id || i + 1,
					question: q.question,
					options: q.options.map((o: any) => ({
						text: o.text || '',
						correct: !!o.correct
					}))
				};
			});

			// Start quiz
			quizStore.startQuiz(validQuestions, timerMinutes * 60);

		} catch (e) {
			if (e instanceof Error) {
				error = e.message;
			} else {
				error = 'Invalid JSON format';
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
						{ text: "Mitochondria", correct: true },
						{ text: "Ribosome", correct: false },
						{ text: "Golgi apparatus", correct: false }
					]
				}
			]
		};
		jsonInput = JSON.stringify(example, null, 2);
	}

	const placeholderText = `{
  "questions": [
    {
      "question": "...",
      "options": [...] 
    }
  ]
}`;
</script>

<div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
	<h2 class="text-2xl font-bold text-slate-800 mb-4">Upload Questions</h2>
	
	<div class="mb-6">
		<label for="json-input" class="block text-sm font-medium text-slate-700 mb-2">Paste JSON Data</label>
		<textarea
			id="json-input"
			bind:value={jsonInput}
			rows="12"
			class="w-full p-3 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
			placeholder={placeholderText}
		></textarea>
		{#if error}
			<div class="mt-2 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-start gap-2">
				<span class="font-bold">Error:</span> {error}
			</div>
		{/if}
	</div>

	<div class="flex flex-col sm:flex-row gap-4 items-end justify-between">
		<div class="w-full sm:w-1/3">
			<label for="timer" class="block text-sm font-medium text-slate-700 mb-2">Timer (minutes)</label>
			<input
				type="number"
				id="timer"
				bind:value={timerMinutes}
				min="1"
				max="120"
				class="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
			/>
		</div>

		<div class="flex gap-3 w-full sm:w-auto">
			<button
				onclick={loadExample}
				class="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
			>
				Load Example
			</button>
			<button
				onclick={validateAndStart}
				class="flex-1 sm:flex-none px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-md shadow-emerald-200 transition-all hover:translate-y-[-1px]"
			>
				Start Quiz
			</button>
		</div>
	</div>
</div>
