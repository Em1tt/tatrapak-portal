<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import Button from './Button.svelte';
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
		class="bg-black/20 backdrop-blur w-screen h-screen fixed top-0 left-0"
	></div>
	<div
		class="fixed top-0 left-0 w-screen h-screen z-50 overflow-auto overflow-x-visible px-4 grid place-items-center"
		id="backdrop"
	>
		<div
			in:fly={{ y: 30, delay: 100 }}
			out:fly={{ y: 30 }}
			class="mx-auto my-12 bg-background-light-1 max-w-2xl block rounded w-full"
		>
			<div
				class="w-full p-2 border-b border-b-background-dark-1 flex flex-auto justify-between items-center text-text-base"
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
