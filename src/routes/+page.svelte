<script lang="ts">
	import { quizStore } from '$lib/stores/quizStore';
	import QuestionUploader from '$lib/components/QuestionUploader.svelte';
	import QuizInterface from '$lib/components/QuizInterface.svelte';
	import Results from '$lib/components/Results.svelte';
	import { fly, fade } from 'svelte/transition';

	// Reactive derived values
	// In Svelte 5, $quizStore is reactive.
</script>

<div class="max-w-4xl mx-auto">
	{#if $quizStore.questions.length === 0}
		<div in:fade={{ duration: 300, delay: 150 }} out:fade={{ duration: 150 }}>
			<QuestionUploader />
		</div>
	{:else if !$quizStore.isFinished}
		<div in:fly={{ y: 20, duration: 300, delay: 150 }} out:fade={{ duration: 150 }}>
			<QuizInterface />
		</div>
	{:else}
		<div in:fly={{ y: 20, duration: 400 }} out:fade={{ duration: 150 }}>
			<Results />
		</div>
	{/if}
</div>
