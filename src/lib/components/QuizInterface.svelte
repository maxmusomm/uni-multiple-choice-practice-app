<script lang="ts">
	import { quizStore } from '$lib/stores/quizStore';
	import { onMount, onDestroy } from 'svelte';
	
	let { questions, currentQuestionIndex, timer, score, isActive } = $quizStore;

	// Subscribe to store changes to keep local reactive variables in sync
	// Actually, in Svelte 5 with runes, we might need to derive them or just use $store in the template.
	// But let's standardise on using the store directly in the template or derived values.
	
	// Timer logic
	let timerInterval: any;

	onMount(() => {
		if (isActive) {
			startTimer();
		}
	});

	onDestroy(() => {
		stopTimer();
	});

	function startTimer() {
		stopTimer();
		timerInterval = setInterval(() => {
			quizStore.tick();
		}, 1000);
	}

	function stopTimer() {
		if (timerInterval) clearInterval(timerInterval);
	}

	function formatTime(seconds: number) {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	function submit(isCorrect: boolean, skipped = false) {
		quizStore.submitAnswer(isCorrect, skipped);
	}

	// Reactive derived values accessing the store directly in the template allows Svelte to track dependencies
</script>

<div class="space-y-6">
	<!-- Header: Progress & Timer -->
	<div class="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
		<div class="flex flex-col">
			<span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Progress</span>
			<span class="text-lg font-bold text-slate-800">
				{$quizStore.currentQuestionIndex + 1} <span class="text-slate-400 text-sm font-normal">/ {$quizStore.questions.length}</span>
			</span>
		</div>
		
		<div class="flex flex-col items-end">
			<span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Time Remaining</span>
			<span class="text-2xl font-mono font-bold {$quizStore.timer < 60 ? 'text-red-500' : 'text-slate-700'}">
				{formatTime($quizStore.timer)}
			</span>
		</div>
	</div>

	{#if $quizStore.questions[$quizStore.currentQuestionIndex]}
		{@const currentQuestion = $quizStore.questions[$quizStore.currentQuestionIndex]}
		<!-- Question Card -->
		<div class="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-slate-200">
			<h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-8 leading-snug">
				{currentQuestion.question}
			</h2>

			<div class="grid grid-cols-1 gap-4">
				{#each currentQuestion.options as option}
					<button
						onclick={() => submit(option.correct)}
						class="text-left p-4 rounded-lg border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
					>
						<span class="text-slate-700 font-medium group-hover:text-emerald-900">{option.text}</span>
					</button>
				{/each}
			</div>

			<div class="mt-8 pt-6 border-t border-slate-100 flex justify-end">
				<button
					onclick={() => submit(false, true)}
					class="text-slate-500 hover:text-slate-700 font-medium text-sm flex items-center gap-2 px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors"
				>
					Skip / I Don't Know
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
				</button>
			</div>
		</div>
	{:else}
		<div class="p-8 text-center bg-white rounded-xl">
			<p class="text-slate-500">Loading question...</p>
		</div>
	{/if}
</div>
