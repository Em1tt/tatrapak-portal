<script lang="ts">
	import Logout from '$lib/icons/Logout.svelte';
	import { type Zakaznik } from '$lib/server/models';
	import { recursiveSearch } from '$lib/util/client';
	import Button from '../Button.svelte';
	import Icon from '../Icon.svelte';
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
		data: Zakaznik[];
		reportedValue?: string;
		actualValue?: string;
	} = $props();
	let value = $state('');

	const query = $derived(
		data.filter((d) => {
			if (recursiveSearch(d as any, value)) return d;
		})
	);

	$effect(() => {
		console.log(query);
	});

	$effect(() => {
		if (reportedValue) {
			value = reportedValue;
		}
	});
</script>

<div class="relative">
	<TextInput bind:value type="text" {id} {name} {placeholder} isPeer={true}></TextInput>
	<div
		class="absolute overflow-auto top-full hidden hover:block peer-focus:block left-0 max-h-60 w-full min-w-40 max-w-80 bg-background border border-border-base z-40 rotate-0 rounded"
	>
		<div class="flex flex-col">
			{#if query.length}
				{#each query as item}
					<Button
						onclick={() => {
							reportedValue = item.Meno;
							actualValue = item.ZakaznikID;
						}}
						type="button"
						style="opaque"
						textStyle="default"
						shrink={false}
					>
						{item.Meno}
					</Button>
					<div
						class="flex flex-row items-center justify-between w-full px-2 py-1 mx-auto max-w-7xl"
					>
						<span>{item.Meno}</span>
						<span>{item.Email}</span>
					</div>
				{/each}
			{:else}{/if}
			<Button type="button" style="opaque" textStyle="danger" shrink={false}>
				<Icon scale="small">
					<Logout />
				</Icon> Odhlásiť sa
			</Button>
			<Button type="button" style="opaque" textStyle="danger" shrink={false}>
				<Icon scale="small">
					<Logout />
				</Icon> Odhlásiť sa
			</Button>
		</div>
	</div>
</div>
