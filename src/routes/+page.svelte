<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import Checkbox from '$lib/components/forms/Checkbox.svelte';
	import ComboboxZakaznik from '$lib/components/forms/ComboboxZakaznik.svelte';
	import ComboboxProdukt from '$lib/components/forms/ComboboxProdukt.svelte';
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
	import { blur } from 'svelte/transition';
	import { applyAction, enhance } from '$app/forms';
	import DateInput from '$lib/components/forms/DateInput.svelte';
	import type { Objednavka } from '$lib/server/models.js';

	import { toast } from 'svelte-french-toast';
	import Select from '$lib/components/forms/Select.svelte';

	const { data } = $props();

	let search: string = $state('');

	let selectedValue = $state('selectCustomer');
	let sortBy = $state('-date');

	$effect(() => {
		orders = data.objednavky;
	});

	const user = data.user;

	let orders = $state(data.objednavky);

	const query = new URLSearchParams($page.url.searchParams.toString());

	$effect(() => {
		query.set('sortBy', sortBy);
		goto(`?${query.toString()}`);
		if (!orders) return;
		orders = orders.sort((a, b) => {
			if (sortBy == 'id') {
				return a.ObjednavkaID - b.ObjednavkaID;
			} else if (sortBy == '-id') {
				return b.ObjednavkaID - a.ObjednavkaID;
			} else if (sortBy == 'customer') {
				if (
					a.zakaznik.Meno.split(' ').slice(-1).join(' ').toLowerCase() <
					b.zakaznik.Meno.split(' ').slice(-1).join(' ').toLowerCase()
				) {
					return -1;
				}
				if (
					a.zakaznik.Meno.split(' ').slice(-1).join(' ').toLowerCase() >
					b.zakaznik.Meno.split(' ').slice(-1).join(' ').toLowerCase()
				) {
					return 1;
				}
				return 0;
			} else if (sortBy == '-customer') {
				if (
					a.zakaznik.Meno.split(' ').slice(-1).join(' ').toLowerCase() <
					b.zakaznik.Meno.split(' ').slice(-1).join(' ').toLowerCase()
				) {
					return 1;
				}
				if (
					a.zakaznik.Meno.split(' ').slice(-1).join(' ').toLowerCase() >
					b.zakaznik.Meno.split(' ').slice(-1).join(' ').toLowerCase()
				) {
					return -1;
				}
				return 0;
			} else if (sortBy == 'status') {
				//Sort by status: prijata, vo vyrobe, expedovana in this order
				if (a.Stav == 'prijata' && b.Stav == 'vo vyrobe') {
					return -1;
				} else if (a.Stav == 'vo vyrobe' && b.Stav == 'prijata') {
					return 1;
				} else if (a.Stav == 'prijata' && b.Stav == 'expedovana') {
					return -1;
				} else if (a.Stav == 'expedovana' && b.Stav == 'prijata') {
					return 1;
				} else if (a.Stav == 'vo vyrobe' && b.Stav == 'expedovana') {
					return -1;
				} else if (a.Stav == 'expedovana' && b.Stav == 'vo vyrobe') {
					return 1;
				}
			} else if (sortBy == '-status') {
				if (a.Stav == 'prijata' && b.Stav == 'vo vyrobe') {
					return 1;
				} else if (a.Stav == 'vo vyrobe' && b.Stav == 'prijata') {
					return -1;
				} else if (a.Stav == 'prijata' && b.Stav == 'expedovana') {
					return 1;
				} else if (a.Stav == 'expedovana' && b.Stav == 'prijata') {
					return -1;
				} else if (a.Stav == 'vo vyrobe' && b.Stav == 'expedovana') {
					return 1;
				} else if (a.Stav == 'expedovana' && b.Stav == 'vo vyrobe') {
					return -1;
				}
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
				return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
			} else if (sortBy == '-date') {
				return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
			} else if (sortBy == 'dateExpedition') {
				return new Date(a.DatumExpedicie).getTime() - new Date(b.DatumExpedicie).getTime();
			} else if (sortBy == '-dateExpedition') {
				return new Date(b.DatumExpedicie).getTime() - new Date(a.DatumExpedicie).getTime();
			}
			return 0;
		});
	});
	let showTableIndex = $state(true);
	let showTableID = $state(true);
	let showTableCustomer = $state(true);
	let showTableProducts = $state(true);
	let showTableStatus = $state(true);
	let showTablePouzivatel = $state(true);
	let showTableDate = $state(true);
	let showTableExpeditionDate = $state(true);

	let showCreateOrderDialog = $state(false);
	let showEditOrderDialog = $state(false);
	let editingObjednavka: Objednavka | null = $state(null);

	function updateSearch() {
		if (!search.trim().length) return (orders = data.objednavky);
		//Use Recursive Search
		if (!data.objednavky) return;
		orders = data.objednavky.filter((order) => {
			if (recursiveSearch(JSON.parse(JSON.stringify(order)), search)) return order;
		});
	}

	let productIDs = $state([0]);
	let selectedValueProducts: { [key: string]: any } = $state({
		produkt0: 'selectProduct0'
	});

	function addProduct() {
		let i = 0;
		while (productIDs.includes(i)) i++;
		productIDs.push(i);
		selectedValueProducts[`produkt${i}`] = `selectProduct${i}`;
	}

	function removeProduct() {
		if (productIDs.length == 1) return;
		productIDs.pop();
		delete selectedValueProducts[`produkt${productIDs.length + 1}`];
	}

	let validate: string[] = $state([]);

	$effect(() => {
		validate.forEach((i) => {
			$inspect(i);
			(document.getElementById(i) as HTMLInputElement).setCustomValidity('Chybné pole');
		});
	});

	function openEditOrderDialog(order: Objednavka) {
		productError = '';
		editingObjednavka = order;
		showEditOrderDialog = true;
		selectedValue = 'selectCustomer';
		productIDs = order.Produkt.map((_, i) => i);
		selectedValueProducts = order.Produkt.reduce((acc: { [key: string]: any }, _, i) => {
			acc[`produkt${i}`] = `selectProduct${i}`;
			return acc;
		}, {});
	}

	let productError: string | unknown = $state('');
	let productErrorType: string | unknown = $state('');
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
		class="col-span-12 md:col-span-12 border rounded min-h-80 border-border-base bg-background-light-1 overflow-x-auto relative"
	>
		<div
			class="flex justify-between bg-background-light-1 flex-auto w-full px-4 py-2 border-b border-b-background-dark-1 text-text-base bg-background-base sticky top-0 left-0 z-20 overflow-visible items-center"
		>
			<h2 class="hidden sm:block">
				{user?.Rola == 'obchodnik' ? 'Moje objednávky' : 'Prijaté objednávky'}
			</h2>
			<div class="flex flex-row gap-2">
				<Dropdown justify="right" id="tableSettings">
					{#snippet button(name = 'tableSettings')}
						<Button
							type="button"
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
							<Checkbox bind:checked={showTableStatus} label="Stav" id="tableStatus" />
						</div>
					</div>
					{#if user?.Rola != 'obchodnik'}
						<div class="flex flex-col p-2">
							<div class="flex flex-row items-center gap-2">
								<Checkbox
									bind:checked={showTablePouzivatel}
									label="Používateľ"
									id="tablePouzivatel"
								/>
							</div>
						</div>
					{/if}
					<div class="flex flex-col p-2">
						<div class="flex flex-row items-center gap-2">
							<Checkbox
								bind:checked={showTableExpeditionDate}
								label="Dátum expedície"
								id="tableExpeditionDate"
							/>
						</div>
					</div>
					<div class="flex flex-col p-2">
						<div class="flex flex-row items-center gap-2">
							<Checkbox bind:checked={showTableDate} label="Dátum vytvorenia" id="tableDate" />
						</div>
					</div>
				</Dropdown>
				{#if user?.Rola != 'vyroba'}
					<Button type="button" onclick={() => (showCreateOrderDialog = true)} style="primary"
						>Vytvoriť objednávku</Button
					>
				{/if}
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
								type="button"
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
								type="button"
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
							style="width: 40%;"
						>
							<button
								type="button"
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
					{#if showTableStatus}
						<th
							transition:blur={{ duration: 500, easing: sineInOut }}
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							<button
								type="button"
								class="w-full text-left uppercase flex flex-row gap-1 items-center"
								onclick={() => {
									sortBy == 'status' ? (sortBy = '-status') : (sortBy = 'status');
								}}
							>
								Stav
								{#if sortBy == 'status'}
									<Icon scale="tiny">
										<ChevronUp />
									</Icon>
								{:else if sortBy == '-status'}
									<Icon scale="tiny">
										<ChevronDown />
									</Icon>
								{/if}
							</button>
						</th>
					{/if}
					{#if user?.Rola != 'obchodnik' && showTablePouzivatel}
						<th
							transition:blur={{ duration: 500, easing: sineInOut }}
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							<button
								type="button"
								class="w-full text-left uppercase flex flex-row gap-1 items-center"
								onclick={() => {
									sortBy == 'user' ? (sortBy = '-user') : (sortBy = 'user');
								}}
							>
								Vytvoril
								{#if sortBy == 'user'}
									<Icon scale="tiny">
										<ChevronUp />
									</Icon>
								{:else if sortBy == '-user'}
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
								type="button"
								class="w-full text-left uppercase flex flex-row gap-1 items-center"
								onclick={() => {
									sortBy == 'dateExpedition'
										? (sortBy = '-dateExpedition')
										: (sortBy = 'dateExpedition');
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
								type="button"
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
						<td class="px-6 py-4 whitespace-nowrap text-text-light-3 h-full" colspan="8">
							Žiadne objednávky
						</td>
					</tr>
				{:else}
					{#key orders}
						{#each orders as order, index}
							<tr
								class="hover:bg-background {order.Stav == 'prijata' ||
								user?.Rola == 'vyroba' ||
								user?.Rola == 'spravca'
									? order.Stav == 'expedovana'
										? ''
										: 'cursor-pointer'
									: ''}"
								onclick={() => {
									if (order.Stav == 'prijata') {
										openEditOrderDialog(order);
									} else {
										if (user?.Rola == 'vyroba' || user?.Rola == 'spravca') {
											if (order.Stav == 'expedovana') {
												toast.error('Objednávka už bola spracovaná.', {
													duration: 4000,
													position: 'bottom-right'
												});
											} else {
												openEditOrderDialog(order);
											}
										} else {
											toast.error('Objednávka už bola spracovaná.', {
												duration: 4000,
												position: 'bottom-right'
											});
										}
									}
								}}
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
												{#if product.oddelenie == user?.OddelenieID || user?.Rola != 'vyroba'}
													<li class="text-sm text-gray-900">{product.name} - {product.quantity}</li>
												{/if}
											{/each}
										</ul>
									</td>
								{/if}
								{#if showTableStatus}
									<td
										transition:blur={{ duration: 500, easing: sineInOut }}
										class="px-6 py-4 whitespace-nowrap"
									>
										<div class="flex">
											{#if order.Stav == 'prijata'}
												<div
													class="border text-sm bg-secondary-base border-secondary-dark-1/30 px-2 py-0.5 rounded"
												>
													Prijatá
												</div>
											{:else if order.Stav == 'vo vyrobe'}
												<div
													class="border text-sm bg-warning-base border-warning-dark-1/30 px-2 py-0.5 rounded"
												>
													Vo výrobe
												</div>
											{:else}
												<div
													class="border text-sm bg-primary-base border-primary-dark-1/30 px-2 py-0.5 rounded"
												>
													Expedovaná
												</div>
											{/if}
										</div>
									</td>
								{/if}
								{#if user?.Rola != 'obchodnik' && showTablePouzivatel}
									<td
										transition:blur={{ duration: 500, easing: sineInOut }}
										class="px-6 py-4 whitespace-nowrap"
									>
										<div class="text-sm text-gray-900">
											{order.pouzivatel.Meno}
										</div>
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
										<div class="text-xs text-text-light-3">
											{new Date(order.created_at).toLocaleTimeString('sk')}
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

<Dialog bind:open={showEditOrderDialog}>
	{#snippet header()}
		{#if user?.Rola == 'obchodnik'}
			Zmeniť objednávku
		{:else}
			Detail objednávky
		{/if}
	{/snippet}
	<form
		method="POST"
		action={user?.Rola == 'vyroba' ? '/?/editOrderVyroba' : '/?/editOrder'}
		use:enhance={async ({ formData }) => {
			formData.append('orderID', editingObjednavka?.ObjednavkaID.toString() ?? '');
			return async ({ result }) => {
				if (result.type === 'failure') {
					productError = result.data?.message;
					if (result.data?.errorArea) productErrorType = result.data?.errorArea;
					else productErrorType = '';
					if (Array.isArray(result.data?.validate)) validate = result.data?.validate;
				} else {
					await invalidateAll();
					toast.success('Objednávka bola zmenená.', {
						duration: 3000,
						position: 'bottom-right'
					});
					showEditOrderDialog = false;
					editingObjednavka = null;
					await applyAction(result);
				}
			};
		}}
	>
		{#if user?.Rola != 'vyroba'}
			<div>
				<div class="px-4 py-2">
					<div class="flex flex-row flex-wrap gap-4">
						<div class="flex flex-row gap-1 py-1">
							<Radio
								label="select customer"
								id="selectCustomer"
								name="customer_type"
								value="selectCustomer"
								bind:group={selectedValue}
							/>
							<Label forInput="selectCustomer">Vybrať zákazníka</Label>
						</div>
						<div class="flex flex-row gap-1 py-1">
							<Radio
								label="create customer"
								id="createCustomer"
								name="customer_type"
								value="createCustomer"
								bind:group={selectedValue}
							/>
							<Label forInput="createCustomer">Vytvoriť zákazníka</Label>
						</div>
					</div>
				</div>
			</div>
		{/if}
		{#if selectedValue == 'selectCustomer'}
			<div class="py-2 px-4">
				<div class="flex flex-col gap-1 py-1">
					<Label forInput="customer">Zákazník</Label>
					<ComboboxZakaznik
						disabled={user?.Rola == 'vyroba'}
						data={data.zakaznici}
						reportedValue={editingObjednavka?.zakaznik.Meno}
						actualValue={editingObjednavka?.zakaznik.ZakaznikID}
						id="customer"
						name="customer"
						placeholder="Meno/E-mail/Telefónne číslo"
					/>
				</div>
				{#if productError && productErrorType == 'customer'}
					<div class="py-2 text-danger-base col-span-2">{productError}</div>
				{/if}
			</div>
		{:else}
			<div class="py-2 px-4 grid grid-cols-2 gap-x-2">
				<div class="flex flex-col gap-1 col-span-2">
					<Label forInput="nameCustomer">Meno zákazníka</Label>
					<TextInput type="text" id="nameCustomer" name="nameCustomer" placeholder="Jozef Mrkva" />
				</div>
				<div class="flex flex-col gap-1 py-1 col-span-2 sm:col-span-1">
					<Label forInput="emailCustomer">E-mail zákazníka (nepovinné)</Label>
					<TextInput
						type="email"
						id="emailCustomer"
						name="emailCustomer"
						placeholder="jozefmrkva@gmail.com"
					/>
				</div>
				<div class="flex flex-col gap-1 py-1 col-span-2 sm:col-span-1">
					<Label forInput="emailCustomer">Telefón zákazníka (nepovinné)</Label>
					<TextInput
						type="text"
						id="telephoneCustomer"
						name="telephoneCustomer"
						placeholder="0123 456 789"
					/>
				</div>
				{#if productError && productErrorType == 'customer'}
					<div class="py-2 text-danger-base col-span-2">{productError}</div>
				{/if}
			</div>
		{/if}
		<hr class="bg-transparent border-background" />
		{#each productIDs.filter((a) => {
			return editingObjednavka?.Produkt[a]?.oddelenie == `${user?.OddelenieID}` || user?.Rola != 'vyroba';
		}) as productID}
			{#if user?.Rola != 'vyroba'}
				<div class="px-4 py-2">
					<div class="flex flex-row flex-wrap gap-4">
						<div class="flex flex-row gap-1 py-1">
							<Radio
								label="select product"
								id="selectProduct{productID}"
								name="product{productID}_type"
								value="selectProduct{productID}"
								bind:group={selectedValueProducts['produkt' + productID]}
							/>
							<Label forInput="selectProduct{productID}">Vybrať produkt</Label>
						</div>
						<div class="flex flex-row gap-1 py-1">
							<Radio
								label="create product"
								id="createProduct{productID}"
								name="product{productID}_type"
								value="createProduct{productID}"
								bind:group={selectedValueProducts['produkt' + productID]}
							/>
							<Label forInput="createProduct{productID}">Vytvoriť produkt</Label>
						</div>
					</div>
				</div>
			{/if}
			{#if selectedValueProducts['produkt' + productID] == `selectProduct${productID}`}
				{#if user?.Rola == 'vyroba'}
					<div class="py-2 px-4 grid grid-cols-12 gap-2">
						<div class="flex flex-col gap-1 py-1 col-span-12 sm:col-span-8">
							<Label forInput="product{productID}">Produkt</Label>
							<ComboboxProdukt
								disabled={true}
								data={data.produkty}
								reportedValue={editingObjednavka?.Produkt[productID]?.name}
								actualValue={editingObjednavka?.Produkt[productID]?.id}
								id="product{productID}"
								name="product{productID}"
								placeholder="Názov / K.č."
							/>
						</div>
						<div class="flex flex-col gap-1 py-1 col-span-12 sm:col-span-2">
							<Label forInput="product{productID}">Množstvo</Label>
							<NumberInput
								disabled={true}
								value={editingObjednavka?.Produkt[productID]?.quantity}
								min={1}
								max={100000}
								id="quantityProduct{productID}"
								name="quantityProduct{productID}"
								placeholder="1"
							/>
						</div>
						<div class="flex-col gap-1 py-1 col-span-12 sm:col-span-4 hidden">
							<Label forInput="departmentProduct{productID}">Oddelenie</Label>
							<Select
								placeholder="Oddelenie"
								value={data.oddelenia.find(
									(i) => `${i.OddelenieID}` == editingObjednavka?.Produkt[productID]?.oddelenie
								)?.Nazov}
								actualValue={editingObjednavka?.Produkt[productID]?.oddelenie}
								id="departmentProduct{productID}"
								name="departmentProduct{productID}"
								data={data.oddelenia.map((i) => {
									return { id: `${i.OddelenieID}`, name: i.Nazov };
								})}
							/>
						</div>
						<div class="flex flex-col gap-1 py-1 col-span-12 sm:col-span-2">
							<Label forInput="departmentProductDone{productID}">Hotové</Label>
							<Checkbox
								label=""
								checked={editingObjednavka?.Produkt[productID]?.vyrobene ?? false}
								id="departmentProductDone{productID}"
							/>
						</div>
						{#if productError && productErrorType == `product${productID}`}
							<div class="text-danger-base col-span-12">{productError}</div>
						{/if}
					</div>
				{:else if user?.Rola == 'obchodnik'}
					<div class="py-2 px-4 grid grid-cols-4 gap-2">
						<div class="flex flex-col gap-1 py-1 col-span-4 sm:col-span-3">
							<Label forInput="product{productID}">Produkt</Label>
							<ComboboxProdukt
								data={data.produkty}
								reportedValue={editingObjednavka?.Produkt[productID]?.name}
								actualValue={editingObjednavka?.Produkt[productID]?.id}
								id="product{productID}"
								name="product{productID}"
								placeholder="Názov / K.č."
							/>
						</div>
						<div class="flex flex-col gap-1 py-1 col-span-4 sm:col-span-1">
							<Label forInput="product{productID}">Množstvo</Label>
							<NumberInput
								value={editingObjednavka?.Produkt[productID]?.quantity}
								min={1}
								max={100000}
								id="quantityProduct{productID}"
								name="quantityProduct{productID}"
								placeholder="1"
							/>
						</div>
						{#if productError && productErrorType == `product${productID}`}
							<div class="text-danger-base col-span-4">{productError}</div>
						{/if}
					</div>
				{:else if user?.Rola == 'administrativny pracovnik' || user?.Rola == "spravca"}
					<div class="py-2 px-4 grid grid-cols-12 gap-2">
						<div class="flex flex-col gap-1 py-1 col-span-12 sm:col-span-6">
							<Label forInput="product{productID}">Produkt</Label>
							<ComboboxProdukt
								data={data.produkty}
								reportedValue={editingObjednavka?.Produkt[productID]?.name}
								actualValue={editingObjednavka?.Produkt[productID]?.id}
								id="product{productID}"
								name="product{productID}"
								placeholder="Názov / K.č."
							/>
						</div>
						<div class="flex flex-col gap-1 py-1 col-span-12 sm:col-span-2">
							<Label forInput="product{productID}">Množstvo</Label>
							<NumberInput
								value={editingObjednavka?.Produkt[productID]?.quantity}
								min={1}
								max={100000}
								id="quantityProduct{productID}"
								name="quantityProduct{productID}"
								placeholder="1"
							/>
						</div>
						<div class="flex flex-col gap-1 py-1 col-span-12 sm:col-span-4">
							<Label forInput="departmentProduct{productID}">Oddelenie</Label>
							<Select
								placeholder="Oddelenie"
								value={data.oddelenia.find(
									(i) => `${i.OddelenieID}` == editingObjednavka?.Produkt[productID]?.oddelenie
								)?.Nazov}
								actualValue={editingObjednavka?.Produkt[productID]?.oddelenie}
								id="departmentProduct{productID}"
								name="departmentProduct{productID}"
								data={data.oddelenia.map((i) => {
									return { id: `${i.OddelenieID}`, name: i.Nazov };
								})}
							/>
						</div>
						{#if productError && productErrorType == `product${productID}`}
							<div class="text-danger-base col-span-12">{productError}</div>
						{/if}
					</div>
				{:else}{/if}
			{:else}
				<div class="py-2 px-4 grid grid-cols-12 gap-x-2">
					<div class="flex flex-col gap-1 py-1 col-span-12 sm:col-span-6">
						<Label forInput="nameProduct{productID}">Názov produktu</Label>
						<TextInput
							type="text"
							id="nameProduct{productID}"
							name="nameProduct{productID}"
							placeholder="Jablko"
						/>
					</div>
					<div class="flex flex-col gap-1 py-1 col-span-12 sm:col-span-6">
						<Label forInput="catalogNumberProduct{productID}">Katalógové číslo</Label>
						<TextInput
							type="text"
							id="catalogNumberProduct{productID}"
							name="catalogNumberProduct{productID}"
							placeholder="0000/0"
						/>
					</div>
					<div class="flex-col gap-1 py-1 col-span-12 sm:col-span-4 hidden">
						<Label forInput="priceProduct{productID}">Cena/ks (€) (nepovinné)</Label>
						<NumberInput
							step="0.001"
							min={0}
							max={1000}
							id="priceProduct{productID}"
							name="priceProduct{productID}"
							placeholder="0.000"
						/>
					</div>
					<div class="flex flex-col gap-1 py-1 col-span-6 sm:col-span-4">
						<Label forInput="weightProduct{productID}">Hmotnosť (g)</Label>
						<NumberInput
							step="0.1"
							min={1}
							max={10000}
							id="weightProduct{productID}"
							name="weightProduct{productID}"
							placeholder="4.5"
						/>
					</div>
					<div class="flex flex-col gap-1 py-1 col-span-6 sm:col-span-4">
						<Label forInput="product{productID}">Množstvo</Label>
						<NumberInput
							min={0}
							max={100000}
							id="quantityProduct{productID}"
							name="quantityProduct{productID}"
							placeholder="1"
						/>
					</div>
					{#if user?.Rola == 'administrativny pracovnik' || user?.Rola == "spravca"}
						<div class="flex flex-col gap-1 py-1 col-span-12">
							<Label forInput="departmentProduct{productID}">Oddelenie</Label>
							<Select
								placeholder="Oddelenie"
								value={data.oddelenia.find(
									(i) => `${i.OddelenieID}` == editingObjednavka?.Produkt[productID]?.oddelenie
								)?.Nazov}
								actualValue={editingObjednavka?.Produkt[productID]?.oddelenie}
								id="departmentProduct{productID}"
								name="departmentProduct{productID}"
								data={data.oddelenia.map((i) => {
									return { id: `${i.OddelenieID}`, name: i.Nazov };
								})}
							/>
						</div>
					{/if}
					{#if productError && productErrorType == `product${productID}`}
						<div class="text-danger-base col-span-12">{productError}</div>
					{/if}
				</div>
			{/if}
			<hr class="bg-transparent border-background" />
		{/each}
		<div class="px-4 py-2">
			{#if user?.Rola != 'vyroba'}
				<div class="flex {productIDs.length > 1 ? 'flex-row' : 'flex-col'} gap-2">
					<Button type="button" style="secondary" textStyle="default" onclick={addProduct}>
						<div class="flex flex-row flex-nowrap justify-center items-center w-full gap-2">
							<p>Pridať produkt</p>
						</div>
					</Button>
					{#if productIDs.length > 1}
						<Button type="button" style="danger" textStyle="default" onclick={removeProduct}>
							<div class="flex flex-row flex-nowrap justify-center items-center w-full gap-2">
								<p>Odstrániť produkt</p>
							</div>
						</Button>
					{/if}
				</div>
			{/if}
			<div class="flex flex-col gap-1 py-1 mt-2">
				<Label forInput="emailCustomer">Dátum expedície</Label>
				<DateInput
					disabled={user?.Rola == 'vyroba'}
					value={editingObjednavka
						? new Date(editingObjednavka.DatumExpedicie)?.toISOString().substring(0, 10)
						: ''}
					placeholder="Dátum expedície"
					id="dateExpedition"
					name="dateExpedition"
				/>
			</div>
		</div>
		{#if productError && productErrorType == ''}
			<div class="px-4 py-2 text-danger-base">{productError}</div>
		{/if}
		<div class="flex justify-between w-full px-4 py-2 border-t border-slate-400/30">
			<div class="flex gap-2">
				<Button onclick={() => (showEditOrderDialog = false)} type="reset" style="opaque"
					>Zrušiť</Button
				>
				{#if user?.Rola != 'vyroba'}
					<Button
						name="submit_button"
						value="delete"
						onclick={() => (showEditOrderDialog = false)}
						type="submit"
						textStyle="default"
						style="danger">Vymazať objednávku</Button
					>
				{/if}
			</div>
			<Button name="submit_button" value="update" type="submit" style="primary"
				>Poslať do výroby</Button
			>
		</div>
	</form>
</Dialog>
{#if user?.Rola != 'vyroba'}
	<Dialog bind:open={showCreateOrderDialog}>
		{#snippet header()}
			Vytvoriť objednávku
		{/snippet}
		<form
			method="POST"
			action="/?/createOrder"
			use:enhance={async () => {
				return async ({ result }) => {
					if (result.type === 'failure') {
						productError = result.data?.message;
						if (result.data?.errorArea) productErrorType = result.data?.errorArea;
						else productErrorType = '';
						if (Array.isArray(result.data?.validate)) validate = result.data?.validate;
					} else {
						await invalidateAll();
						toast.success('Objednávka bola vytvorená', {
							duration: 3000,
							position: 'bottom-right'
						});
						showCreateOrderDialog = false;
						await applyAction(result);
					}
				};
			}}
		>
			<div>
				<div class="px-4 py-2">
					<div class="flex flex-row flex-wrap gap-4">
						<div class="flex flex-row gap-1 py-1">
							<Radio
								label="select customer"
								id="selectCustomer"
								name="customer_type"
								value="selectCustomer"
								bind:group={selectedValue}
							/>
							<Label forInput="selectCustomer">Vybrať zákazníka</Label>
						</div>
						<div class="flex flex-row gap-1 py-1">
							<Radio
								label="create customer"
								id="createCustomer"
								name="customer_type"
								value="createCustomer"
								bind:group={selectedValue}
							/>
							<Label forInput="createCustomer">Vytvoriť zákazníka</Label>
						</div>
					</div>
				</div>
			</div>
			{#if selectedValue == 'selectCustomer'}
				<div class="py-2 px-4">
					<div class="flex flex-col gap-1 py-1">
						<Label forInput="customer">Zákazník</Label>
						<ComboboxZakaznik
							data={data.zakaznici}
							id="customer"
							name="customer"
							placeholder="Meno/E-mail/Telefónne číslo"
						/>
					</div>
					{#if productError && productErrorType == 'customer'}
						<div class="py-2 text-danger-base col-span-2">{productError}</div>
					{/if}
				</div>
			{:else}
				<div class="py-2 px-4 grid grid-cols-2 gap-x-2">
					<div class="flex flex-col gap-1 col-span-2">
						<Label forInput="nameCustomer">Meno zákazníka</Label>
						<TextInput
							type="text"
							id="nameCustomer"
							name="nameCustomer"
							placeholder="Jozef Mrkva"
						/>
					</div>
					<div class="flex flex-col gap-1 py-1 col-span-2 sm:col-span-1">
						<Label forInput="emailCustomer">E-mail zákazníka (nepovinné)</Label>
						<TextInput
							type="email"
							id="emailCustomer"
							name="emailCustomer"
							placeholder="jozefmrkva@gmail.com"
						/>
					</div>
					<div class="flex flex-col gap-1 py-1 col-span-2 sm:col-span-1">
						<Label forInput="emailCustomer">Telefón zákazníka (nepovinné)</Label>
						<TextInput
							type="text"
							id="telephoneCustomer"
							name="telephoneCustomer"
							placeholder="0123 456 789"
						/>
					</div>
					{#if productError && productErrorType == 'customer'}
						<div class="py-2 text-danger-base col-span-2">{productError}</div>
					{/if}
				</div>
			{/if}
			<hr class="bg-transparent border-background" />
			{#each productIDs as productID}
				<div class="px-4 py-2">
					<div class="flex flex-row flex-wrap gap-4">
						<div class="flex flex-row gap-1 py-1">
							<Radio
								label="select product"
								id="selectProduct{productID}"
								name="product{productID}_type"
								value="selectProduct{productID}"
								bind:group={selectedValueProducts['produkt' + productID]}
							/>
							<Label forInput="selectProduct{productID}">Vybrať produkt</Label>
						</div>
						<div class="flex flex-row gap-1 py-1">
							<Radio
								label="create product"
								id="createProduct{productID}"
								name="product{productID}_type"
								value="createProduct{productID}"
								bind:group={selectedValueProducts['produkt' + productID]}
							/>
							<Label forInput="createProduct{productID}">Vytvoriť produkt</Label>
						</div>
					</div>
				</div>
				{#if selectedValueProducts['produkt' + productID] == `selectProduct${productID}`}
					<div class="py-2 px-4 grid grid-cols-4 gap-2">
						<div class="flex flex-col gap-1 py-1 col-span-4 sm:col-span-3">
							<Label forInput="product{productID}">Produkt</Label>
							<ComboboxProdukt
								data={data.produkty}
								id="product{productID}"
								name="product{productID}"
								placeholder="Názov / K.č."
							/>
						</div>
						<div class="flex flex-col gap-1 py-1 col-span-4 sm:col-span-1">
							<Label forInput="product{productID}">Množstvo</Label>
							<NumberInput
								min={1}
								max={100000}
								id="quantityProduct{productID}"
								name="quantityProduct{productID}"
								placeholder="1"
							/>
						</div>
						{#if productError && productErrorType == `product${productID}`}
							<div class="text-danger-base col-span-4">{productError}</div>
						{/if}
					</div>
				{:else}
					<div class="py-2 px-4 grid grid-cols-12 gap-x-2">
						<div class="flex flex-col gap-1 py-1 col-span-12 sm:col-span-6">
							<Label forInput="nameProduct{productID}">Názov produktu</Label>
							<TextInput
								type="text"
								id="nameProduct{productID}"
								name="nameProduct{productID}"
								placeholder="Jablko"
							/>
						</div>
						<div class="flex flex-col gap-1 py-1 col-span-12 sm:col-span-6">
							<Label forInput="catalogNumberProduct{productID}">Katalógové číslo</Label>
							<TextInput
								type="text"
								id="catalogNumberProduct{productID}"
								name="catalogNumberProduct{productID}"
								placeholder="0000/0"
							/>
						</div>
						<div class="hidden flex-col gap-1 py-1 col-span-12">
							<Label forInput="priceProduct{productID}">Cena/ks (€) (nepovinné)</Label>
							<NumberInput
								step="0.001"
								min={0}
								max={1000}
								id="priceProduct{productID}"
								name="priceProduct{productID}"
								placeholder="0.000"
							/>
						</div>
						<div class="flex flex-col gap-1 py-1 col-span-6 sm:col-span-4">
							<Label forInput="weightProduct{productID}">Hmotnosť (g)</Label>
							<NumberInput
								step="0.1"
								min={1}
								max={10000}
								id="weightProduct{productID}"
								name="weightProduct{productID}"
								placeholder="4.5"
							/>
						</div>
						<div class="flex flex-col gap-1 py-1 col-span-6 sm:col-span-4">
							<Label forInput="product{productID}">Množstvo</Label>
							<NumberInput
								min={0}
								max={100000}
								id="quantityProduct{productID}"
								name="quantityProduct{productID}"
								placeholder="1"
							/>
						</div>
						{#if productError && productErrorType == `product${productID}`}
							<div class="text-danger-base col-span-12">{productError}</div>
						{/if}
					</div>
				{/if}
				<hr class="bg-transparent border-background" />
			{/each}
			<div class="px-4 py-2">
				<div class="flex {productIDs.length > 1 ? 'flex-row' : 'flex-col'} gap-2">
					<Button type="button" style="secondary" textStyle="default" onclick={addProduct}>
						<div class="flex flex-row flex-nowrap justify-center items-center w-full gap-2">
							<p>Pridať produkt</p>
						</div>
					</Button>
					{#if productIDs.length > 1}
						<Button type="button" style="danger" textStyle="default" onclick={removeProduct}>
							<div class="flex flex-row flex-nowrap justify-center items-center w-full gap-2">
								<p>Odstrániť produkt</p>
							</div>
						</Button>
					{/if}
				</div>
				<div class="flex flex-col gap-1 py-1 mt-2">
					<Label forInput="emailCustomer">Dátum expedície</Label>
					<DateInput placeholder="Dátum expedície" id="dateExpedition" name="dateExpedition" />
				</div>
			</div>
			{#if productError && productErrorType == ''}
				<div class="px-4 py-2 text-danger-base">{productError}</div>
			{/if}
			<div class="flex justify-between w-full px-4 py-2 border-t border-slate-400/30">
				<Button onclick={() => (showCreateOrderDialog = false)} type="reset" style="opaque"
					>Zrušiť</Button
				>
				<Button style="primary" type="submit">Vytvoriť objednávku</Button>
			</div>
		</form>
	</Dialog>
{/if}
