<script>
	import Button from "$lib/components/Button.svelte";
import Dialog from "$lib/components/Dialog.svelte";
	import Icon from "$lib/components/Icon.svelte";
	import Login from "$lib/icons/Login.svelte";

	let open = $state(false);
	
</script>

<Button style="primary" onclick={() => {
	open = true;
}}>
	Test
</Button>

<div class="mx-auto max-w-7xl px-20 grid grid-cols-12">

</div>