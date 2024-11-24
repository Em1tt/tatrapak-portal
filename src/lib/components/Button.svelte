<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		style,
		textStyle = "default",
		shrink = true,
		type = 'button',
		onclick = () => {},
		isRelative = false,
		disabled = false,
		name,
		value
	}: {
		children: Snippet;
		style: 'primary' | 'secondary' | 'opaque' | 'warning' | 'danger';
		textStyle?: 'default' | 'primary' | 'secondary' | 'warning' | 'danger';
		shrink?: boolean,
		type?: 'button' | 'submit' | 'reset';
		onclick?: () => void;
		isRelative?: boolean;
		disabled?: boolean;
		name?: string;
		value?: string;
	} = $props();

	let button: HTMLButtonElement;
	let circle: HTMLDivElement;

	function onmousedown(event: MouseEvent) {
		const diameter = Math.max(button.clientWidth, button.clientHeight) * 2.5;
        const radius = diameter / 2;

        const rect = button.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${offsetX - radius}px`;
        circle.style.top = `${offsetY - radius}px`;
		if(shrink){
			button.classList.add('animate-boink');
		}
		circle.classList.add('animate-zoomin');
	}

	function onmouseup() {
		button.blur();
	}

	function onanimationend() {
		if(shrink){
			button.classList.remove('animate-boink');
		}
		circle.classList.remove('animate-zoomin');
	}
</script>

<button
	{type}
	{name}
	{value}
	{disabled}
	{onclick}
	bind:this={button}
	{onmousedown}
	{onmouseup}
	{onanimationend}
	class="flex flex-row gap-2 items-center border rounded px-4 py-1.5 text-sm {isRelative ? "absolute" : "relative"} {shrink ? "focus:scale-95" : ""} duration-150 overflow-hidden
    {textStyle == 'default' 
		? 'text-text-dark-1'
		: textStyle == "primary"
			? "text-primary-dark-1"
			: textStyle == "secondary"
				? "text-secondary-dark-1"
				: textStyle == "warning"
					? "text-warning-dark-1"
					: textStyle == "danger"
						? "text-danger-dark-1"
						: ""}
	{style == 'primary'
		? 'bg-primary-base hover:bg-primary-light-1 border-primary-dark-1/30 disabled:bg-primary-base/50'
		: style == 'secondary'
			? 'bg-secondary-base hover:bg-secondary-light-1 border-secondary-dark-1/30  disabled:bg-secondary-base/50'
			: style == 'opaque'
				? 'hover:bg-background-dark-2/50 border-opacity-0 disabled:bg-background-dark-1/50'
				: style == 'warning'
					? 'bg-warning-base hover:bg-warning-light-1 border-warning-dark-1/30 disabled:bg-warning-base/50'
					: style == 'danger'
						? 'bg-danger-base hover:bg-danger-light-1 border-danger-dark-1/30 disabled:bg-danger-base/50'
						: ''}"
>
	<div
		bind:this={circle}
		class="absolute bg-background-light-2/40 aspect-square rounded-full opacity-0 pointer-events-none"
	></div>
	{@render children()}
</button>
