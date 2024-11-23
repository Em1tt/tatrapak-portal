<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../Icon.svelte';
	import Check from '$lib/icons/CheckAnimated.svelte';
	let {
		label,
		id,
		name,
		group = $bindable(),
		value,
		disabled = false,
		onclick = () => {}
	}: {
		label: string;
		id: string;
		name: string;
		group: string;
		value: string;
		disabled?: boolean;
        onclick?: () => void;
	} = $props();

    console.log(group);
</script>

<input bind:group {name} {id} type="radio" class="peer hidden" {value} {disabled} />
<button
	type="button"
	aria-label={label}
	onclick={() => {
        group = value;
        onclick?.();
    }}
	class="w-5 h-5 transition-all stroke-2 text-white grid place-items-center duration-200 rounded-full bg-background-dark-1 border border-background-dark-2 focus:outline-0 peer-checked:bg-primary-light-1 peer-checked:border-2 peer-checked:border-primary-base focus:border-primary-base ring-primary-base focus:ring-primary-base/40 ring-0 focus:ring-4 placeholder:text-text-light-3 invalid:border-red-500 invalid:ring-4 invalid:ring-danger-base/40"
	{disabled}
>
	{#if group == value}
		<div>
			<Icon scale="tiny" stroke={4}>
				<Check />
			</Icon>
		</div>
	{/if}
</button>
