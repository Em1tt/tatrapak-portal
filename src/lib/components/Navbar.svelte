<script>
	import Login from "$lib/icons/Login.svelte";
	import TextInput from "$lib/components/inputs/TextInput.svelte";
	import Button from "./Button.svelte";
	import Dialog from "./Dialog.svelte";
	import Icon from "./Icon.svelte";
	import { getAvatar } from "$lib/util/client";
	import Chevron from "$lib/icons/Chevron.svelte";
	import Dropdown from "./Dropdown.svelte";

    let open = $state(false);

	let authenticated = true;

	
</script>
<div class="flex flex-col w-full border border-b-background-dark-1 bg-background fixed top-0 left-0">
    <div class="flex flex-row items-center justify-between w-full px-2 py-1 mx-auto max-w-7xl">
        <a href="/">
            <img src="/tatrapak.png" alt="Tatrapak logo" width="120">
        </a>
		{#if authenticated}
		<Dropdown>
			{#snippet button()}
			<Button style="opaque">
				<img src={getAvatar("Richard Marcinčák")} width="40" alt="User initials">
				<div class="flex flex-col flex-nowrap justify-center items-start gap-0 leading-tight">
					<p class="text-text-base text-sm leading-tight">Richard Marcinčák</p>
					<p class="text-text-light-2 text-xs leading-tight">Obchoďák</p>
				</div>
				<div>
					<Icon scale="small">
						<Chevron/>
					</Icon>
				</div>
			</Button>
			{/snippet}
			<ul>
				<li>test</li>
				<li>test</li>
				<li>test</li>
				<li>test</li>
			</ul>
		</Dropdown>
		{:else}
        <Button style="primary" onclick={() => open = true}>Prihlásiť sa</Button>
		{/if}
    </div>
    <div class="w-full"></div>
</div>

{#if !authenticated}
<Dialog bind:open>
    {#snippet header()}
        Prihlásenie
    {/snippet}
	<div class="px-4 py-2">
		<div class="flex flex-col gap-1 py-1">
			<label for="email" class="text-text-light-2">E-Mail</label>
			<TextInput error="test" type="email" id="email" name="email" placeholder="E-Mail"/>
        </div>
        <div class="flex flex-col gap-1 py-1">
			<label for="password" class="text-text-light-2">Password</label>
			<TextInput type="password" id="password" name="password" placeholder="Password"/>
        </div>
	</div>
	<div class="flex justify-between w-full px-4 py-2 border-t border-slate-400/30">
		<Button onclick={() => open = false} type="reset" style="opaque">
			Zrušiť
		</Button>
		<Button type="submit" style="primary">
			<Icon scale="small">
				<Login/>
			</Icon>
			Prihlásiť sa
		</Button>
	</div>
</Dialog>
{/if}