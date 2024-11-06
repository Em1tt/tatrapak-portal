<script lang="ts">
	import type { Snippet } from "svelte";

    let {children, button}: {children: Snippet, button: Snippet} = $props();
</script>

<div class="relative">
    {@render button?.()}
    <div class="absolute top-full w-full max-w-80 bg-background border border-border-base rounded-b left-0 hidden peer-focus:block">
        {@render children?.()}
    </div>
</div>