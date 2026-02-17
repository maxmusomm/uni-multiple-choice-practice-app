<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";

	let { children } = $props();
</script>

<svelte:head>
	<title>Biology Quiz Practice</title>
	<meta
		name="description"
		content="Practice biology questions with this interactive quiz app"
	/>
	<link rel="icon" href={favicon} />
</svelte:head>

<div
	class="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-900 selection:text-emerald-100"
>
	<header class="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
		<div
			class="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex justify-center items-center"
		>
			<h1 class="text-xl font-bold text-slate-100 tracking-tight">
				BioQuiz Practice
			</h1>
		</div>
	</header>

	<main class="max-w-3xl mx-auto px-4 sm:px-6 py-8">
		{@render children()}
	</main>
</div>
