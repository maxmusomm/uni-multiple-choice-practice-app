<script lang="ts">
	import { quizStore } from "$lib/stores/quizStore";
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

	<div class="space-y-4">
		<button
			onclick={restart}
			class="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-lg shadow-emerald-900/20 transition-all hover:translate-y-[-1px]"
		>
			Start New Quiz
		</button>
	</div>
</div>
