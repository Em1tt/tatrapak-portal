<script lang="ts">
	import { type Produkt } from '$lib/server/models';
	import { recursiveSearch } from '$lib/util/client';
	import Button from '../Button.svelte';
	import TextInput from './TextInput.svelte';
	let {
		id,
		name,
		placeholder,
		data,
		reportedValue = $bindable(),
		actualValue = $bindable()
	}: {
		id: string;
		name: string;
		placeholder?: string;
		data: Produkt[];
		reportedValue?: string;
		actualValue?: number;
	} = $props();
	let value = $state('');

	const query = $derived(
		data.filter((d) => {
			if (recursiveSearch(d as any, value)) return d;
		})
	);

	$effect(() => {
		if (reportedValue) {
			value = reportedValue;
		}
	});

	function formatWeight(weight: string): string {
		const w = parseFloat(weight);
        return w % 1 === 0 ? w.toFixed(0) : w.toFixed(1);
    }
</script>

<div class="relative">
	<TextInput bind:value type="text" {id} {name} {placeholder} isPeer={true}></TextInput>
	<input type="text" id="{id}_val" bind:value={actualValue} name="{id}_val" class="hidden">
	<div
		class="absolute overflow-auto top-full hidden hover:block peer-focus:block left-0 max-h-60 w-full min-w-40 max-w-80 bg-background border border-border-base z-40 rotate-0 rounded"
	>
		<div class="flex flex-col">
			{#if query.length}
				{#each query as item}
					<Button
						onclick={() => {
							reportedValue = item.Nazov;
							actualValue = item.ProduktID;
						}}
						type="button"
						style="opaque"
						textStyle="default"
						shrink={false}
					>
						<div class="flex flex-col text-left">
						<p class="text-text-base">{item.Nazov} {item.Hmotnost && parseFloat(item.Hmotnost) > 0 ? `(${formatWeight(item.Hmotnost)}g)` : ""}</p>
						{#if item.KatalogoveCislo}
						<p class="text-sm text-text-light-3">{item.KatalogoveCislo}</p>
						{/if}
						{#if item.Cena && parseFloat(item.Cena) > 0}
						<p class="text-sm text-text-light-3">€{item.Cena}/ks</p>
						{/if}
					</div>
					</Button>
				{/each}
			{:else}
				<div class="flex flex-row items-center justify-between w-full px-4 py-2 mx-auto max-w-7xl text-text-light-2 text-sm">
					<p class="text-sm">Žiadne výsledky</p>
				</div>
			{/if}
		</div>
	</div>
</div>
