<script lang="ts">
	import { dropDown } from "$lib/util/client";
	import type { Snippet } from "svelte";

    let {children, button, id = $bindable(), justify = "left"}: {children: Snippet, button: Snippet, id: string, justify?: "left" | "right"} = $props();
</script>

<div class="relative dropdown">
    {@render button?.()}
    {#if $dropDown == id}
    <div class="absolute overflow-auto top-full max-h-60 w-full min-w-40 max-w-80 bg-background border border-border-base z-40 rotate-0 rounded {justify == "left" ? "left-0" : "right-0"}">
        {@render children?.()}
    </div>
    {/if}
</div>