<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import Checkbox from '$lib/components/forms/Checkbox.svelte';
	import Label from '$lib/components/forms/Label.svelte';
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

	let search: string = $state("");

	let dataa = {
		orders: [
			{
				id: 1,
				customer: {
					id: 1,
					name: 'Richard',
					surname: 'Marcinčák'
				},
				products: [
					{
						id: 1,
						name: 'test',
						quantity: 154
					},
					{
						id: 2,
						name: 'produkt2',
						quantity: 2000
					}
				],
				date: new Date().getTime()
			},
			{
				id: 2,
				customer: {
					id: 2,
					name: 'Anna',
					surname: 'Nováková'
				},
				products: [
					{
						id: 3,
						name: 'produkt3',
						quantity: 300
					},
					{
						id: 4,
						name: 'produkt4',
						quantity: 4000
					}
				],
				date: new Date().getTime()
			},
			{
				id: 3,
				customer: {
					id: 3,
					name: 'John',
					surname: 'Doe'
				},
				products: [
					{
						id: 5,
						name: 'produkt5',
						quantity: 500
					},
					{
						id: 6,
						name: 'produkt6',
						quantity: 6000
					}
				],
				date: new Date().getTime()
			},
			{
				id: 4,
				customer: {
					id: 1,
					name: 'Richard',
					surname: 'Marcinčák'
				},
				products: [
					{
						id: 1,
						name: 'test',
						quantity: 150
					},
					{
						id: 2,
						name: 'produkt2',
						quantity: 2000
					}
				],
				date: new Date().getTime()
			},
			{
				id: 5,
				customer: {
					id: 2,
					name: 'Anna',
					surname: 'Nováková'
				},
				products: [
					{
						id: 3,
						name: 'produkt3',
						quantity: 300
					},
					{
						id: 4,
						name: 'produkt4',
						quantity: 4000
					}
				],
				date: new Date().getTime()
			},
			{
				id: 6,
				customer: {
					id: 3,
					name: 'John',
					surname: 'Doe'
				},
				products: [
					{
						id: 5,
						name: 'produkt5',
						quantity: 500
					},
					{
						id: 6,
						name: 'produkt6',
						quantity: 6000
					}
				],
				date: new Date().getTime()
			},
			{
				id: 7,
				customer: {
					id: 1,
					name: 'Richard',
					surname: 'Marcinčák'
				},
				products: [
					{
						id: 1,
						name: 'test',
						quantity: 150
					},
					{
						id: 2,
						name: 'produkt2',
						quantity: 2000
					}
				],
				date: new Date().getTime()
			},
			{
				id: 8,
				customer: {
					id: 2,
					name: 'Anna',
					surname: 'Nováková'
				},
				products: [
					{
						id: 3,
						name: 'produkt3',
						quantity: 300
					},
					{
						id: 4,
						name: 'produkt4',
						quantity: 4000
					}
				],
				date: new Date().getTime()
			},
			{
				id: 9,
				customer: {
					id: 3,
					name: 'John',
					surname: 'Doe'
				},
				products: [
					{
						id: 5,
						name: 'produkt5',
						quantity: 500
					},
					{
						id: 6,
						name: 'produkt6',
						quantity: 6000
					}
				],
				date: new Date().getTime()
			},
			{
				id: 10,
				customer: {
					id: 1,
					name: 'Richard',
					surname: 'Marcinčák'
				},
				products: [
					{
						id: 1,
						name: 'test',
						quantity: 150
					},
					{
						id: 2,
						name: 'produkt2',
						quantity: 2000
					}
				],
				date: new Date().getTime()
			},
			{
				id: 11,
				customer: {
					id: 2,
					name: 'Anna',
					surname: 'Nováková'
				},
				products: [
					{
						id: 3,
						name: 'produkt3',
						quantity: 300
					},
					{
						id: 4,
						name: 'produkt4',
						quantity: 4000
					}
				],
				date: new Date().getTime()
			},
			{
				id: 12,
				customer: {
					id: 3,
					name: 'John',
					surname: 'Doe'
				},
				products: [
					{
						id: 5,
						name: 'produkt5',
						quantity: 500
					},
					{
						id: 6,
						name: 'produkt6',
						quantity: 6000
					}
				],
				date: new Date().getTime()
			},
			{
				id: 13,
				customer: {
					id: 1,
					name: 'Richard',
					surname: 'Marcinčák'
				},
				products: [
					{
						id: 1,
						name: 'test',
						quantity: 150
					},
					{
						id: 2,
						name: 'produkt2',
						quantity: 2000
					}
				],
				date: new Date().getTime()
			},
			{
				id: 14,
				customer: {
					id: 2,
					name: 'Anna',
					surname: 'Nováková'
				},
				products: [
					{
						id: 3,
						name: 'produkt3',
						quantity: 300
					},
					{
						id: 4,
						name: 'produkt4',
						quantity: 4000
					}
				],
				date: new Date().getTime()
			},
			{
				id: 15,
				customer: {
					id: 3,
					name: 'John',
					surname: 'Doe'
				},
				products: [
					{
						id: 5,
						name: 'produkt5',
						quantity: 500
					},
					{
						id: 6,
						name: 'produkt6',
						quantity: 6000
					}
				],
				date: new Date().getTime()
			},
			{
				id: 16,
				customer: {
					id: 1,
					name: 'Richard',
					surname: 'Marcinčák'
				},
				products: [
					{
						id: 1,
						name: 'test',
						quantity: 150
					},
					{
						id: 2,
						name: 'produkt2',
						quantity: 2000
					}
				],
				date: new Date().getTime()
			},
			{
				id: 17,
				customer: {
					id: 2,
					name: 'Anna',
					surname: 'Nováková'
				},
				products: [
					{
						id: 3,
						name: 'produkt3',
						quantity: 300
					},
					{
						id: 4,
						name: 'produkt4',
						quantity: 4000
					}
				],
				date: 1532960000000
			},
			{
				id: 18,
				customer: {
					id: 3,
					name: 'John',
					surname: 'Doe'
				},
				products: [
					{
						id: 5,
						name: 'produkt5',
						quantity: 500
					},
					{
						id: 6,
						name: 'produkt6',
						quantity: 6000
					}
				],
				date: 1632960000000
			}
		]
	};

	let sortBy = $state('-date');

	let orders = $state(dataa.orders);

	const query = new URLSearchParams($page.url.searchParams.toString());

	$effect(() => {
		query.set('sortBy', sortBy);
		goto(`?${query.toString()}`);
		orders = orders.sort((a, b) => {
			if (sortBy == 'id') {
				return a.id - b.id;
			} else if (sortBy == '-id') {
				return b.id - a.id;
			} else if (sortBy == 'customer') {
				if (a.customer.surname.toLowerCase() < b.customer.surname.toLowerCase()) {
					return -1;
				}
				if (a.customer.surname.toLowerCase() > b.customer.surname.toLowerCase()) {
					return 1;
				}
				return 0;
			} else if (sortBy == '-customer') {
				if (a.customer.surname.toLowerCase() < b.customer.surname.toLowerCase()) {
					return 1;
				}
				if (a.customer.surname.toLowerCase() > b.customer.surname.toLowerCase()) {
					return -1;
				}
				return 0;
			} else if (sortBy == 'products') {
				return (
					a.products.reduce((acc, product) => acc + product.quantity, 0) -
					b.products.reduce((acc, product) => acc + product.quantity, 0)
				);
			} else if (sortBy == '-products') {
				return (
					b.products.reduce((acc, product) => acc + product.quantity, 0) -
					a.products.reduce((acc, product) => acc + product.quantity, 0)
				);
			} else if (sortBy == 'date') {
				return new Date(a.date).getTime() - new Date(b.date).getTime();
			} else if (sortBy == '-date') {
				return new Date(b.date).getTime() - new Date(a.date).getTime();
			}
			return 0;
		});
	});
	let showTableIndex = $state(true);
	let showTableID = $state(true);
	let showTableCustomer = $state(true);
	let showTableProducts = $state(true);
	let showTableDate = $state(true);

	let showCreateOrderDialog = $state(false);

	function updateSearch(){
		if(!search.trim().length) return orders = dataa.orders;
		//Use Recursive Search
		orders = dataa.orders.filter((order) => {
			if(recursiveSearch(order, search)) return order;
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
	<div class="col-span-12 md:col-span-12 border rounded border-border-base bg-background-light-1 overflow-x-auto relative">
		<div
			class="flex items-center justify-between flex-auto w-full px-4 py-2 border-b border-b-background-dark-1 text-text-base bg-background-base sticky top-0 left-0 z-20"
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
							<Checkbox bind:checked={showTableDate} label="Dátum" id="tableDate" />
						</div>
					</div>
				</Dropdown>
				<Button onclick={() => showCreateOrderDialog = true} style="primary">Vytvoriť objednávku</Button>
			</div>
		</div>
		<table class="min-w-full divide-y divide-gray-200 w-full overflow-x-auto">
			<thead class="bg-gray-50">
				<tr>
					{#if showTableIndex}
						<th transition:blur={{duration: 500, easing: sineInOut}}
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							#
						</th>
					{/if}
					{#if showTableID}
					<th transition:blur={{duration: 500, easing: sineInOut}}
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
					<th transition:blur={{duration: 500, easing: sineInOut}}
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
					<th transition:blur={{duration: 500, easing: sineInOut}}
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
					{#if showTableDate}
					<th transition:blur={{duration: 500, easing: sineInOut}}
						class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						style="width: 20%;"
					>
						<button
							class="w-full text-left uppercase flex flex-row gap-1 items-center"
							onclick={() => {
								sortBy == 'date' ? (sortBy = '-date') : (sortBy = 'date');
							}}
						>
							Date
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
					<th
						class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						style="width: 10%;"
					>
						Činnosť
					</th>
				</tr>
			</thead>
			<tbody class="bg-white divide-y divide-gray-200">
				{#key orders}
					{#each orders as order, index}
						<tr class="hover:bg-background">
							{#if showTableIndex}
								<td transition:blur={{duration: 500, easing: sineInOut}} class="px-6 py-4 whitespace-nowrap text-text-light-3">
									{dataa.orders.length - index}.
								</td>
							{/if}
							{#if showTableID}
							<td transition:blur={{duration: 500, easing: sineInOut}} class="px-6 py-4 whitespace-nowrap">
								{order.id}
							</td>
							{/if}
							{#if showTableCustomer}
							<td transition:blur={{duration: 500, easing: sineInOut}} class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900">
									{order.customer.name}
									{order.customer.surname}
								</div>
							</td>
							{/if}
							{#if showTableProducts}
							<td transition:blur={{duration: 500, easing: sineInOut}} class="px-6 py-4 whitespace-nowrap">
								<ul>
									{#each order.products as product}
										<li class="text-sm text-gray-900">{product.name} - {product.quantity}</li>
									{/each}
								</ul>
							</td>
							{/if}
							{#if showTableDate}
							<td transition:blur={{duration: 500, easing: sineInOut}} class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900">{new Date(order.date).toLocaleDateString("sk")}</div>
							</td>
							{/if}
							<td transition:blur={{duration: 500, easing: sineInOut}} class="px-6 py-4 whitespace-nowrap text-sm font-medium">
								<a href="/" class="text-indigo-600 hover:text-indigo-900">Zmeniť</a>
							</td>
						</tr>
					{/each}
				{/key}
			</tbody>
		</table>
	</div>
</div>

<Dialog bind:open={showCreateOrderDialog}>
	{#snippet header()}
			Vytvoriť objednávku
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
			<Button onclick={() => (showCreateOrderDialog = false)} type="reset" style="opaque">Zrušiť</Button>
		</div>
	</form>
</Dialog>