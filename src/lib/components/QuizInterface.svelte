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
		{@const isImageQuestion = currentQuestion.question_type && currentQuestion.question_type[0] === 'image'}
		{@const questionImage = isImageQuestion ? currentQuestion.question_type[1] : null}
		{@const isImageAnswers = currentQuestion.answer_type === 'image'}

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

		<!-- Optional Image Question Diagram -->
		{#if isImageQuestion && questionImage}
			<section class="mb-8">
				<div class="bg-surface-container-low border border-outline-variant/10 rounded-xl overflow-hidden aspect-square flex items-center justify-center relative p-8 group">
					<div class="w-full h-full flex items-center justify-center text-on-surface [&>svg]:w-full [&>svg]:max-h-full opacity-90 group-hover:opacity-100 transition-opacity duration-300">
						{@html questionImage}
					</div>
					<!-- Zoom Action Label Mockup -->
					<div class="absolute bottom-4 right-4">
						<button class="bg-surface-bright/70 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2 border border-outline-variant/20">
							<span class="material-symbols-outlined text-sm" data-icon="zoom_in">zoom_in</span>
							<span class="font-label text-[10px] uppercase tracking-wider text-on-surface">Enlarge</span>
						</button>
					</div>
				</div>
			</section>
		{/if}

		<!-- Question Text -->
		<section class="mb-8">
			<p class="font-headline text-xl italic leading-relaxed text-on-surface-variant">
				"{currentQuestion.question}"
			</p>
		</section>

		<!-- Options Container -->
		<div class="mb-10">
			{#if isImageAnswers}
				<div class="grid grid-cols-2 gap-4">
					{#each currentQuestion.options as option, index}
						{@const letter = String.fromCharCode(65 + index)}
						<button onclick={() => submit(option.correct)} class="relative group aspect-square rounded-xl bg-surface-container overflow-hidden border border-outline-variant/10 transition-all duration-300 hover:bg-surface-container-high hover:border-primary/50 focus:ring-2 focus:ring-primary focus:outline-none">
							<div class="absolute inset-0 w-full h-full flex items-center justify-center p-6 opacity-70 group-hover:opacity-100 transition-opacity [&>svg]:w-full [&>svg]:max-h-full">
								{@html option.text}
							</div>
							<div class="absolute top-3 left-3 w-6 h-6 rounded bg-surface/80 backdrop-blur flex items-center justify-center border border-outline-variant/20 z-10">
								<span class="text-[10px] font-bold text-on-surface">{letter}</span>
							</div>
						</button>
					{/each}
				</div>
			{:else}
				<div class="space-y-4">
					{#each currentQuestion.options as option, index}
						{@const letter = String.fromCharCode(65 + index)}
						<button onclick={() => submit(option.correct)} class="w-full text-left p-5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/10 hover:border-primary/20 transition-all duration-300 group flex items-start justify-between gap-4">
							<div class="flex items-start gap-4 pr-4">
								<div class="w-8 h-8 flex-shrink-0 rounded-lg bg-surface-container-low border border-outline-variant/30 flex items-center justify-center group-hover:border-primary/50 transition-colors">
									<span class="font-label text-[10px] font-semibold text-on-surface-variant group-hover:text-primary transition-colors">{letter}</span>
								</div>
								<span class="text-on-surface text-base leading-snug mt-1">{option.text}</span>
							</div>
							<span class="material-symbols-outlined opacity-0 group-hover:opacity-100 text-primary transition-opacity mt-1.5" style="font-variation-settings: 'FILL' 1;">check_circle</span>
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Bottom Action / Skip Area -->
		<div class="flex justify-start pt-4 border-t border-outline-variant/10">
			<button onclick={() => submit(false, true)} class="flex items-center gap-2 font-label text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors mt-4">
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
