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

	let expandedItems = $state<Record<number, boolean>>({});

	function toggleExpand(id: number) {
		expandedItems[id] = !expandedItems[id];
	}
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
		<section class="space-y-4">
			{#each filteredItems as item (item.question.id)}
				<div class="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/10 {item.answer.isCorrect ? 'opacity-70 group hover:opacity-100 transition-opacity' : ''}">
					<button onclick={() => toggleExpand(item.question.id)} class="w-full flex items-center justify-between p-6 hover:bg-surface-container transition-colors text-left group/btn">
						<div class="flex items-center gap-6">
							{#if item.answer.isCorrect}
								<span class="material-symbols-outlined text-primary text-xl" style="font-variation-settings: 'FILL' 1;">check_circle</span>
							{:else if item.answer.skipped}
								<span class="material-symbols-outlined text-on-surface-variant text-xl">horizontal_rule</span>
							{:else}
								<span class="material-symbols-outlined text-error text-xl">cancel</span>
							{/if}
							<div>
								<p class="text-sm font-label text-on-surface-variant mb-1">Question {item.index}</p>
								<h4 class="font-body font-medium text-on-surface line-clamp-2">{item.question.question}</h4>
							</div>
						</div>
						<span class="material-symbols-outlined text-on-surface-variant group-hover/btn:text-on-surface transition-colors flex-shrink-0 ml-4">
							{expandedItems[item.question.id] ? 'expand_less' : 'expand_more'}
						</span>
					</button>

					{#if expandedItems[item.question.id]}
						<div class="px-6 md:px-20 pb-8 pt-2 bg-surface-container-low border-t border-outline-variant/5">
							{#if item.question.question_type && item.question.question_type[0] === 'image'}
								<div class="mb-6 aspect-square max-w-sm mx-auto flex items-center justify-center p-4 bg-surface-container border border-outline-variant/10 rounded-xl [&>svg]:w-full [&>svg]:max-h-full">
									{@html item.question.question_type[1]}
								</div>
							{/if}
							
							<div class="space-y-4">
								<div class="relative pl-4 border-l border-primary/50">
									<span class="font-label text-[10px] uppercase text-primary/80 block mb-1">Correct Answer</span>
									<div class="font-body text-on-surface">
										{#if item.question.answer_type === 'image'}
											<div class="w-24 h-24 [&>svg]:w-full [&>svg]:max-h-full p-2 bg-surface-container rounded-lg border border-outline-variant/10 flex items-center justify-center mt-2">
												{@html item.question.options.find((o) => o.correct)?.text || ''}
											</div>
										{:else}
											<div class="text-sm text-on-surface bg-surface-container/50 p-4 rounded-lg border border-outline-variant/5 mt-2 leading-relaxed">{item.question.options.find((o) => o.correct)?.text || 'N/A'}</div>
										{/if}
									</div>
								</div>
							</div>
							
							{#if item.question.options.find((o) => o.correct)?.explanation}
								<div class="bg-surface-container rounded-lg p-5 border border-outline-variant/10 mt-6 md:mt-8">
									<div class="flex items-center gap-2 mb-3">
										<span class="material-symbols-outlined text-primary text-sm" data-icon="auto_stories">auto_stories</span>
										<span class="font-headline italic text-sm text-primary">Editorial Context</span>
									</div>
									<p class="font-body text-sm text-on-surface-variant leading-relaxed">
										{item.question.options.find((o) => o.correct)?.explanation}
									</p>
								</div>
							{/if}
						</div>
					{/if}
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
