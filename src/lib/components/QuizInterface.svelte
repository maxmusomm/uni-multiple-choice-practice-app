<script lang="ts">
	import { quizStore } from "$lib/stores/quizStore";
	import { onMount, onDestroy } from "svelte";
	import { goto } from '$app/navigation';

	// Timer logic
	let timerInterval: any;

	onMount(() => {
		// start timer only when quiz is active
		if ($quizStore.isActive) startTimer();
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
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	}

	function submit(isCorrect: boolean, skipped = false) {
		quizStore.submitAnswer(isCorrect, skipped);
	}

	function quitQuiz() {
		const confirmQuit = confirm('Quit the quiz and lose current progress?');
		if (confirmQuit) {
			quizStore.reset();
			stopTimer();
			goto('/');
		}
	}
</script>

<div class="space-y-8">
	<!-- Status Bar (Timer & Quit) -->
	<div class="flex justify-between items-center bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
		{#if $quizStore.isActive || ($quizStore.answers && $quizStore.answers.length > 0) && !$quizStore.isFinished}
			<button onclick={quitQuiz} class="font-label text-xs uppercase tracking-widest text-error hover:text-error-dim font-bold transition-colors">
				Quit Quiz
			</button>
		{:else}
			<div></div>
		{/if}
		
		<div class="flex items-center gap-2">
			<span class="material-symbols-outlined text-outline-variant text-[18px]">timer</span>
			<span class="font-label text-sm font-bold tracking-widest {$quizStore.timer < 60 ? 'text-error' : 'text-on-surface'}">
				{formatTime($quizStore.timer)}
			</span>
		</div>
	</div>

	{#if $quizStore.questions[$quizStore.currentQuestionIndex]}
		{@const currentQuestion = $quizStore.questions[$quizStore.currentQuestionIndex]}
		{@const currentIndex = $quizStore.currentQuestionIndex + 1}
		{@const totalQuestions = $quizStore.questions.length}
		{@const progressPercent = Math.round((currentIndex / totalQuestions) * 100)}

		<!-- Question Meta -->
		<div class="flex justify-between items-end mb-8">
			<div class="space-y-1">
				<span class="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">Question {currentIndex} of {totalQuestions}</span>
				<h2 class="font-headline text-3xl font-semibold leading-tight text-on-surface">Practice Question</h2>
			</div>
			<div class="text-right">
				<span class="font-label text-sm text-primary">{progressPercent}% Complete</span>
			</div>
		</div>

		<!-- Question Text -->
		<section class="mb-12">
			<p class="font-headline text-xl italic leading-relaxed text-on-surface-variant">
				"{currentQuestion.question}"
			</p>
		</section>

		<!-- Options Container -->
		<div class="space-y-4 mb-16">
			{#each currentQuestion.options as option, index}
				{@const letter = String.fromCharCode(65 + index)}
				<button onclick={() => submit(option.correct)} class="w-full text-left p-5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-transparent hover:border-primary/20 transition-all duration-200 group flex items-start justify-between gap-4">
					<div class="flex items-start gap-4 pr-4">
						<span class="font-label text-sm text-outline-variant group-hover:text-primary transition-colors">{letter}</span>
						<span class="text-on-surface text-base leading-snug">{option.text}</span>
					</div>
					<span class="material-symbols-outlined opacity-0 group-hover:opacity-100 text-primary transition-opacity mt-0.5" style="font-variation-settings: 'FILL' 1;">check_circle</span>
				</button>
			{/each}
		</div>

		<!-- Bottom Action / Skip Area -->
		<div class="flex justify-start pt-4">
			<button onclick={() => submit(false, true)} class="flex items-center gap-2 font-label text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors">
				<span class="material-symbols-outlined text-[18px]">skip_next</span>
				Skip / Don't Know
			</button>
		</div>
	{:else}
		<div class="p-10 text-center bg-surface-container-low border border-outline-variant/10 rounded-2xl flex flex-col items-center justify-center gap-4">
			<span class="material-symbols-outlined text-4xl text-primary animate-pulse">hourglass_empty</span>
			<p class="font-label text-xs uppercase tracking-widest text-on-surface-variant">Loading question...</p>
		</div>
	{/if}
</div>
