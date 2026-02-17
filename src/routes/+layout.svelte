<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<title>Biology Quiz Practice</title>
	<meta name="description" content="Practice biology questions with this interactive quiz app" />
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
	<header class="bg-white border-b border-slate-200 sticky top-0 z-50">
		<div class="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
			<div class="flex items-center gap-2">
				<div class="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">B</div>
				<h1 class="text-xl font-bold text-slate-800 tracking-tight">BioQuiz</h1>
			</div>
			<!-- Placeholder for future nav or user info -->
		</div>
	</header>

	<main class="max-w-3xl mx-auto px-4 sm:px-6 py-8">
		{@render children()}
	</main>
	
	<footer class="text-center py-6 text-slate-400 text-sm">
		<p>&copy; {new Date().getFullYear()} BioQuiz Practice</p>
	</footer>
</div>
