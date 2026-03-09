<script lang="ts">
	import { quizStore, type Question } from "$lib/stores/quizStore";

	const SUBJECTS = [
		{ id: 'biology', label: 'Biology' },
		{ id: 'physics', label: 'Physics' },
		{ id: 'chemistry', label: 'Chemistry' }
	];

	let selectedSubject: string = SUBJECTS[0].id;
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

	function copyPrompt() {
		const prompt = buildPrompt(selectedSubject);
		try {
			navigator.clipboard.writeText(prompt);
			alert('Prompt copied to clipboard');
		} catch (e) {
			console.error('Copy failed', e);
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

	function buildPrompt(subject: string) {
		let title = 'Subject';
		let roleDesc = 'an education expert';
		let extra = '';

		switch (subject) {
			case 'physics':
				title = 'Physics';
				roleDesc = 'a physics education expert and problem-solver';
				extra = 'Focus on clear definitions, units, and (where appropriate) concise numerical examples. Prefer conceptual questions with one correct answer and include any necessary units in explanations.';
				break;
			case 'chemistry':
				title = 'Chemistry';
				roleDesc = 'a chemistry education expert';
				extra = 'Include relevant chemical names, formulas, and safety/context notes when appropriate. Explanations should reference underlying chemical principles.';
				break;
			default:
				title = 'Biology';
				roleDesc = 'a biology education expert';
				extra = 'Emphasize biological concepts, concise definitions, and real-world examples in explanations.';
		}

		return `Act as ${roleDesc} for ${title}. ${extra}\n\nYour task: generate a set of multiple-choice questions based on the provided notes. Return ONLY the raw JSON object (no markdown, commentary, or surrounding text) in the exact format required by the quiz application. Each question must have exactly 4 options; exactly one option must be marked \"correct\": true. The correct option MUST include an \"explanation\" field describing why it is correct.\n\nJSON Schema:\n{\n  "quiz_title": "${title} Practice Quiz",\n  "questions": [\n    {\n      "id": 1,\n      "question": "...",\n      "options": [\n        { "text": "...", "correct": false },\n        { "text": "...", "correct": true, "explanation": "..." },\n        { "text": "...", "correct": false },\n        { "text": "...", "correct": false }\n      ]\n    }\n  ]\n}\n\nPlease generate the requested number of questions based on the notes I provide.`;
	}

	const placeholderText = `{
  "questions": [
    {
      "question": "...",
      "options": [
        { "text": "...", "correct": false },
        { "text": "...", "correct": true, "explanation": "..." },
        { "text": "...", "correct": false },
        { "text": "...", "correct": false }
      ]
    }
  ]}`;
</script>

<div class="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800">
	<h2 class="text-2xl font-bold text-slate-100 mb-4">Upload Questions</h2>

	<div class="mb-6">
		<label for="subject" class="block text-sm font-medium text-slate-300 mb-2">Subject</label>
		<select id="subject" bind:value={selectedSubject} class="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 mb-4">
			{#each SUBJECTS as s}
				<option value={s.id}>{s.label}</option>
			{/each}
		</select>

		<label class="block text-sm font-medium text-slate-300 mb-2">Prompt for LLM (preview)</label>
		<div class="relative mb-4">
			<textarea readonly rows="6" class="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg font-mono text-sm text-slate-100 resize-none">{buildPrompt(selectedSubject)}</textarea>
			<button on:click={copyPrompt} class="absolute right-2 top-2 px-3 py-1 bg-emerald-600 text-white rounded">Copy Prompt</button>
		</div>

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
				on:click={loadExample}
				class="px-4 py-2 text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors border border-slate-700"
			>
				Load Example
			</button>
			<button
				on:click={validateAndStart}
				class="flex-1 sm:flex-none px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-lg shadow-emerald-900/20 transition-all hover:translate-y-[-1px]"
			>
				Start Quiz
			</button>
		</div>
	</div>
</div>
