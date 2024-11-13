<script lang="ts">
	let {type, placeholder, id, name, error = "", value = $bindable()}: {type: "email" | "password" | "text", placeholder?: string, id: string, name: string, error?: string, value?: string} = $props();

	let input: HTMLInputElement;

	$effect(() => {
		input.setCustomValidity(error);
	});
</script>
<input
	onchange={() => {
		error = "";
	}}
	bind:value
	bind:this={input}
	{type}
	{id}
	{name}
    {placeholder}
	class="w-full transition-all duration-200 rounded bg-background-light-2 border-background-dark-1 focus:outline-0 focus:border-primary-base ring-primary-base focus:ring-primary-base/40 ring-0 focus:ring-4 placeholder:text-text-light-3 invalid:border-red-500 invalid:ring-4 invalid:ring-danger-base/40"
/>
