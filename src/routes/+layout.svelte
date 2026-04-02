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
	<button class="text-[#acabab] hover:text-[#b6c9d8] transition-colors duration-200 active:scale-95 transition-transform">
		<span class="material-symbols-outlined">settings</span>
	</button>
</header>
<div class="bg-[#131313] h-px w-full fixed top-[64px] z-50"></div>

<main class="pt-24 pb-32 px-6 max-w-lg mx-auto">
	{@render children()}
</main>

<nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pt-3 pb-8 bg-[#0e0e0e] border-t border-[#474848]/20">
	<div class="flex flex-col items-center justify-center text-[#b6c9d8] font-bold cursor-pointer">
		<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">biotech</span>
		<span class="font-label text-[10px] uppercase tracking-widest mt-1">Biology</span>
	</div>
	<div class="flex flex-col items-center justify-center text-[#acabab] hover:text-[#e7e5e5] cursor-pointer">
		<span class="material-symbols-outlined">functions</span>
		<span class="font-label text-[10px] uppercase tracking-widest mt-1">Physics</span>
	</div>
	<div class="flex flex-col items-center justify-center text-[#acabab] hover:text-[#e7e5e5] cursor-pointer">
		<span class="material-symbols-outlined">science</span>
		<span class="font-label text-[10px] uppercase tracking-widest mt-1">Chemistry</span>
	</div>
	<div class="flex flex-col items-center justify-center text-[#acabab] hover:text-[#e7e5e5] cursor-pointer">
		<span class="material-symbols-outlined">history</span>
		<span class="font-label text-[10px] uppercase tracking-widest mt-1">History</span>
	</div>
	<div class="flex flex-col items-center justify-center text-[#acabab] hover:text-[#e7e5e5] cursor-pointer">
		<span class="material-symbols-outlined">settings_accessibility</span>
		<span class="font-label text-[10px] uppercase tracking-widest mt-1">Settings</span>
	</div>
</nav>
