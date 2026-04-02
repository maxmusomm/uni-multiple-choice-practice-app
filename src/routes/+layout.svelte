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

<header class="bg-[#0e0e0e] flex justify-between items-center px-6 py-4 w-full fixed top-0 z-50">
	<div class="flex items-center gap-3">
		<div class="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden">
			<img alt="User Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUHsremPfuoKYP8WJSaFhN_qve8wfRaoNWMwA5yBi42U84g9gFY_FqSUa81pky1MLhSb5YM78MLqCDnXrkZm_aUUkL6iabz3UivMfkfu11i9EkFOqclMdRkhKM3xQGUrZ-B6o7NzfCUnSm3RUI5oyhzRqVTz-Nh1fYZtao8-zOKOmtncqrS6Ntwh0pOI4zSm2Ra_BK8s6BjiChbnLaTISOWZdrUTk5IzD1nSo57C13TDx1GaPAm1H5feQRfbbKsjMdSzLXRnOgw1E" />
		</div>
		<span class="font-headline text-xl font-semibold text-[#e7e5e5]">QuizPractice</span>
	</div>
</header>
<div class="bg-[#131313] h-px w-full fixed top-[64px] z-50"></div>

<main class="pt-24 pb-12 px-6 max-w-lg mx-auto">
	{@render children()}
</main>
