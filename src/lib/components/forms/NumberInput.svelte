<script lang="ts">
	let {
		placeholder,
		id,
		name,
		min,
		max,
		onchange = () => {},
		value = $bindable(),
		step = 'any',
		disabled = false
	}: {
		placeholder?: string;
		id: string;
		name: string;
		min: number;
		max: number;
		onchange?: () => void;
		value?: number;
		step?: string;
		disabled?: boolean;
	} = $props();

	let input: HTMLInputElement;

	function removeValidation() {
		(document.getElementById(id) as HTMLInputElement).setCustomValidity('');
	}
</script>

<input
	onchange={() => {
		onchange();
		removeValidation();
	}}
	bind:value
	bind:this={input}
	{disabled}
	{min}
	{max}
	{step}
	type="number"
	{id}
	{name}
	{placeholder}
	class="w-full transition-all duration-200 rounded bg-background-light-2 border-background-dark-1 focus:outline-0 focus:border-primary-base ring-primary-base focus:ring-primary-base/40 ring-0 focus:ring-4 placeholder:text-text-light-3 invalid:border-red-500 invalid:ring-4 invalid:ring-danger-base/40 disabled:bg-background"
/>
{#if disabled}
	<input
		onchange={() => {
			onchange();
			removeValidation();
		}}
		bind:value
		bind:this={input}
		{min}
		{max}
		{step}
		type="number"
		{id}
		{name}
		{placeholder}
		class="hidden"
	/>
{/if}
