<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import Icon from './Icon.svelte';
	import XMark from '$lib/icons/XMark.svelte';

	let { children, open = $bindable(), header }: { children: Snippet; open: boolean, header: Snippet } = $props();

	onMount(() => {
		document.addEventListener('click', (e) => {
			if ((e.target as HTMLDivElement).id === 'backdrop') {
				open = false;
				document.body.style.overflow = 'auto';
			}
		});
	});
</script>

{#if open}
	<div
		in:fade
		out:fade={{ delay: 100 }}
		class="fixed top-0 left-0 z-40 w-screen h-screen bg-black/20 backdrop-blur"
	></div>
	<div
		class="fixed top-0 left-0 z-50 grid w-screen h-screen px-4 overflow-auto overflow-x-visible place-items-center"
		id="backdrop"
	>
		<div
			in:fly={{ y: 30, delay: 100 }}
			out:fly={{ y: 30 }}
			class="block w-full max-w-2xl mx-auto my-12 rounded bg-background-light-1"
		>
			<div
				class="flex items-center justify-between flex-auto w-full px-4 py-2 border-b border-b-background-dark-1 text-text-base"
			>
				<h2>
					{@render header?.()}
				</h2>
				<button onclick={() => open = false} class="hover:text-text-light-1">
					<Icon scale="medium">
						<XMark/>
					</Icon>
				</button>
			</div>
			<div>
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}
