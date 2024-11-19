<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import Checkbox from '$lib/components/forms/Checkbox.svelte';
	import Combobox from '$lib/components/forms/ComboboxZakaznik.svelte';
	import Label from '$lib/components/forms/Label.svelte';
	import NumberInput from '$lib/components/forms/NumberInput.svelte';
	import Radio from '$lib/components/forms/Radio.svelte';
	import TextInput from '$lib/components/forms/TextInput.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Bars3 from '$lib/icons/Bars3.svelte';
	import ChevronDown from '$lib/icons/ChevronDown.svelte';
	import ChevronUp from '$lib/icons/ChevronUp.svelte';
	import { dropDown, recursiveSearch } from '$lib/util/client';
	import { sineInOut } from 'svelte/easing';
	import { blur, fly } from 'svelte/transition';

	const { data } = $props();
	console.log(data);

	let search: string = $state('');

	let selectedValue = $state('selectCustomer');
	let sortBy = $state('-date');

	let orders = $state(data.objednavky);

	const query = new URLSearchParams($page.url.searchParams.toString());

	$effect(() => {
		query.set('sortBy', sortBy);
		goto(`?${query.toString()}`);
		if(!orders) return;
		orders = orders.sort((a, b) => {
			if (sortBy == 'id') {
				return a.ObjednavkaID - b.ObjednavkaID;
			} else if (sortBy == '-id') {
				return b.ObjednavkaID - a.ObjednavkaID;
			} else if (sortBy == 'customer') {
				if (a.zakaznik.Meno.split(" ").slice(-1).join(" ").toLowerCase() < b.zakaznik.Meno.split(" ").slice(-1).join(" ").toLowerCase()) {
					return -1;
				}
				if (a.zakaznik.Meno.split(" ").slice(-1).join(" ").toLowerCase() > b.zakaznik.Meno.split(" ").slice(-1).join(" ").toLowerCase()) {
					return 1;
				}
				return 0;
			} else if (sortBy == '-customer') {
				if (a.zakaznik.Meno.split(" ").slice(-1).join(" ").toLowerCase() < b.zakaznik.Meno.split(" ").slice(-1).join(" ").toLowerCase()) {
					return 1;
				}
				if (a.zakaznik.Meno.split(" ").slice(-1).join(" ").toLowerCase() > b.zakaznik.Meno.split(" ").slice(-1).join(" ").toLowerCase()) {
					return -1;
				}
				return 0;
			} else if (sortBy == 'products') {
				return (
					a.Produkt.reduce((acc, product) => acc + product.quantity, 0) -
					b.Produkt.reduce((acc, product) => acc + product.quantity, 0)
				);
			} else if (sortBy == '-products') {
				return (
					b.Produkt.reduce((acc, product) => acc + product.quantity, 0) -
					a.Produkt.reduce((acc, product) => acc + product.quantity, 0)
				);
			} else if (sortBy == 'date') {
				return new Date(a.DatumExpedicie).getTime() - new Date(b.DatumExpedicie).getTime();
			} else if (sortBy == '-date') {
				return new Date(b.DatumExpedicie).getTime() - new Date(a.DatumExpedicie).getTime();
			}
			return 0;
		});
	});
	let showTableIndex = $state(true);
	let showTableID = $state(true);
	let showTableCustomer = $state(true);
	let showTableProducts = $state(true);
	let showTableDate = $state(true);
	let showTableExpeditionDate = $state(true);

	let showCreateOrderDialog = $state(false);

	function updateSearch() {
		if (!search.trim().length) return (orders = data.objednavky);
		//Use Recursive Search
		if(!data.objednavky) return;
		orders = data.objednavky.filter((order) => {
			if (recursiveSearch(order.toJSON(), search)) return order;
		});
	}
</script>

