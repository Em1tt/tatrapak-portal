<script lang="ts">
	import type { Snippet } from "svelte";

    let { children, href, scale = "default" }: {children: Snippet, href: string, scale?: "small" | "default"} = $props();
</script>

<a {href} class="text-text-dark-2 hover:text-primary-base {scale == "small" ? "text-sm" : ""}">
    {@render children?.()}
</a>