<script lang="ts">
    import type { Snippet } from "svelte";
	import Icon from "../Icon.svelte";
	import Check from "$lib/icons/CheckAnimated.svelte";
    let {label, id, checked = $bindable(), disabled = false}: {label: string, id: string, checked: boolean, disabled?: boolean} = $props();
</script>

<input bind:checked name={id} {id} type="checkbox" class="peer hidden">
<button type="button" onclick={() => {checked = !checked}} aria-label={label}
    class="w-5 h-5 transition-all stroke-2 text-white grid place-items-center duration-200 rounded bg-background-dark-1 border border-background-dark-2 focus:outline-0 peer-checked:bg-primary-light-1 peer-checked:border-2 peer-checked:border-primary-base focus:border-primary-base ring-primary-base focus:ring-primary-base/40 ring-0 focus:ring-4 placeholder:text-text-light-3 invalid:border-red-500 invalid:ring-4 invalid:ring-danger-base/40"
>
    {#if checked}
    <div>
    <Icon scale="tiny" stroke={4}>
        <Check/>
    </Icon>
    </div>
    {/if}
</button>
<label class="text-sm text-text-light-1" for={id}>{label}</label>