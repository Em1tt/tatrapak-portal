<script>
	import Login from "$lib/icons/Login.svelte";
	import Button from "./Button.svelte";
	import Dialog from "./Dialog.svelte";
	import Icon from "./Icon.svelte";

    let open = $state(false);
</script>
<div class="flex flex-col w-full border border-b-background-dark-1 bg-background">
    <div class="w-full max-w-7xl mx-auto py-1 px-2 flex flex-row justify-between items-center">
        <a href="/">
            <img src="/tatrapak.png" alt="Tatrapak logo" width="120">
        </a>
        <Button style="primary" onclick={() => open = true}>Prihlásiť sa</Button>
    </div>
    <div class="w-full"></div>
</div>

<Dialog bind:open>
    {#snippet header()}
        Prihlásenie
    {/snippet}
	<div class="p-2">
		<div class="p-2">
            <input type="email" placeholder="E-mail" class="w-full border border-slate-400/30 rounded p-2">
        </div>
        <div class="p-2">
            <input type="password" placeholder="Heslo" class="w-full border border-slate-400/30 rounded p-2">
        </div>
	</div>
	<div class="p-2 w-full border-t border-slate-400/30 flex justify-between">
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