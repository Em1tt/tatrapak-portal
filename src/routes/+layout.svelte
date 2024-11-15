<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
import '../app.css';

	let { children, data } = $props();
	console.log(data);
</script>

<div class="{data.theme} bg-background min-h-screen py-20">
	<Navbar user={data.user}/>
	{@render children()}
</div>

<style>
	.randomClass {
		color: hsl(116, 100%, 43%);
	}
</style>