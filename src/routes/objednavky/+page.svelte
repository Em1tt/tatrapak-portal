<script lang="ts">
	import TextInput from '$lib/components/forms/TextInput.svelte';

	let search: string = '';

	let data = {
		orders: [
			{
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
			}
		]
	};

	let sortColumn: string = '';
	let sortOrder: 'asc' | 'desc' = 'asc';

	function sortData(column: string) {
		if (sortColumn === column) {
			sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			sortColumn = column;
			sortOrder = 'asc';
		}
		data.orders.sort((a, b) => {
			if (a[column] < b[column]) return sortOrder === 'asc' ? -1 : 1;
			if (a[column] > b[column]) return sortOrder === 'asc' ? 1 : -1;
			return 0;
		});
	}
</script>

<div class="grid grid-cols-12 px-2 pt-12 mx-auto max-w-7xl gap-2">
	<div class="col-span-12">
		<TextInput
			bind:value={search}
			placeholder="Nájdi objednávku"
			type="text"
			id="search"
			name="search"
		/>
	</div>
	<div
		class="col-span-12 md:col-span-3 border rounded border-border-base h-80 bg-background-light-1"
	>
		<div
			class="flex items-center justify-between flex-auto w-full px-4 py-2 border-b border-b-background-dark-1 text-text-base bg-background-base"
		>
			<h2>Filter</h2>
		</div>
	</div>
	<div class="col-span-12 md:col-span-9 border rounded border-border-base bg-background-light-1">
		<div
			class="flex items-center justify-between flex-auto w-full px-4 py-2 border-b border-b-background-dark-1 text-text-base bg-background-base"
		>
			<h2>Moje objednávky</h2>
		</div>
		<table class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					<th
						class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
					>
						<button class="w-full text-left uppercase">#</button>
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						style="width: 20%;"
					>
						<button class="w-full text-left uppercase">Zákazník</button>
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						style="width: 50%;"
					>
						<button class="w-full text-left uppercase">Products</button>
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						style="width: 20%;"
					>
						<button class="w-full text-left uppercase">Date</button>
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						style="width: 10%;"
					>
						<button class="w-full text-left uppercase">Actions</button>
					</th>
				</tr>
			</thead>
			<tbody class="bg-white divide-y divide-gray-200">
				{#each data.orders as order, index}
					<tr>
						<td class="px-6 py-4 whitespace-nowrap">
							{data.orders.length - index}.
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm font-medium text-gray-900">
								{order.customer.name}
								{order.customer.surname}
							</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<ul>
								{#each order.products as product}
									<li class="text-sm text-gray-900">{product.name} - {product.quantity}</li>
								{/each}
							</ul>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm text-gray-900">{new Date(order.date).toLocaleDateString()}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
							<a href="/" class="text-indigo-600 hover:text-indigo-900">Edit</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
