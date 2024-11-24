<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import Checkbox from '$lib/components/forms/Checkbox.svelte';
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
	import type { Pouzivatel } from '$lib/server/models.js';

	import { toast } from 'svelte-french-toast';
	import Select from '$lib/components/forms/Select.svelte';
	import Check from '$lib/icons/Check.svelte';
	import Cross from '$lib/icons/Cross.svelte';

	const { data } = $props();

	let search: string = $state('');

	let sortBy = $state('-date');

	$effect(() => {
		pouzivatelia = data.pouzivatelia;
	});

	let pouzivatelia = $state(data.pouzivatelia);

	const query = new URLSearchParams($page.url.searchParams.toString());

	let rola: string = $state('');
	let password: string = $state('');

	$effect(() => {
		query.set('sortBy', sortBy);
		goto(`?${query.toString()}`);
		if (!pouzivatelia) return;
		pouzivatelia = pouzivatelia.sort((a, b) => {
			if (sortBy == 'id') {
				return a.PouzivatelID - b.PouzivatelID;
			} else if (sortBy == '-id') {
				return b.PouzivatelID - a.PouzivatelID;
			} else if (sortBy == 'name') {
				if (
					a.Meno.split(' ').slice(-1).join(' ').toLowerCase() <
					b.Meno.split(' ').slice(-1).join(' ').toLowerCase()
				) {
					return -1;
				}
				if (
					a.Meno.split(' ').slice(-1).join(' ').toLowerCase() >
					b.Meno.split(' ').slice(-1).join(' ').toLowerCase()
				) {
					return 1;
				}
				return 0;
			} else if (sortBy == '-name') {
				if (
					a.Meno.split(' ').slice(-1).join(' ').toLowerCase() <
					b.Meno.split(' ').slice(-1).join(' ').toLowerCase()
				) {
					return 1;
				}
				if (
					a.Meno.split(' ').slice(-1).join(' ').toLowerCase() >
					b.Meno.split(' ').slice(-1).join(' ').toLowerCase()
				) {
					return -1;
				}
				return 0;
			} else if (sortBy == 'email') {
				//Sort by string
				if (a.Email.toLowerCase() < b.Email.toLowerCase()) {
					return -1;
				} else {
					return 1;
				}
			} else if (sortBy == '-email') {
				if (a.Email.toLowerCase() < b.Email.toLowerCase()) {
					return 1;
				} else {
					return -1;
				}
			} else if (sortBy == 'rola') {
				//Sort by role: spravca, administrativny pracovnik, obchodnik, vyroba
				if (a.Rola == 'spravca') {
					return -1;
				} else if (a.Rola == 'administrativny pracovnik' && b.Rola != 'spravca') {
					return -1;
				} else if (
					a.Rola == 'obchodnik' &&
					b.Rola != 'spravca' &&
					b.Rola != 'administrativny pracovnik'
				) {
					return -1;
				} else if (
					a.Rola == 'vyroba' &&
					b.Rola != 'spravca' &&
					b.Rola != 'administrativny pracovnik' &&
					b.Rola != 'obchodnik'
				) {
					return -1;
				} else {
					return 1;
				}
			} else if (sortBy == '-rola') {
				if (a.Rola == 'spravca') {
					return 1;
				} else if (a.Rola == 'administrativny pracovnik' && b.Rola != 'spravca') {
					return 1;
				} else if (
					a.Rola == 'obchodnik' &&
					b.Rola != 'spravca' &&
					b.Rola != 'administrativny pracovnik'
				) {
					return 1;
				} else if (
					a.Rola == 'vyroba' &&
					b.Rola != 'spravca' &&
					b.Rola != 'administrativny pracovnik' &&
					b.Rola != 'obchodnik'
				) {
					return 1;
				} else {
					return -1;
				}
			} else if (sortBy == 'oddelenie') {
				return a.oddelenie.OddelenieID - b.oddelenie.OddelenieID;
			} else if (sortBy == '-oddelenie') {
				return b.oddelenie.OddelenieID - a.oddelenie.OddelenieID;
			} else if (sortBy == 'date') {
				return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
			} else if (sortBy == '-date') {
				return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
			}
			return 0;
		});
	});
	let showTableIndex = $state(true);
	let showTableID = $state(true);
	let showTableName = $state(true);
	let showTableEmail = $state(true);
	let showTableRole = $state(true);
	let showTableDate = $state(true);
	let showTableDepartment = $state(true);

	let showCreateUserDialog = $state(false);
	let showEditUserDialog = $state(false);
	let editingUser: Pouzivatel | null = $state(null);

	function updateSearch() {
		if (!search.trim().length) return (pouzivatelia = data.pouzivatelia);
		//Use Recursive Search
		if (!data.pouzivatelia) return;
		pouzivatelia = data.pouzivatelia.filter((pouzivatel) => {
			if (recursiveSearch(JSON.parse(JSON.stringify(pouzivatel)), search)) return pouzivatel;
		});
	}

	let validate: string[] = $state([]);

	$effect(() => {
		validate.forEach((i) => {
			$inspect(i);
			(document.getElementById(i) as HTMLInputElement).setCustomValidity('Chybné pole');
		});
	});

	function openEditUserDialog(user: Pouzivatel) {
		editingUser = user;
		showEditUserDialog = true;
		rola = user.Rola;
		password = "";
	}

	console.log(data);

	let userError: string | unknown = $state('');
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
			class="flex items-center justify-between bg-background-light-1 flex-auto w-full px-4 py-2 border-b border-b-background-dark-1 text-text-base bg-background-base sticky top-0 left-0 z-20 overflow-visible"
		>
			<h2>Moje objednávky</h2>
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
							<Checkbox bind:checked={showTableName} label="Meno" id="tableName" />
						</div>
					</div>
					<div class="flex flex-col p-2">
						<div class="flex flex-row items-center gap-2">
							<Checkbox bind:checked={showTableEmail} label="E-mail" id="tableEmail" />
						</div>
					</div>
					<div class="flex flex-col p-2">
						<div class="flex flex-row items-center gap-2">
							<Checkbox bind:checked={showTableRole} label="Rola" id="tableRole" />
						</div>
					</div>
					<div class="flex flex-col p-2">
						<div class="flex flex-row items-center gap-2">
							<Checkbox bind:checked={showTableDepartment} label="Oddelenie" id="tableDepartment" />
						</div>
					</div>
					<div class="flex flex-col p-2">
						<div class="flex flex-row items-center gap-2">
							<Checkbox bind:checked={showTableDate} label="Dátum vytvorenia" id="tableDate" />
						</div>
					</div>
				</Dropdown>
				<Button
					type="button"
					onclick={() => {
						showCreateUserDialog = true;
						rola = '';
					}}
					style="primary">Vytvoriť používateľa</Button
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
					{#if showTableName}
						<th
							transition:blur={{ duration: 500, easing: sineInOut }}
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							style="width: 20%;"
						>
							<button
								type="button"
								class="w-full text-left uppercase flex flex-row gap-1 items-center"
								onclick={() => {
									sortBy == 'name' ? (sortBy = '-name') : (sortBy = 'name');
								}}
							>
								Meno
								{#if sortBy == 'name'}
									<Icon scale="tiny">
										<ChevronUp />
									</Icon>
								{:else if sortBy == '-name'}
									<Icon scale="tiny">
										<ChevronDown />
									</Icon>
								{/if}
							</button>
						</th>
					{/if}
					{#if showTableEmail}
						<th
							transition:blur={{ duration: 500, easing: sineInOut }}
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							<button
								type="button"
								class="w-full text-left uppercase flex flex-row gap-1 items-center"
								onclick={() => {
									sortBy == 'email' ? (sortBy = '-email') : (sortBy = 'email');
								}}
							>
								E-mail
								{#if sortBy == 'email'}
									<Icon scale="tiny">
										<ChevronUp />
									</Icon>
								{:else if sortBy == '-email'}
									<Icon scale="tiny">
										<ChevronDown />
									</Icon>
								{/if}
							</button>
						</th>
					{/if}
					{#if showTableRole}
						<th
							transition:blur={{ duration: 500, easing: sineInOut }}
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							<button
								type="button"
								class="w-full text-left uppercase flex flex-row gap-1 items-center"
								onclick={() => {
									sortBy == 'rola' ? (sortBy = '-rola') : (sortBy = 'rola');
								}}
							>
								Rola
								{#if sortBy == 'rola'}
									<Icon scale="tiny">
										<ChevronUp />
									</Icon>
								{:else if sortBy == '-rola'}
									<Icon scale="tiny">
										<ChevronDown />
									</Icon>
								{/if}
							</button>
						</th>
					{/if}
					{#if showTableDepartment}
						<th
							transition:blur={{ duration: 500, easing: sineInOut }}
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							style="width: 20%;"
						>
							<button
								type="button"
								class="w-full text-left uppercase flex flex-row gap-1 items-center"
								onclick={() => {
									sortBy == 'oddelenie' ? (sortBy = '-oddelenie') : (sortBy = 'oddelenie');
								}}
							>
								Oddelenie
								{#if sortBy == 'oddelenie'}
									<Icon scale="tiny">
										<ChevronUp />
									</Icon>
								{:else if sortBy == '-oddelenie'}
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
								Vytvorený
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
				{#if data.pouzivatelia.length == 0}
					<tr class="h-full">
						<td class="px-6 py-4 whitespace-nowrap text-text-light-3 h-full" colspan="7">
							Žiadní použivatelia
						</td>
					</tr>
				{:else}
					{#key pouzivatelia}
						{#each pouzivatelia as pouzivatel, index}
							<tr
								class="hover:bg-background {data.pouzivatel.Rola == 'spravca'
									? 'cursor-pointer'
									: ''}"
								onclick={() => {
									if (data.pouzivatel.Rola == 'spravca') {
										openEditUserDialog(pouzivatel);
									} else {
										toast.error('Nemôžete meniť používateľov.', {
											duration: 4000,
											position: 'bottom-right'
										});
									}
								}}
							>
								{#if showTableIndex}
									<td
										transition:blur={{ duration: 500, easing: sineInOut }}
										class="px-6 py-4 whitespace-nowrap text-text-light-3"
									>
										{data.pouzivatelia.length - index}.
									</td>
								{/if}
								{#if showTableID}
									<td
										transition:blur={{ duration: 500, easing: sineInOut }}
										class="px-6 py-4 whitespace-nowrap"
									>
										{pouzivatel.PouzivatelID}
									</td>
								{/if}
								{#if showTableName}
									<td
										transition:blur={{ duration: 500, easing: sineInOut }}
										class="px-6 py-4 whitespace-nowrap"
									>
										<div class="text-sm text-gray-900">
											{pouzivatel.Meno}
										</div>
									</td>
								{/if}
								{#if showTableEmail}
									<td
										transition:blur={{ duration: 500, easing: sineInOut }}
										class="px-6 py-4 whitespace-nowrap"
									>
										<div class="text-sm text-gray-900">
											{pouzivatel.Email}
										</div>
									</td>
								{/if}
								{#if showTableRole}
									<td
										transition:blur={{ duration: 500, easing: sineInOut }}
										class="px-6 py-4 whitespace-nowrap"
									>
										<div class="text-sm text-gray-900">
											{pouzivatel.Rola}
										</div>
									</td>
								{/if}
								{#if showTableDepartment}
									<td
										transition:blur={{ duration: 500, easing: sineInOut }}
										class="px-6 py-4 whitespace-nowrap"
									>
										{#if pouzivatel.Rola == 'vyroba'}
											<div class="text-sm text-gray-900">
												{pouzivatel.oddelenie?.Nazov}
											</div>
										{:else}
											<div class="text-sm text-gray-900">-</div>
										{/if}
									</td>
								{/if}
								{#if showTableDate}
									<td
										transition:blur={{ duration: 500, easing: sineInOut }}
										class="px-6 py-4 whitespace-nowrap"
									>
										<div class="text-sm text-gray-900">
											{new Date(pouzivatel.created_at).toLocaleDateString('sk')}
										</div>
										<div class="text-xs text-text-light-3">
											{new Date(pouzivatel.created_at).toLocaleTimeString('sk')}
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

<Dialog bind:open={showEditUserDialog}>
	{#snippet header()}
		Zmeniť používateľa
	{/snippet}
	<form
		method="POST"
		action="/pouzivatelia?/editUser"
		use:enhance={async ({ formData }) => {
			formData.append('userID', editingUser?.PouzivatelID.toString() ?? '');
			return async ({ result, formData }) => {
				if (result.type === 'failure') {
					userError = result.data?.message;
					if (Array.isArray(result.data?.validate)) validate = result.data?.validate;
				} else {
					const submitButton = formData.get('submit_button');
					await invalidateAll();
					toast.success(submitButton == "delete" ? "Používateľ bol úspešne vymazaný." : "Používateľ bol úspešne zmenený.", {
						duration: 3000,
						position: 'bottom-right'
					});
					showEditUserDialog = false;
					editingUser = null;
					await applyAction(result);
				}
			};
		}}
	>
		<div class="px-4 py-2 grid grid-cols-12 gap-x-2">
			<div class="flex flex-col gap-1 py-1 col-span-6">
				<Label forInput="name">Meno</Label>
				<TextInput
					value={editingUser?.Meno}
					type="text"
					id="name"
					name="name"
					placeholder="Jozef Mrkvička"
				/>
			</div>
			<div class="flex flex-col gap-1 py-1 col-span-6">
				<Label forInput="password">E-mail</Label>
				<TextInput
					value={editingUser?.Email}
					type="email"
					id="email"
					name="email"
					placeholder="jozefmrkva@gmail.com"
				/>
			</div>
			<div class="flex flex-col gap-1 py-1 {rola == 'vyroba' ? 'col-span-6' : 'col-span-12'}">
				<Label forInput="password">Rola</Label>
				<Select
					disabled={editingUser?.PouzivatelID == data.pouzivatel.PouzivatelID}
					bind:actualValue={rola}
					id="rola"
					name="rola"
					data={[
						{ id: 'spravca', name: 'Správca' },
						{ id: 'administrativny pracovnik', name: 'Administratívny pracovník' },
						{ id: 'obchodnik', name: 'Obchodník' },
						{ id: 'vyroba', name: 'Výroba' }
					]}
				/>
			</div>
			{#if rola == 'vyroba'}
				<div class="flex flex-col gap-1 py-1 col-span-6">
					<Label forInput="oddelenie">Oddelenie</Label>
					<Select
						actualValue={`${editingUser?.oddelenie?.OddelenieID}`}
						data={data.oddelenia.map((m) => {
							return { id: m.OddelenieID.toString(), name: m.Nazov };
						})}
						id="oddelenie"
						name="oddelenie"
					/>
				</div>
			{/if}
			<div class="flex flex-col gap-1 py-1 col-span-12">
				<Label forInput="password">Zmeniť heslo</Label>
				<TextInput
					bind:value={password}
					isPeer={true}
					type="password"
					id="password"
					name="password"
					placeholder="Nové heslo"
				/>
				{#if password}
					<div
						class="overflow-hidden mt-0.5 w-full duration-300 rounded border-border-base flex flex-col"
					>
						{#if /[A-Z]/.test(password)}
							<p class="flex flex-row flex-nowrap gap-1 text-primary-base py-1">
								<Icon scale="small">
									<Check />
								</Icon>
								Heslo má veľké písmeno
							</p>
						{:else}
							<p class="flex flex-row flex-nowrap gap-1 text-danger-base py-1">
								<Icon scale="small">
									<Cross />
								</Icon>
								Heslo má veľké písmeno
							</p>
						{/if}
						{#if /[a-z]/.test(password)}
							<p class="flex flex-row flex-nowrap gap-1 text-primary-base py-1">
								<Icon scale="small">
									<Check />
								</Icon>
								Heslo má malé písmeno
							</p>
						{:else}
							<p class="flex flex-row flex-nowrap gap-1 text-danger-base py-1">
								<Icon scale="small">
									<Cross />
								</Icon>
								Heslo má malé písmeno
							</p>
						{/if}
						{#if /[0-9]/.test(password)}
							<p class="flex flex-row flex-nowrap gap-1 text-primary-base py-1">
								<Icon scale="small">
									<Check />
								</Icon>
								Heslo má aspoň jedno číslo
							</p>
						{:else}
							<p class="flex flex-row flex-nowrap gap-1 text-danger-base py-1">
								<Icon scale="small">
									<Cross />
								</Icon>
								Heslo má aspoň jedno číslo
							</p>
						{/if}
						{#if /.{8,}/.test(password)}
							<p class="flex flex-row flex-nowrap gap-1 text-primary-base py-1">
								<Icon scale="small">
									<Check />
								</Icon>
								Heslo má aspoň 8 znakov
							</p>
						{:else}
							<p class="flex flex-row flex-nowrap gap-1 text-danger-base py-1">
								<Icon scale="small">
									<Cross />
								</Icon>
								Heslo má aspoň 8 znakov
							</p>
						{/if}
					</div>
				{/if}
			</div>
			{#if userError}
				<div class="py-2 text-danger-base col-span-12">{userError}</div>
			{/if}
		</div>
		<div class="flex justify-between w-full px-4 py-2 border-t border-slate-400/30">
			<div class="flex gap-2">
				<Button onclick={() => (showEditUserDialog = false)} type="reset" style="opaque"
					>Zrušiť</Button
				>
				<Button name="submit_button" value="delete" disabled={editingUser?.PouzivatelID == data.pouzivatel.PouzivatelID} onclick={() => (showCreateUserDialog = false)} type="submit" textStyle="default" style="danger"
					>Vymazať používateľa</Button
				>
			</div>
			<Button name="submit_button" value="update" type="submit" style="primary">Zmeniť používateľa</Button>
		</div>
	</form>
</Dialog>

<Dialog bind:open={showCreateUserDialog}>
	{#snippet header()}
		Vytvoriť používateľa
	{/snippet}
	<form
		method="POST"
		action="/pouzivatelia?/createUser"
		use:enhance={async () => {
			return async ({ result }) => {
				if (result.type === 'failure') {
					userError = result.data?.message;
					if (Array.isArray(result.data?.validate)) validate = result.data?.validate;
				} else {
					await invalidateAll();
					toast.success('Používateľ bol vytvorený.', {
						duration: 3000,
						position: 'bottom-right'
					});
					password = "";
					rola = "";
					showCreateUserDialog = false;
					await applyAction(result);
				}
			};
		}}
	>
		<div class="px-4 py-2 grid grid-cols-12 gap-x-2">
			<div class="flex flex-col gap-1 py-1 col-span-6">
				<Label forInput="name">Meno</Label>
				<TextInput type="text" id="name" name="name" placeholder="Jozef Mrkvička" />
			</div>
			<div class="flex flex-col gap-1 py-1 col-span-6">
				<Label forInput="password">E-mail</Label>
				<TextInput type="email" id="email" name="email" placeholder="jozefmrkva@gmail.com" />
			</div>
			<div class="flex flex-col gap-1 py-1 {rola == 'vyroba' ? 'col-span-6' : 'col-span-12'}">
				<Label forInput="password">Rola</Label>
				<Select
					bind:actualValue={rola}
					id="rola"
					name="rola"
					data={[
						{ id: 'spravca', name: 'Správca' },
						{ id: 'administrativny pracovnik', name: 'Administratívny pracovník' },
						{ id: 'obchodnik', name: 'Obchodník' },
						{ id: 'vyroba', name: 'Výroba' }
					]}
				/>
			</div>
			{#if rola == 'vyroba'}
				<div class="flex flex-col gap-1 py-1 col-span-6">
					<Label forInput="oddelenie">Oddelenie</Label>
					<Select
						data={data.oddelenia.map((m) => {
							return { id: m.OddelenieID.toString(), name: m.Nazov };
						})}
						id="oddelenie"
						name="oddelenie"
					/>
				</div>
			{/if}
			<div class="flex flex-col gap-1 py-1 col-span-12">
				<Label forInput="password">Vytvoriť heslo</Label>
				<TextInput
					bind:value={password}
					isPeer={true}
					type="password"
					id="password"
					name="password"
					placeholder="Heslo užívateľa"
				/>
				<div
					class="overflow-hidden mt-0.5 w-full duration-300 rounded border-border-base flex flex-col"
				>
					{#if /[A-Z]/.test(password)}
						<p class="flex flex-row flex-nowrap gap-1 text-primary-base py-1">
							<Icon scale="small">
								<Check />
							</Icon>
							Heslo má veľké písmeno
						</p>
					{:else}
						<p class="flex flex-row flex-nowrap gap-1 text-danger-base py-1">
							<Icon scale="small">
								<Cross />
							</Icon>
							Heslo má veľké písmeno
						</p>
					{/if}
					{#if /[a-z]/.test(password)}
						<p class="flex flex-row flex-nowrap gap-1 text-primary-base py-1">
							<Icon scale="small">
								<Check />
							</Icon>
							Heslo má malé písmeno
						</p>
					{:else}
						<p class="flex flex-row flex-nowrap gap-1 text-danger-base py-1">
							<Icon scale="small">
								<Cross />
							</Icon>
							Heslo má malé písmeno
						</p>
					{/if}
					{#if /[0-9]/.test(password)}
						<p class="flex flex-row flex-nowrap gap-1 text-primary-base py-1">
							<Icon scale="small">
								<Check />
							</Icon>
							Heslo má aspoň jedno číslo
						</p>
					{:else}
						<p class="flex flex-row flex-nowrap gap-1 text-danger-base py-1">
							<Icon scale="small">
								<Cross />
							</Icon>
							Heslo má aspoň jedno číslo
						</p>
					{/if}
					{#if /.{8,}/.test(password)}
						<p class="flex flex-row flex-nowrap gap-1 text-primary-base py-1">
							<Icon scale="small">
								<Check />
							</Icon>
							Heslo má aspoň 8 znakov
						</p>
					{:else}
						<p class="flex flex-row flex-nowrap gap-1 text-danger-base py-1">
							<Icon scale="small">
								<Cross />
							</Icon>
							Heslo má aspoň 8 znakov
						</p>
					{/if}
				</div>
			</div>
			{#if userError}
				<div class="py-2 text-danger-base col-span-12">{userError}</div>
			{/if}
		</div>
		<div class="flex justify-between w-full px-4 py-2 border-t border-slate-400/30">
			<Button onclick={() => (showCreateUserDialog = false)} type="reset" style="opaque"
				>Zrušiť</Button
			>
			<Button type="submit" style="primary">Vytvoriť používateľa</Button>
		</div>
	</form>
</Dialog>
