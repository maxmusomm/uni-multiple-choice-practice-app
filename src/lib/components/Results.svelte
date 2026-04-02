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

	let activeFilter = $state<'all' | 'incorrect'>('incorrect');

	let reviewItems = $derived(
		answers.map((a, index) => {
			const q = questions.find((q) => q.id === a.questionId);
			return { answer: a, question: q, index: index + 1 };
		}).filter((x) => x.question !== undefined) as { answer: any, question: Question, index: number }[]
	);

	let filteredItems = $derived(
		reviewItems.filter(item => {
			if (activeFilter === 'incorrect') return !item.answer.isCorrect;
			return true;
		})
	);
</script>

<div class="space-y-12">
	<!-- Hero Score Section -->
	<section class="py-12 flex flex-col items-center text-center">
		<span class="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-3">Assessment Concluded</span>
		<h2 class="font-headline text-5xl italic mb-6">Quiz Complete</h2>
		<div class="relative inline-flex items-center justify-center p-10">
			<!-- Decorative Circle -->
			<div class="absolute inset-0 border border-outline-variant/20 rounded-full"></div>
			<div class="absolute inset-2 border border-primary/10 rounded-full"></div>
			<div class="relative">
				<span class="font-headline text-7xl text-primary leading-none">{percentage}<span class="text-3xl align-top mt-2 inline-block">%</span></span>
			</div>
		</div>
	</section>

	<!-- Summary Statistics Grid -->
	<section class="grid grid-cols-2 gap-3 mb-12">
		<div class="bg-surface-container-low p-5 rounded-xl flex flex-col justify-between aspect-square border border-outline-variant/10">
			<span class="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Correct</span>
			<div>
				<div class="text-2xl font-headline mb-1">{correct}<span class="text-on-surface-variant text-sm font-body">/{totalQuestions}</span></div>
				<div class="h-1 w-full bg-surface-variant rounded-full overflow-hidden">
					<div class="h-full bg-primary" style="width: {percentage}%"></div>
				</div>
			</div>
		</div>
		<div class="bg-surface-container-low p-5 rounded-xl flex flex-col justify-between aspect-square border border-outline-variant/10">
			<span class="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Score</span>
			<div>
				<div class="text-2xl font-headline mb-1">{score}</div>
				<div class="font-label text-[10px] text-primary">Points Total</div>
			</div>
		</div>
		<div class="bg-surface-container-low p-5 rounded-xl flex flex-col justify-between border-l-2 border-error/50">
			<span class="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Wrong</span>
			<div class="text-2xl font-headline text-error">{incorrect}</div>
		</div>
		<div class="bg-surface-container-low p-5 rounded-xl flex flex-col justify-between border-l-2 border-surface-variant">
			<span class="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Skipped</span>
			<div class="text-2xl font-headline text-on-surface-variant">{skipped}</div>
		</div>
	</section>

	<!-- Review Insights Header & Filters -->
	{#if reviewItems.length > 0}
		<section class="mb-4">
			<div class="flex justify-between items-end mb-6">
				<h3 class="font-headline text-2xl italic">Review Insights</h3>
				<span class="font-label text-[10px] uppercase text-primary border-b border-primary/30 pb-0.5">Analysis Mode</span>
			</div>
			<div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
				<button onclick={() => activeFilter = 'all'} class="px-5 py-2 {activeFilter === 'all' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'} rounded-full font-label text-xs font-medium transition-colors">All</button>
				<button onclick={() => activeFilter = 'incorrect'} class="px-5 py-2 {activeFilter === 'incorrect' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'} rounded-full font-label text-xs font-medium transition-colors">Incorrect/Skipped</button>
			</div>
		</section>

		<!-- Review Items List -->
		<section class="space-y-6">
			{#each filteredItems as item (item.question.id)}
				<div class="bg-surface-container rounded-xl overflow-hidden border border-outline-variant/10">
					<div class="p-6">
						<div class="flex justify-between items-start mb-4">
							<span class="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Question {item.index}</span>
							<div class="flex gap-2">
								{#if item.answer.isCorrect}
									<span class="material-symbols-outlined text-primary text-lg" style="font-variation-settings: 'FILL' 1;">check_circle</span>
								{:else if item.answer.skipped}
									<span class="material-symbols-outlined text-on-surface-variant text-lg">horizontal_rule</span>
								{:else}
									<span class="material-symbols-outlined text-error text-lg">cancel</span>
								{/if}
							</div>
						</div>
						<h4 class="font-headline text-lg mb-6 leading-relaxed">{item.question.question}</h4>
						
						<div class="space-y-4 mb-8">
							<!-- Correct Answer -->
							<div class="relative pl-4 border-l border-primary/50">
								<span class="font-label text-[10px] uppercase text-primary/80 block mb-1">Correct Answer</span>
								<p class="font-body text-on-surface">{item.question.options.find((o) => o.correct)?.text || 'N/A'}</p>
							</div>
						</div>
						
						<!-- Editorial Context -->
						{#if item.question.options.find((o) => o.correct)?.explanation}
							<div class="bg-surface-container-low rounded-lg p-5 border border-outline-variant/10 mt-6">
								<div class="flex items-center gap-2 mb-3">
									<span class="material-symbols-outlined text-primary text-sm" data-icon="auto_stories">auto_stories</span>
									<span class="font-headline italic text-sm">Editorial Context</span>
								</div>
								<p class="font-body text-sm text-on-surface-variant leading-relaxed">
									{item.question.options.find((o) => o.correct)?.explanation}
								</p>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</section>
	{/if}

	<!-- CTA Section -->
	<section class="mt-12 flex flex-col items-center gap-6 text-center border-t border-outline-variant/10 pt-12 pb-8">
		<div>
			<h3 class="font-headline text-2xl mb-2">Ready for the next chapter?</h3>
			<p class="text-on-surface-variant font-body text-sm">Continue your momentum with a new session.</p>
		</div>
		<div class="flex flex-col sm:flex-row gap-4 w-full">
			<button onclick={restart} class="w-full sm:flex-1 py-4 bg-gradient-to-b from-primary to-primary-dim text-on-primary rounded-xl font-bold font-body shadow-lg shadow-primary/10 hover:brightness-110 active:scale-95 duration-200 transition-all">
				Start New Quiz
			</button>
		</div>
	</section>
</div>
