<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Label from '$lib/components/forms/Label.svelte';
	import TextInput from '$lib/components/forms/TextInput.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Login from '$lib/icons/Login.svelte';
	import toast from 'svelte-french-toast';

	console.log($page);

	let loginError: string | unknown = $state('');
	let validate: string[] = $state([]);

	$effect(() => {
		validate.forEach((i) => {
			(document.getElementById(i) as HTMLInputElement).setCustomValidity('Chybné pole');
		});
	});
</script>
<div class="w-full h-screen grid place-items-center fixed top-0">
{#if $page?.status == 401}
	<form
		class="border border-border-base rounded p-4"
			method="post"
			action="/api/auth"
			use:enhance={() => {
				return async ({ result }) => {
					// `result` is an `ActionResult` object
					if (result.type === 'failure') {
						loginError = result.data?.message;
						if (Array.isArray(result.data?.validate)) validate = result.data?.validate;
						console.error(result);
					} else {
						await invalidateAll();
						toast.success('Úspešne ste sa prihlásili.', {
							duration: 3000,
							position: 'bottom-right'
						});
						open = false;
						await applyAction(result);
					}
				};
			}}
		>
		<h1 class="text-lg">Prihlásiť sa</h1>
			<div class="px-4 py-2">
				<div class="flex flex-col gap-1 py-1">
					<Label forInput="email">E-Mail</Label>
					<TextInput type="email" id="email" name="email" placeholder="E-Mail" />
				</div>
				<div class="flex flex-col gap-1 py-1">
					<Label forInput="password">Password</Label>
					<TextInput type="password" id="password" name="password" placeholder="Password" />
				</div>
			</div>
			{#if loginError}
				<div class="px-4 py-2 text-danger-base">{loginError}</div>
			{/if}
			<div class="flex justify-between w-full px-4 py-2 border-t border-slate-400/30">
				<Button type="submit" style="primary">
					<Icon scale="small">
						<Login />
					</Icon>
					Prihlásiť sa
				</Button>
			</div>
		</form>
{:else}
	<div class="p-4 rounded border border-border-base z-20 bg-background">
		<p class="text-text-text-base text-lg">{$page?.error?.message}</p>
	</div>
	<p class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-text-light-3 text-[20rem] opacity-20 pointer-events-none">{$page?.status}</p>
{/if}
</div>