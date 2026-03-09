<script lang="ts">
	import { quizStore } from "$lib/stores/quizStore";
	import type { Question } from "$lib/stores/quizStore";
	import confetti from "canvas-confetti";
	import { onMount } from "svelte";

	let { score, questions, answers } = $quizStore;

	const totalQuestions = questions.length;
	const correct = answers.filter((a) => a.isCorrect).length;
	const incorrect = answers.filter((a) => !a.isCorrect && !a.skipped).length;
	const skipped = answers.filter((a) => a.skipped).length;

	// Calculate percentage
	const percentage =
		totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;

	onMount(() => {
		if (percentage >= 70) {
			confetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 },
			});
		}
	});

	function restart() {
		quizStore.reset();
	}

	// UI state for dropdowns
	let showCorrect = false;
	let showIncorrect = true;

	// Build lists for the dropdowns (type-safe: ensure question objects are present)
	$: correctList = answers
		.filter((a) => a.isCorrect)
		.map((a) => questions.find((q) => q.id === a.questionId))
		.filter((q): q is Question => !!q)
		.map((q) => ({ question: q }));

	$: incorrectList = answers
		.filter((a) => !a.isCorrect)
		.map((a) => {
			const q = questions.find((q) => q.id === a.questionId);
			return q ? { question: q, skipped: a.skipped } : null;
		})
		.filter((x): x is { question: Question; skipped: boolean } => x !== null);

</script>

<div
	class="bg-slate-900 p-8 rounded-xl shadow-lg border border-slate-800 text-center max-w-2xl mx-auto"
>
	<h2 class="text-3xl font-bold text-slate-100 mb-2">Quiz Complete!</h2>
	<p class="text-slate-400 mb-8">Here's how you did</p>

	<div class="mb-10">
		<div class="text-6xl font-black text-emerald-500 mb-2">{score}</div>
		<p class="text-slate-500 uppercase tracking-widest text-xs font-bold">
			Total Score
		</p>
	</div>

	<div class="grid grid-cols-3 gap-4 mb-10">
		<div
			class="p-4 bg-emerald-950/30 rounded-lg border border-emerald-900/50"
		>
			<div class="text-2xl font-bold text-emerald-400">{correct}</div>
			<div class="text-xs text-emerald-500 font-medium uppercase mt-1">
				Correct (+1)
			</div>
		</div>
		<div class="p-4 bg-red-950/30 rounded-lg border border-red-900/50">
			<div class="text-2xl font-bold text-red-400">{incorrect}</div>
			<div class="text-xs text-red-500 font-medium uppercase mt-1">
				Wrong (-1)
			</div>
		</div>
		<div class="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
			<div class="text-2xl font-bold text-slate-300">{skipped}</div>
			<div class="text-xs text-slate-500 font-medium uppercase mt-1">
				Skipped (0)
			</div>
		</div>
	</div>

	{#if incorrect + skipped > 0 || correct > 0}
		<div class="mt-8 mb-8 text-left">
			<h3 class="text-xl font-bold text-slate-100 mb-4">Review Answers</h3>

			<div class="flex flex-col md:flex-row gap-4">
				<!-- Incorrect / Skipped Panel -->
				<div class="w-full md:w-1/2">
					<button
						onclick={() => (showIncorrect = !showIncorrect)}
						class="w-full flex justify-between items-center px-4 py-3 bg-red-900/10 rounded-lg border border-red-900/20"
					>
						<div class="text-left">
							<div class="text-sm font-bold text-red-400">Incorrect / Skipped</div>
							<div class="text-xs text-slate-400">{incorrect + skipped} items</div>
						</div>
						<svg class="w-5 h-5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
					</button>

					{#if showIncorrect}
						<div class="mt-3 space-y-3">
							{#each incorrectList as item}
								<div class="p-4 bg-slate-800/40 rounded-lg border border-slate-700/50">
									<div class="flex justify-between items-start mb-2">
										<p class="text-slate-100 font-medium">{item.question.question}</p>
										<span class="text-xs font-bold px-2 py-1 rounded {item.skipped ? 'bg-slate-700 text-slate-300' : 'bg-red-900/30 text-red-400 border border-red-900/50'}">{item.skipped ? 'SKIPPED' : 'INCORRECT'}</span>
									</div>
									{#each item.question.options as option}
										{#if option.correct}
											{#if option.explanation}
												<div class="text-emerald-400 text-sm bg-emerald-950/10 p-3 rounded border border-emerald-900/20">
													<div class="font-semibold text-xs uppercase tracking-wider opacity-80 mb-1">Correct answer</div>
													<div class="font-bold">{option.text}</div>
													<p class="mt-2 text-emerald-300">{option.explanation}</p>
												</div>
											{/if}
										{/if}
									{/each}
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Correct Panel -->
				<div class="w-full md:w-1/2">
					<button
						onclick={() => (showCorrect = !showCorrect)}
						class="w-full flex justify-between items-center px-4 py-3 bg-emerald-900/10 rounded-lg border border-emerald-900/20"
					>
						<div class="text-left">
							<div class="text-sm font-bold text-emerald-400">Correct Answers</div>
							<div class="text-xs text-slate-400">{correct} items</div>
						</div>
						<svg class="w-5 h-5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
					</button>

					{#if showCorrect}
						<div class="mt-3 space-y-3">
							{#each correctList as item}
								<div class="p-4 bg-slate-800/40 rounded-lg border border-slate-700/50">
									<p class="text-slate-100 font-medium mb-2">{item.question.question}</p>
									{#each item.question.options as option}
										{#if option.correct}
											{#if option.explanation}
												<div class="text-emerald-300 text-sm bg-emerald-950/10 p-3 rounded border border-emerald-900/20">
													<div class="font-bold">{option.text}</div>
													<p class="mt-2">{option.explanation}</p>
												</div>
											{/if}
										{/if}
									{/each}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<div class="space-y-4">
		<button
			onclick={restart}
			class="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-lg shadow-emerald-900/20 transition-all hover:translate-y-[-1px]"
		>
			Start New Quiz
		</button>
	</div>
</div>
