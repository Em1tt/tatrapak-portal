<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import '../app.css';
	import { Toaster } from 'svelte-french-toast';

	let { children, data } = $props();
</script>

<Toaster toastOptions={{ className: 'toast', position: 'bottom-right' }} />

<div class="{data.theme} bg-background min-h-screen py-20">
	<Navbar user={data.user} />
	{@render children()}
</div>

<style lang="postcss">
	:global(.toast) {
		@apply !border-slate-400/30 !border !bg-slate-100 !shadow-none hover:!bg-slate-50 !text-xs;
	}
</style>
