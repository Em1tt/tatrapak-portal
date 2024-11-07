<script lang="ts">
	import Login from '$lib/icons/Login.svelte';
	import TextInput from '$lib/components/forms/TextInput.svelte';
	import Button from './Button.svelte';
	import Dialog from './Dialog.svelte';
	import Icon from './Icon.svelte';
	import { dropDown, getAvatar } from '$lib/util/client';
	import Dropdown from './Dropdown.svelte';
	import { onMount } from 'svelte';
	import ChevronDown from '$lib/icons/ChevronDown.svelte';
	import ChevronUp from '$lib/icons/ChevronUp.svelte';
	import Label from './forms/Label.svelte';
	import Logout from '$lib/icons/Logout.svelte';
	import Anchor from './Anchor.svelte';

	let open = $state(false);

	let authenticated = false;

	onMount(() => {
		document.addEventListener('click', (e) => {
			if (!(e.target as HTMLDivElement).closest('.dropdown')) {
				dropDown.set('');
			}
		});
	});
</script>

<div
	class="flex flex-col w-full border border-b-border-base bg-background fixed top-0 left-0"
>
	<div class="w-full border-b border-b-border-base">
		<div class="flex flex-row items-center justify-between w-full px-2 py-1 mx-auto max-w-7xl">
			<a href="/">
				<img src="/tatrapak.png" alt="Tatrapak logo" width="120" />
			</a>
			{#if authenticated}
				<Dropdown id="user">
					{#snippet button(name = 'user')}
						<Button
							style="opaque"
							onclick={() => ($dropDown == name ? dropDown.set('') : dropDown.set(name))}
						>
							<img src={getAvatar('Richard Marcinčák')} width="40" alt="User initials" />
							<div class="flex flex-col flex-nowrap justify-center items-start gap-0 leading-tight">
								<p class="text-text-base text-sm leading-tight">Richard Marcinčák</p>
								<p class="text-text-light-2 text-xs leading-tight">Obchoďák</p>
							</div>
							<div class="text-text-light-2">
								<Icon scale="small">
									{#if $dropDown == name}
										<ChevronUp />
									{:else}
										<ChevronDown />
									{/if}
								</Icon>
							</div>
						</Button>
					{/snippet}
					<div class="flex flex-col">
						<Button style="opaque" textStyle="danger" shrink={false}>
							<Icon scale="small">
								<Logout />
							</Icon> Odhlásiť sa
						</Button>
					</div>
				</Dropdown>
			{:else}
				<Button style="primary" onclick={() => (open = true)}>Prihlásiť sa</Button>
			{/if}
		</div>
	</div>
	<div class="w-full bg-background-light-1">
		<div class="flex flex-row items-center justify-start w-full px-2 py-1 mx-auto max-w-7xl gap-4">
			<Anchor scale="small" href="/">Domov</Anchor>
			<Anchor scale="small" href="/objednavky">Objednávky</Anchor>
			<Anchor scale="small" href="/pouzivatelia">Používatelia</Anchor>
		</div>
	</div>
</div>

{#if !authenticated}
	<Dialog bind:open>
		{#snippet header()}
			Prihlásenie
		{/snippet}
		<form>
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
			<div class="flex justify-between w-full px-4 py-2 border-t border-slate-400/30">
				<Button onclick={() => (open = false)} type="reset" style="opaque">Zrušiť</Button>
				<Button type="submit" style="primary">
					<Icon scale="small">
						<Login />
					</Icon>
					Prihlásiť sa
				</Button>
			</div>
		</form>
	</Dialog>
{/if}
