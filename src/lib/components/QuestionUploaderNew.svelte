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

	function cleanJsonString(raw: string) {
		let cleaned = raw;
		
		// Remove markdown JSON code blocks
		cleaned = cleaned.replace(/```json/gi, '');
		cleaned = cleaned.replace(/```/g, '');
		
		// Fix escaped underscores which break JSON keys (e.g., question\_type)
		cleaned = cleaned.replace(/\\_/g, '_');
		
		// Fix escaped angle brackets in SVGs (e.g., \<svg\>)
		cleaned = cleaned.replace(/\\</g, '<');
		cleaned = cleaned.replace(/\\>/g, '>');

		// Fix LLM converting URLs to markdown links inside SVG xmlns strings
		cleaned = cleaned.replace(/\[(https?:\/\/[^\]]+)\]\((https?:\/\/[^)]+)\)/g, '$2');
		
		// Strip out rogue citation tags LLMs add dynamically (e.g., [cite_start], [cite: 448])
		cleaned = cleaned.replace(/\[cite_start\]/g, '');
		cleaned = cleaned.replace(/\[cite:[^\]]*\]/g, '');

		// Trim whitespace
		return cleaned.trim();
	}

	function validateAndStart() {
		error = null;
		try {
			if (!jsonInput.trim()) {
				throw new Error("Please enter JSON content");
			}

			const cleanedInput = cleanJsonString(jsonInput);
			const parsed = JSON.parse(cleanedInput);

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
						question_type: q.question_type || ["text"],
						answer_type: q.answer_type || "text",
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

		switch (subject) {
			case 'physics':
				title = 'Physics';
				break;
			case 'chemistry':
				title = 'Chemistry';
				break;
			default:
				title = 'Biology';
		}

		return `Act as a ${title} education expert. Your task is to generate a set of multiple-choice questions based on the provided notes. Return ONLY the raw JSON object in the exact format required by the quiz application. Each question must have exactly 4 options; exactly one option must be marked as "correct": true. The correct option MUST include an "explanation" field describing why it is correct. The "explanation" must always be written in text, even when answer_type is "image".

CRITICAL JSON FORMATTING RULES:
- Do NOT wrap the JSON output in markdown code blocks like \`\`\`json ... \`\`\`. The response should begin with { and end with } and contain ONLY the JSON.
- Do NOT escape underscores in JSON keys (must use "question_type", not "question\\_type").
- Do NOT escape angle brackets in SVG code (must use "<svg>", not "\\<svg\\>").
- Do NOT include markdown code blocks, formatting, or citation tags (like [cite_start] or [cite: ...]) anywhere in the JSON output.
- Do NOT format URLs as markdown hyperlinks (must use "http://...", not "[http://...](http://...)").

JSON Schema:
{
  "quiz_title": "${title} Practice Quiz",
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

Please generate the requested number of questions based on the notes I provide.`;
	}

	const placeholderText = `{
  "questions": [
    {
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
  ]}`;
</script>

<!-- Heading -->
<section class="mb-10">
	<h1 class="font-headline text-4xl text-on-surface mb-2 leading-tight">Build Your Session</h1>
	<p class="font-body text-on-surface-variant text-sm">Configure your study material and parameters to generate a custom AI practice quiz.</p>
</section>

<!-- Form Configuration -->
<div class="space-y-8">
	<div class="grid grid-cols-1 gap-6">
		<!-- Subject Area -->
		<div class="space-y-2">
			<label for="subject" class="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Subject Area</label>
			<div class="relative">
				<select id="subject" bind:value={selectedSubject} class="w-full bg-surface-container appearance-none px-4 py-3 rounded-lg font-body focus:ring-1 focus:ring-primary/20 border-none outline-none text-on-surface">
					{#each SUBJECTS as s}
						<option value={s.id}>{s.label}</option>
					{/each}
				</select>
				<span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
			</div>
		</div>

		<!-- Timer Option -->
		<div class="space-y-2">
			<label for="timer" class="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Timer (Minutes)</label>
			<div class="bg-surface-container-low px-4 py-3 rounded-lg flex items-center justify-between focus-within:ring-1 focus-within:ring-primary/20">
				<div class="flex items-center gap-2 w-full">
					<span class="material-symbols-outlined text-outline text-xl">timer</span>
					<input id="timer" type="number" bind:value={timerMinutes} min="1" max="120" class="bg-transparent border-none p-0 text-on-surface font-body font-medium focus:ring-0 w-full outline-none" />
				</div>
			</div>
		</div>
	</div>



	<!-- LLM Preview -->
	<div class="bg-surface-container rounded-xl p-5 space-y-4">
		<div class="flex justify-between items-center">
			<label for="prompt" class="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Prompt for LLM (Preview)</label>
			<button onclick={copyPrompt} class="flex items-center gap-1.5 text-primary text-[10px] font-bold uppercase tracking-wider hover:text-on-surface transition-colors">
				<span class="material-symbols-outlined text-sm">content_copy</span>
				Copy Prompt
			</button>
		</div>
		<div class="bg-surface-container-lowest rounded-lg p-4 border border-outline-variant/10">
			<textarea id="prompt" readonly class="w-full bg-transparent border-none text-[11px] text-on-surface-variant leading-relaxed font-mono custom-scrollbar resize-none focus:ring-0 p-0" rows="5">{buildPrompt(selectedSubject)}</textarea>
		</div>
	</div>

	<!-- JSON Data Section -->
	<div class="space-y-2">
		<label for="jsonInputData" class="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Paste JSON Data</label>
		<div class="relative group">
			<textarea id="jsonInputData" bind:value={jsonInput} placeholder={placeholderText} class="w-full h-24 bg-surface-container-lowest border border-outline-variant/10 rounded-lg p-3 font-mono text-[10px] text-primary/70 focus:outline-none focus:ring-1 focus:ring-primary/30 overflow-y-auto custom-scrollbar resize-none"></textarea>
		</div>
		{#if error}
			<div class="mt-2 p-3 bg-error-container text-on-error-container text-xs rounded-lg flex items-start gap-2">
				<span class="material-symbols-outlined text-sm">error</span>
				{error}
			</div>
		{/if}
	</div>

	<!-- Footer Action Area -->
	<div class="pt-4 space-y-6">
		<div class="flex items-center justify-between">
			<!-- Status -->
			<div class="flex items-center gap-3">
				<span class="relative flex h-2 w-2">
					<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
					<span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
				</span>
				<span class="font-label text-[11px] font-medium text-on-surface tracking-wide">System Ready</span>
			</div>
			<!-- Load Example Button -->
			<button onclick={loadExample} class="font-label text-[10px] uppercase tracking-widest text-primary hover:text-on-surface transition-colors font-semibold ring-1 ring-primary/20 px-3 py-1.5 rounded-full">
				Load Example
			</button>
		</div>

		<!-- CTA -->
		<button onclick={validateAndStart} class="w-full bg-gradient-to-b from-primary to-primary-dim text-on-primary font-body font-semibold py-4 rounded-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2">
			Start Practice Session
			<span class="material-symbols-outlined text-xl">play_arrow</span>
		</button>
	</div>
</div>
