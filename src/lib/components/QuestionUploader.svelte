<script lang="ts">
	import { quizStore, type Question } from "$lib/stores/quizStore";

	const SUBJECTS = [
		{ id: 'biology', label: 'Biology' },
		{ id: 'physics', label: 'Physics' },
		{ id: 'chemistry', label: 'Chemistry' }
	];

	let selectedSubject = $state(SUBJECTS[0].id);
	let jsonInput = $state("");
	let timerMinutes = $state(10);
	let error = $state<string | null>(null);

	function buildPrompt(subject: string) {
		const title = subject === 'biology' ? 'Biology' : subject === 'physics' ? 'Physics' : 'Chemistry';
		
		let spec = '';
		if (subject === 'physics') {
			spec = 'Act as a physics education expert for Physics. Include relevant physical quantities, equations, and units/context notes when appropriate. Explanations should reference underlying physical principles.';
		} else if (subject === 'chemistry') {
			spec = 'Act as a chemistry education expert for Chemistry. Include relevant chemical names, formulas, and safety/context notes when appropriate. Explanations should reference underlying chemical principles.';
		} else {
			spec = `Act as a ${title} education expert.`;
		}

		const exampleJson = {
			quiz_title: `${title} Practice Quiz`,
			questions: [
				{
				  id: 1,
				  question_type: ["text"],
				  answer_type: "text",
				  question: "What is the powerhouse of the cell?",
				  options: [
					{ text: "Nucleus", correct: false },
					{ text: "Mitochondria", correct: true, explanation: "Mitochondria produce ATP." },
					{ text: "Ribosome", correct: false },
					{ text: "Endoplasmic Reticulum", correct: false }
				  ]
				},
				{
				  id: 2,
				  question_type: [
					"image",
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="white" stroke-width="4" fill="transparent"/><text x="50" y="55" fill="white" font-size="20" text-anchor="middle">A</text></svg>'
				  ],
				  answer_type: "text",
				  question: "What shape is depicted in the diagram?",
				  options: [
					{ text: "Square", correct: false },
					{ text: "Circle", correct: true, explanation: "The SVG explicitly draws a circle element." },
					{ text: "Triangle", correct: false },
					{ text: "Rectangle", correct: false }
				  ]
				},
				{
				  id: 3,
				  question_type: ["text"],
				  answer_type: "image",
				  question: "Which of the following shapes represents a triangle?",
				  options: [
					{ text: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="white" stroke-width="4" fill="none"/></svg>', correct: false },
					{ text: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="25" y="25" width="50" height="50" stroke="white" stroke-width="4" fill="none"/></svg>', correct: false },
					{ text: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,15 90,85 10,85" stroke="white" stroke-width="4" fill="none"/></svg>', correct: true, explanation: "A polygon with three explicit points constructs a triangle." },
					{ text: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="10" y="40" width="80" height="20" stroke="white" stroke-width="4" fill="none"/></svg>', correct: false }
				  ]
				},
				{
				  id: 4,
				  question_type: [
					"image",
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60" stroke="white" stroke-width="4" fill="none"/><text x="50" y="55" fill="white" font-size="20" text-anchor="middle">?</text></svg>'
				  ],
				  answer_type: "image",
				  question: "Which of the following options is identical to the target shape above?",
				  options: [
					{ text: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" stroke="white" stroke-width="4" fill="none"/></svg>', correct: false },
					{ text: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60" stroke="white" stroke-width="4" fill="none"/></svg>', correct: true, explanation: "Both the target and this option draw a rectangle of the same dimensions." },
					{ text: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,20 80,80 20,80" stroke="white" stroke-width="4" fill="none"/></svg>', correct: false },
					{ text: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><line x1="20" y1="20" x2="80" y2="80" stroke="white" stroke-width="4"/></svg>', correct: false }
				  ]
				}
			]
		};

		return `${spec} Your task is to generate a set of multiple-choice questions based on the provided notes. Return ONLY the raw JSON object in the exact format required by the quiz application. Each question must have exactly 4 options; exactly one option must be marked as "correct": true. The correct option MUST include an "explanation" field describing why it is correct.

CRITICAL FORMATTING RULES:
- Do NOT wrap the JSON output in markdown code blocks like \`\`\`json ... \`\`\`. The response should begin with { and end with } and contain ONLY the JSON.
- Do NOT escape underscores in JSON keys (use "question_type", NOT "question\\_type").
- Do NOT escape angle brackets in SVG code (use "<svg>", NOT "\\<svg\\>").
- Do NOT include markdown code blocks, formatting, or markdown links like [url](url) anywhere inside the JSON output strings.
- Do NOT format URLs as markdown hyperlinks (must use "http://...", not "[http://...](http://...)").

JSON Schema:
${JSON.stringify(exampleJson, null, 2)}

Please generate the requested number of questions based on the notes I provide.`;
	}

				async function copyPrompt() {
					const prompt = buildPrompt(selectedSubject);
					try {
						await navigator.clipboard.writeText(prompt);
						alert('Prompt copied to clipboard');
					} catch (e) {
						console.error('Copy failed', e);
						alert('Failed to copy prompt to clipboard. Please copy it manually from the text area.');
					}
				}

				function cleanJsonString(raw: string) {
					let cleaned = raw;
					cleaned = cleaned.replace(/```json/gi, '');
					cleaned = cleaned.replace(/```/g, '');
					cleaned = cleaned.replace(/\\_/g, '_');
					cleaned = cleaned.replace(/\\</g, '<');
					cleaned = cleaned.replace(/\\>/g, '>');
					cleaned = cleaned.replace(/\[(https?:\/\/[^\]]+)\]\((https?:\/\/[^)]+)\)/g, '$2');
					cleaned = cleaned.replace(/\[cite_start\]/g, '');
					cleaned = cleaned.replace(/\[cite:[^\]]*\]/g, '');
					return cleaned.trim();
				}

				function validateAndStart() {
					error = null;
					try {
						if (!jsonInput || !jsonInput.trim()) {
							throw new Error('Please enter JSON content');
						}

						const cleanedInput = cleanJsonString(jsonInput);
						const parsed = JSON.parse(cleanedInput);

						if (!parsed.questions || !Array.isArray(parsed.questions)) {
							throw new Error('JSON must contain a "questions" array');
						}

						if (parsed.questions.length === 0) {
							throw new Error('Questions array cannot be empty');
						}

						const validQuestions: Question[] = parsed.questions.map((q: any, i: number) => {
							if (!q.question || typeof q.question !== 'string') {
								throw new Error(`Question ${i + 1} is missing "question" text`);
							}
							if (!q.options || !Array.isArray(q.options) || q.options.length !== 4) {
								throw new Error(`Question ${i + 1} must have exactly 4 options`);
							}
							return {
								id: q.id || i + 1,
								question_type: q.question_type || ["text"],
								answer_type: q.answer_type || "text",
								question: q.question,
								options: q.options.map((o: any) => ({ text: o.text || '', correct: !!o.correct, explanation: o.explanation }))
							};
						});

						quizStore.startQuiz(validQuestions, Number(timerMinutes) * 60);
					} catch (e) {
						if (e instanceof Error) error = e.message;
						else error = 'Invalid JSON format';
					}
				}

				function loadExample() {
					const example = {
						quiz_title: 'Biology Example',
						questions: [
							{
								id: 1,
								question_type: ["text"],
								answer_type: "text",
								question: 'What is the powerhouse of the cell?',
								options: [
									{ text: 'Nucleus', correct: false },
									{ text: 'Mitochondria', correct: true, explanation: "Mitochondria generate most of the cell's ATP via oxidative phosphorylation." },
									{ text: 'Ribosome', correct: false },
									{ text: 'Golgi apparatus', correct: false }
								]
							}
						]
					};
					jsonInput = JSON.stringify(example, null, 2);
				}

				const placeholderText = JSON.stringify({
					questions: [
						{
							question_type: ["text"],
							answer_type: "text",
							question: "...",
							options: [
								{ text: "...", correct: false },
								{ text: "...", correct: true, explanation: "..." },
								{ text: "...", correct: false },
								{ text: "...", correct: false }
							]
						}
					]
				}, null, 2);
			</script>

			<div class="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800">
				<h2 class="text-2xl font-bold text-slate-100 mb-4">Upload Questions</h2>

				<div class="mb-4">
					<label for="subject" class="block text-sm font-medium text-slate-300 mb-2">Subject</label>
					<select id="subject" bind:value={selectedSubject} class="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 mb-4">
						{#each SUBJECTS as s}
							<option value={s.id}>{s.label}</option>
						{/each}
					</select>

					<label for="prompt-preview" class="block text-sm font-medium text-slate-300 mb-2">Prompt for LLM (preview)</label>
					<div class="relative mb-4">
						<textarea id="prompt-preview" readonly rows="6" class="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg font-mono text-sm text-slate-100 resize-none">{buildPrompt(selectedSubject)}</textarea>
						<button onclick={copyPrompt} class="absolute right-2 top-2 px-3 py-1 bg-emerald-600 text-white rounded">Copy Prompt</button>
					</div>
				</div>

				<div class="mb-6">
					<label for="json-input" class="block text-sm font-medium text-slate-300 mb-2">Paste JSON Data</label>
					<textarea id="json-input" bind:value={jsonInput} rows="12" class="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg font-mono text-sm text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-slate-600" placeholder={placeholderText}></textarea>
					{#if error}
						<div class="mt-2 p-3 bg-red-950/50 text-red-200 text-sm rounded-lg border border-red-900/50 flex items-start gap-2">
							<span class="font-bold">Error:</span>
							{error}
						</div>
					{/if}
				</div>

				<div class="flex flex-col sm:flex-row gap-4 items-end justify-between">
					<div class="w-full sm:w-1/3">
						<label for="timer" class="block text-sm font-medium text-slate-300 mb-2">Timer (minutes)</label>
						<input type="number" id="timer" bind:value={timerMinutes} min="1" max="120" class="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
					</div>

					<div class="flex gap-3 w-full sm:w-auto">
						<button onclick={loadExample} class="px-4 py-2 text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors border border-slate-700">Load Example</button>
						<button onclick={validateAndStart} class="flex-1 sm:flex-none px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-lg shadow-emerald-900/20 transition-all hover:translate-y-[-1px]">Start Quiz</button>
					</div>
				</div>
			</div>
