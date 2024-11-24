<script lang="ts">
	let {
		placeholder,
		id,
		name,
		onchange = () => {},
		value = $bindable(),
		isPeer = false,
		disabled = false
	}: {
		placeholder?: string;
		id: string;
		name: string;
		onchange?: () => void;
		value?: string;
		isPeer?: boolean;
		disabled?: boolean;
	} = $props();

	let input: HTMLInputElement;

	function removeValidation() {
		(document.getElementById(id) as HTMLInputElement).setCustomValidity('');
	}
</script>

<input
	{disabled}
	onchange={() => {
		onchange();
		removeValidation();
	}}
	bind:value
	bind:this={input}
	type="date"
	{id}
	{name}
	{placeholder}
	class="w-full transition-all duration-200 rounded bg-background-light-2 border-background-dark-1 focus:outline-0 focus:border-primary-base ring-primary-base focus:ring-primary-base/40 ring-0 focus:ring-4 placeholder:text-text-light-3 invalid:border-red-500 invalid:ring-4 invalid:ring-danger-base/40 disabled:bg-background {isPeer ? "peer" : ""}"
/>
{#if disabled}
<input
	onchange={() => {
		onchange();
		removeValidation();
	}}
	bind:value
	bind:this={input}
	type="date"
	{id}
	{name}
	{placeholder}
	class="hidden"
/>
{/if}