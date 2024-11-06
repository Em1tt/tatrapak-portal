<script lang="ts">
	import type { Snippet } from "svelte";

    let {forInput, children}: {forInput: string, children: Snippet} = $props();
</script>

<label for={forInput} class="text-text-light-2 max-w-fit">
    {@render children?.()}
</label>