<div class="grid grid-cols-12 px-2 pt-12 mx-auto max-w-7xl gap-2">
	<div class="col-span-12">
		<TextInput
			bind:value={search}
			onchange={updateSearch}
			placeholder="Nájdi objednávku"
			type="text"
			id="search"
			name="search"
		/>
	</div>
	<div
		class="col-span-12 md:col-span-12 border rounded border-border-base bg-background-light-1 h-80 overflow-x-auto relative"
	>
		<div
			class="flex items-center justify-between flex-auto w-full px-4 py-2 border-b border-b-background-dark-1 text-text-base bg-background-base sticky top-0 left-0 z-20 overflow-visible"
		>
			<h2>Moje objednávky</h2>
			<div class="flex flex-row gap-2">
				<Dropdown justify="right" id="tableSettings">
					{#snippet button(name = 'tableSettings')}
						<Button
							style="opaque"
							onclick={() => {
								$dropDown == name ? dropDown.set('') : dropDown.set(name);
							}}
						>
							<Icon scale="small">
								<Bars3 />
							</Icon>
						</Button>
					{/snippet}
					<div class="flex flex-col p-2">
						<div class="flex flex-row items-center gap-2">
							<Checkbox bind:checked={showTableIndex} label="Poradové číslo" id="tableIndex" />
						</div>
					</div>
					<div class="flex flex-col p-2">
						<div class="flex flex-row items-center gap-2">
							<Checkbox bind:checked={showTableID} label="ID objednávky" id="tableID" />
						</div>
					</div>
					<div class="flex flex-col p-2">
						<div class="flex flex-row items-center gap-2">
							<Checkbox bind:checked={showTableCustomer} label="Zákazník" id="tableCustomer" />
						</div>
					</div>
					<div class="flex flex-col p-2">
						<div class="flex flex-row items-center gap-2">
							<Checkbox bind:checked={showTableProducts} label="Produkty" id="tableProducts" />
						</div>
					</div>
					<div class="flex flex-col p-2">
						<div class="flex flex-row items-center gap-2">
							<Checkbox bind:checked={showTableDate} label="Dátum vytvorenia" id="tableDate" />
						</div>
					</div>
				</Dropdown>
				<Button onclick={() => (showCreateOrderDialog = true)} style="primary"
					>Vytvoriť objednávku</Button
				>
			</div>
		</div>
		<table class="min-w-full divide-y divide-gray-200 w-full overflow-x-auto">
			<thead class="bg-gray-50">
				<tr>
					{#if showTableIndex}
						<th
							transition:blur={{ duration: 500, easing: sineInOut }}
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							#
						</th>
					{/if}
					{#if showTableID}
						<th
							transition:blur={{ duration: 500, easing: sineInOut }}
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							<button
								class="w-full text-left uppercase flex flex-row gap-1 items-center"
								onclick={() => {
									sortBy == 'id' ? (sortBy = '-id') : (sortBy = 'id');
								}}
							>
								ID
								{#if sortBy == 'id'}
									<Icon scale="tiny">
										<ChevronUp />
									</Icon>
								{:else if sortBy == '-id'}
									<Icon scale="tiny">
										<ChevronDown />
									</Icon>
								{/if}
							</button>
						</th>
					{/if}
					{#if showTableCustomer}
						<th
							transition:blur={{ duration: 500, easing: sineInOut }}
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							style="width: 20%;"
						>
							<button
								class="w-full text-left uppercase flex flex-row gap-1 items-center"
								onclick={() => {
									sortBy == 'customer' ? (sortBy = '-customer') : (sortBy = 'customer');
								}}
							>
								Zákazník
								{#if sortBy == 'customer'}
									<Icon scale="tiny">
										<ChevronUp />
									</Icon>
								{:else if sortBy == '-customer'}
									<Icon scale="tiny">
										<ChevronDown />
									</Icon>
								{/if}
							</button>
						</th>
					{/if}
					{#if showTableProducts}
						<th
							transition:blur={{ duration: 500, easing: sineInOut }}
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							style="width: 50%;"
						>
							<button
								class="w-full text-left uppercase flex flex-row gap-1 items-center"
								onclick={() => {
									sortBy == 'products' ? (sortBy = '-products') : (sortBy = 'products');
								}}
							>
								Produkt - množstvo
								{#if sortBy == 'products'}
									<Icon scale="tiny">
										<ChevronUp />
									</Icon>
								{:else if sortBy == '-products'}
									<Icon scale="tiny">
										<ChevronDown />
									</Icon>
								{/if}
							</button>
						</th>
					{/if}
					{#if showTableExpeditionDate}
						<th
							transition:blur={{ duration: 500, easing: sineInOut }}
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							style="width: 20%;"
						>
							<button
								class="w-full text-left uppercase flex flex-row gap-1 items-center"
								onclick={() => {
									sortBy == 'dateExpedition' ? (sortBy = '-dateExpedition') : (sortBy = 'dateExpedition');
								}}
							>
								Dátum expedície
								{#if sortBy == 'dateExpedition'}
									<Icon scale="tiny">
										<ChevronUp />
									</Icon>
								{:else if sortBy == '-dateExpedition'}
									<Icon scale="tiny">
										<ChevronDown />
									</Icon>
								{/if}
							</button>
						</th>
					{/if}
					{#if showTableDate}
						<th
							transition:blur={{ duration: 500, easing: sineInOut }}
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							style="width: 15%;"
						>
							<button
								class="w-full text-left uppercase flex flex-row gap-1 items-center"
								onclick={() => {
									sortBy == 'date' ? (sortBy = '-date') : (sortBy = 'date');
								}}
							>
								Vytvorené
								{#if sortBy == 'date'}
									<Icon scale="tiny">
										<ChevronUp />
									</Icon>
								{:else if sortBy == '-date'}
									<Icon scale="tiny">
										<ChevronDown />
									</Icon>
								{/if}
							</button>
						</th>
					{/if}
				</tr>
			</thead>
			<tbody class="bg-white divide-y divide-gray-200">
				{#if data.objednavky.length == 0}
					<tr class="h-full">
						<td
							class="px-6 py-4 whitespace-nowrap text-text-light-3 h-full"
							colspan="6"
						>
							Žiadne objednávky
						</td>
					</tr>
				{:else}
				{#key orders}
					{#each orders as order, index}
						<tr
							class="hover:bg-background cursor-pointer"
							onclick={() => (showCreateOrderDialog = true)}
						>
							{#if showTableIndex}
								<td
									transition:blur={{ duration: 500, easing: sineInOut }}
									class="px-6 py-4 whitespace-nowrap text-text-light-3"
								>
									{data.objednavky.length - index}.
								</td>
							{/if}
							{#if showTableID}
								<td
									transition:blur={{ duration: 500, easing: sineInOut }}
									class="px-6 py-4 whitespace-nowrap"
								>
									{order.ObjednavkaID}
								</td>
							{/if}
							{#if showTableCustomer}
								<td
									transition:blur={{ duration: 500, easing: sineInOut }}
									class="px-6 py-4 whitespace-nowrap"
								>
									<div class="text-sm font-medium text-gray-900">
										{order.zakaznik.Meno}
									</div>
								</td>
							{/if}
							{#if showTableProducts}
								<td
									transition:blur={{ duration: 500, easing: sineInOut }}
									class="px-6 py-4 whitespace-nowrap"
								>
									<ul>
										{#each order.Produkt as product}
											<li class="text-sm text-gray-900">{product.name} - {product.quantity}</li>
										{/each}
									</ul>
								</td>
							{/if}
							{#if showTableExpeditionDate}
								<td
									transition:blur={{ duration: 500, easing: sineInOut }}
									class="px-6 py-4 whitespace-nowrap"
								>
									<div class="text-sm text-gray-900">
										{new Date(order.DatumExpedicie).toLocaleDateString('sk')}
									</div>
								</td>
							{/if}
							{#if showTableDate}
								<td
									transition:blur={{ duration: 500, easing: sineInOut }}
									class="px-6 py-4 whitespace-nowrap"
								>
									<div class="text-sm text-gray-900">
										{new Date(order.created_at).toLocaleDateString('sk')}
									</div>
								</td>
							{/if}
						</tr>
					{/each}
				{/key}
				{/if}
			</tbody>
		</table>
	</div>
</div>

<Dialog bind:open={showCreateOrderDialog}>
	{#snippet header()}
		Vytvoriť objednávku
	{/snippet}
	<div>
		<div class="px-4 py-2">
			<div class="flex flex-row flex-nowrap gap-4">
				<div class="flex flex-row gap-1 py-1">
					<Radio
						label="select customer"
						id="selectCustomer"
						name="customer"
						value="selectCustomer"
						bind:group={selectedValue}
					/>
					<Label forInput="selectCustomer">Vybrať zákazníka</Label>
				</div>
				<div class="flex flex-row gap-1 py-1">
					<Radio
						label="create customer"
						id="createCustomer"
						name="customer"
						value="createCustomer"
						bind:group={selectedValue}
					/>
					<Label forInput="createCustomer">Vytvoriť zákazníka</Label>
				</div>
			</div>
		</div>
	</div>
	<form>
		{#if selectedValue == 'selectCustomer'}
			<div class="py-2 px-4">
				<div class="flex flex-col gap-1 py-1">
					<Label forInput="customer">Zákazník</Label>
					<Combobox data={data.zakaznici} id="customer" name="customer" placeholder="Zákazník"/>
				</div>
			</div>
		{:else}
			<div class="py-2 px-4">
				<div class="flex flex-col gap-1 py-1">
					<Label forInput="customer">Zákazník</Label>
					<TextInput type="text" id="customer" name="customer" placeholder="Zákazník" />
				</div>
				<div class="flex flex-col gap-1 py-1">
					<Label forInput="product">Produkt</Label>
					<TextInput type="text" id="product" name="product" placeholder="Produkt" />
				</div>
				<div class="flex flex-col gap-1 py-1">
					<Label forInput="quantity">Množstvo</Label>
					<NumberInput min={0} max={10} id="quantity" name="quantity" placeholder="Množstvo" />
				</div>
			</div>
		{/if}
	</form>
	<form>
		<div class="px-4 py-2">
			<div class="flex flex-col gap-1 py-1">
				<Label forInput="password">Password</Label>
				<TextInput type="password" id="password" name="password" placeholder="Password" />
			</div>
		</div>
		<div class="flex justify-between w-full px-4 py-2 border-t border-slate-400/30">
			<Button onclick={() => (showCreateOrderDialog = false)} type="reset" style="opaque"
				>Zrušiť</Button
			>
		</div>
	</form>
</Dialog>
