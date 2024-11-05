<script lang="ts">
	import '../app.css';

	let { children, data } = $props();
</script>
<div class={data.theme}>
	<button class="bg-primary border border-primary-dark/30 rounded px-3 py-1 text-white">Vytvoriť továr</button>
	{@render children()}
</div>

<style>
	.randomClass{
		color: hsl(116, 100%, 43%);
	}
</style>
