<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		style,
		type = 'button',
		onclick = () => {},
		isRelative = false
	}: {
		children: Snippet;
		style: 'primary' | 'secondary' | 'opaque' | 'warning' | 'danger';
		type?: 'button' | 'submit' | 'reset';
		onclick?: () => void;
		isRelative?: boolean;
	} = $props();

	let button: HTMLButtonElement;
	let circle: HTMLDivElement;

	function onmousedown(event: MouseEvent) {
		const diameter = Math.max(button.clientWidth, button.clientHeight) * 2;
		const radius = diameter / 2;

		circle.style.width = circle.style.height = `${diameter}px`;
		circle.style.left = `${event.clientX - (button.offsetLeft + radius)}px`;
		circle.style.top = `${event.clientY - (button.offsetTop + radius)}px`;

		button.classList.add('animate-boink');
		circle.classList.add('animate-zoomin');
	}

	function onmouseup() {
		button.blur();
	}

	function onanimationend() {
		button.classList.remove('animate-boink');
		circle.classList.remove('animate-zoomin');
	}
</script>

<button
	{type}
	{onclick}
	bind:this={button}
	{onmousedown}
	{onmouseup}
	{onanimationend}
	class="flex flex-row gap-2 items-center border rounded px-4 py-1.5 text-sm {isRelative ? "absolute" : "relative"} focus:scale-95 duration-150 overflow-hidden
    {style == 'primary'
		? 'text-text-dark-1 bg-primary-base hover:bg-primary-light-1 border-primary-dark-1/30'
		: style == 'secondary'
			? 'text-text-dark-1 bg-secondary-base hover:bg-secondary-light-1 border-secondary-dark-1/30'
			: style == 'opaque'
				? 'text-text-dark-1 hover:bg-background-dark-2/50 border-opacity-0'
				: style == 'warning'
					? 'text-text-dark-1 bg-warning-base hover:bg-warning-light-1 border-warning-dark-1/30'
					: style == 'danger'
						? 'text-text-dark-1 bg-danger-base hover:bg-danger-light-1 border-danger-dark-1/30'
						: ''}"
>
	<div
		bind:this={circle}
		class="absolute bg-background-light-2/40 aspect-square rounded-full opacity-0 pointer-events-none"
	></div>
	{@render children()}
</button>
