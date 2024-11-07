<script lang="ts">
	import { dropDown } from "$lib/util/client";
	import type { Snippet } from "svelte";

    let {children, button, id = $bindable()}: {children: Snippet, button: Snippet, id: string} = $props();
</script>

<div class="relative dropdown">
    {@render button?.()}
    {#if $dropDown == id}
    <div class="absolute top-full w-full max-w-60 bg-background border border-border-base rounded-b left-0">
        {@render children?.()}
    </div>
    {/if}
</div>