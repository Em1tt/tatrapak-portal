<script lang="ts">
	import Dropdown from '../Dropdown.svelte';
	import { dropDown } from '$lib/util/client';
	import Button from '../Button.svelte';

	let {
		data,
		placeholder = "Vyberte rolu",
		id,
		name,
		onchange = () => {},
		value = $bindable(""),
        actualValue = $bindable(""),
		isPeer = false,
		disabled = false
	}: {
		data: { id: string; name: string }[];
		placeholder?: string;
		id: string;
		name: string;
		onchange?: () => void;
		value?: string;
		actualValue?: string;
		isPeer?: boolean;
		disabled?: boolean;
	} = $props();

    $effect(() => {
        if (actualValue) {
            value = data.find((d) => d.id == actualValue)?.name ?? "";
        }
    });

	function removeValidation() {
		(document.getElementById(id) as HTMLInputElement).setCustomValidity('');
	}
</script>

<Dropdown id="dropdown_{name}">
	{#snippet button(namee = name)}
		<div class="flex flex-col">
            <input class="hidden peer" bind:value={actualValue} {id} name={namee}>
			<button
				type="button"
                {disabled}
				class="flex bg-background-light-2 disabled:bg-background disabled:text-text-light-2 flex-row gap-2 items-center h-[42px] border rounded px-4 py-2 text-sm duration-150 overflow-hidden border-background-dark-1 focus:outline-0 focus:border-primary-base ring-primary-base focus:ring-primary-base/40 ring-0 focus:ring-4 placeholder:text-text-light-3 peer-invalid:border-red-500 peer-invalid:ring-4 peer-invalid:ring-danger-base/40"
				onclick={() => {
					$dropDown == "dropdown_"+namee ? dropDown.set('') : dropDown.set("dropdown_"+namee);
				}}
			>
				{#if value == ""}
                    <p class="text-text-light-3">{placeholder}</p>
                {:else}
                    <p class="text-left">{value}</p>
                {/if}
			</button>
		</div>
	{/snippet}
	<div class="flex flex-col">
        {#each data as item}
            <Button
                shrink={false}
                type="button"
                style="opaque"
                onclick={() => {
                    actualValue = item.id;
                    value = item.name;
                    onchange();
					removeValidation();
                    dropDown.set('');
                }}
            >
                <p class="text-left">{item.name}</p>
            </Button>
        {/each}
	</div>
</Dropdown>
