<script lang="ts">
	import { type Zakaznik } from '$lib/server/models';
	import { recursiveSearch } from '$lib/util/client';
	import Button from '../Button.svelte';
	import TextInput from './TextInput.svelte';
	let {
		id,
		name,
		placeholder,
		data,
		reportedValue = $bindable(),
		actualValue = $bindable(),
		disabled = false
	}: {
		id: string;
		name: string;
		placeholder?: string;
		data: Zakaznik[];
		reportedValue?: string;
		actualValue?: number;
		disabled?: boolean;
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

	function removeValidation() {
		(document.getElementById(id) as HTMLInputElement).setCustomValidity('');
	}
</script>

<div class="relative">
	<TextInput {disabled} onchange={() => {actualValue = undefined;}} bind:value type="text" {id} {name} {placeholder} isPeer={true}></TextInput>
	<input type="text" id="{id}_val" bind:value={actualValue} name="{id}_val" class="hidden">
	<div
		class="absolute overflow-auto top-full hidden hover:block peer-focus:block left-0 max-h-60 w-full min-w-40 max-w-80 bg-background border border-border-base z-40 rotate-0 rounded"
	>
		<div class="flex flex-col">
			{#if query.length}
				{#each query as item}
					<Button
						onclick={() => {
							removeValidation();
							value = item.Meno;
							reportedValue = item.Meno;
							actualValue = item.ZakaznikID;
						}}
						type="button"
						style="opaque"
						textStyle="default"
						shrink={false}
					>
						<div class="flex flex-col text-left">
						<p class="text-text-base">{item.Meno}</p>
						{#if item.Email}
						<p class="text-sm text-text-light-3">{item.Email}</p>
						{/if}
						{#if item.Telefon}
						<p class="text-sm text-text-light-3">{item.Telefon}</p>
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
