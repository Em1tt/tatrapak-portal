import { Objednavka, Oddelenie, Pouzivatel, Produkt, Zakaznik } from '$lib/server/models';
import { isValidEmail, isValidTelephone, serializeNonPOJOs } from '$lib/util/client';
import { error, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Define the types for selectProduct and createProduct
type SelectProduct = {
	type: string;
	product: string;
	product_val: string;
	quantity: string;
	oddelenie?: string;
	vyrobene?: boolean;
};

type CreateProduct = {
	type: string;
	name: string;
	catalogNumber: string;
	price: string;
	weight: string;
	quantity: string;
	oddelenie?: string;
	vyrobene?: boolean;
};

// Define the types for selectProduct and createProduct
type SelectCustomer = {
	type: string;
	customer: string;
	customer_val: string;
};

type CreateCustomer = {
	type: string;
	name: string;
	email: string;
	telephone: string;
};

// Conditional type for products
type Product = SelectProduct | CreateProduct;

// Type guard for SelectProduct
function isSelectProduct(product: Product): product is SelectProduct {
	return (product as SelectProduct).product !== undefined;
}

// Type guard for CreateProduct
function isCreateProduct(product: Product): product is CreateProduct {
	return (product as CreateProduct).name !== undefined;
}

// Conditional type for products
type Customer = SelectCustomer | CreateCustomer;

// Type guard for Createcustomer
function isCreateCustomer(customer: Customer): customer is CreateCustomer {
	return (customer as CreateCustomer).name !== undefined;
}

export const actions = {
	editOrderVyroba: async ({ request, locals }) => {
		if (!locals.user)
			return fail(401, { message: 'Nie je možné zmeniť objednávku bez prihlásenia.' });
		const formData = await request.formData();
		console.log(formData);
		const submit_button = formData.get('submit_button');
		if (!submit_button)
			return fail(400, {
				message: 'Neplatný submit_button'
			});
		const formDataObj = Object.fromEntries(formData.entries());
		const orderID = formData.get('orderID');

		if (!orderID || orderID == '' || isNaN(parseInt(orderID.toString()))) {
			return fail(400, { message: 'Neplatné ID objednávky.' });
		}
		if (submit_button == 'delete') {
			const order = await Objednavka.findByPk(orderID);
			if (!order)
				return fail(400, {
					message: 'Používateľ neexistuje'
				});
			if (locals.user.Rola == 'vyroba')
				return fail(400, {
					message: 'Nemôžete vymazať objednávku ako výrobný pracovník.'
				});
			await order.destroy();
			return { success: true, message: 'Objednávka bola vymazaná.' };
		}
		const objednavka = await Objednavka.findByPk(parseInt(orderID?.toString()));
		if (!objednavka) return fail(400, { message: 'Objednávka neexistuje.' });

		if (objednavka.Stav != 'prijata' && (locals.user.Rola != 'vyroba' && locals.user.Rola == 'spravca'))
			return fail(400, { message: 'Objednávka už bola spracovaná.' });

		const products: Array<{
			product: string;
			product_val: string;
			quantity: string;
			oddelenie: string;
			vyrobene: boolean;
		}> = [];
		const keys = Object.keys(formDataObj);
		const expeditionDate = formData.get('dateExpedition');
		keys.forEach((key) => {
			const matchProduct = key.match(/product(\d+)_val/);
			if (matchProduct) {
				const index = matchProduct[1];
				products.push({
					product: formDataObj[`product${index}`].toString(),
					product_val: formDataObj[`product${index}_val`].toString(),
					quantity: formDataObj[`quantityProduct${index}`].toString(),
					oddelenie: formDataObj[`departmentProduct${index}`].toString() ?? null,
					vyrobene: formDataObj[`departmentProductDone${index}`]?.toString() == 'on'
				});
			}
		});

		console.log(products);

		if (!expeditionDate || expeditionDate == '' || isNaN(Date.parse(expeditionDate.toString())))
			return fail(400, { message: 'Neplatný dátum expedície.', validate: ['dateExpedition'] });
		const normalizedProducts: Array<{
			id: number;
			name: string;
			quantity: number;
			oddelenie?: string;
			vyrobene: boolean
		}> = [];
		const customerID: number = parseInt(formData.get('customer_val')?.toString() ?? '');
		for (let i = 0; i < products.length; i++) {
			const product = products[i];
			console.log(product);
			normalizedProducts.push({
				id: parseInt(product.product_val),
				quantity: parseInt(product.quantity),
				name: product.product,
				oddelenie: product.oddelenie,
				vyrobene: product.vyrobene
			});
		};

		let currentProducts = objednavka.Produkt;

		currentProducts = currentProducts.filter((product) => {
			return product.id != normalizedProducts.find((p) => p.id == product.id)?.id;
		});

		currentProducts = [...currentProducts, ...normalizedProducts];

		//If all currentProducts aree "vyrobene", set status to "expedovana"

		const allVyrobene = currentProducts.every((product) => product.vyrobene);

		await objednavka?.update({
			ZakaznikID: customerID,
			Produkt: currentProducts,
			DatumExpedicie: new Date(expeditionDate.toString()),
			Stav: allVyrobene ? 'expedovana' : 'vo vyrobe'
		});
		return { success: true };
	},
	editOrder: async ({ request, locals }) => {
		if (!locals.user)
			return fail(401, { message: 'Nie je možné zmeniť objednávku bez prihlásenia.' });
		const formData = await request.formData();
		console.log(formData);
		const submit_button = formData.get('submit_button');
		if (!submit_button)
			return fail(400, {
				message: 'Neplatný submit_button'
			});
		const formDataObj = Object.fromEntries(formData.entries());
		const orderID = formData.get('orderID');

		if (!orderID || orderID == '' || isNaN(parseInt(orderID.toString()))) {
			return fail(400, { message: 'Neplatné ID objednávky.' });
		}
		if (submit_button == 'delete') {
			const order = await Objednavka.findByPk(orderID);
			if (!order)
				return fail(400, {
					message: 'Používateľ neexistuje'
				});
			if (locals.user.Rola == 'vyroba')
				return fail(400, {
					message: 'Nemôžete vymazať objednávku ako výrobný pracovník.'
				});
			await order.destroy();
			return { success: true, message: 'Objednávka bola vymazaná.' };
		}
		const objednavka = await Objednavka.findByPk(parseInt(orderID?.toString()));
		if (!objednavka) return fail(400, { message: 'Objednávka neexistuje.' });

		if (objednavka.Stav != 'prijata' && (locals.user.Rola == 'vyroba') && (locals.user.Rola == 'spravca'))
			return fail(400, { message: 'Objednávka už bola spracovaná.' });

		let customerData: Customer = { type: '', customer: '', customer_val: '' };
		const products: Product[] = [];
		const keys = Object.keys(formDataObj);
		const expeditionDate = formData.get('dateExpedition');
		keys.forEach((key) => {
			// Match customer keys
			const matchCustomer = key.match(/customer_type/);
			if (matchCustomer) {
				const type = formDataObj[key];
				if (!type || type == '')
					return fail(400, {
						message: 'Neplatná operácia so zákazníkom.',
						validate: [`createCustomer`, `selectCustomer`]
					});
				if (type === `selectCustomer`) {
					customerData = {
						type,
						customer: formDataObj[`customer`],
						customer_val: formDataObj[`customer_val`]
					} as SelectCustomer;
				} else {
					customerData = {
						type,
						name: formDataObj[`nameCustomer`],
						email: formDataObj[`emailCustomer`],
						telephone: formDataObj[`telephoneCustomer`]
					} as CreateCustomer;
				}
			}
			const matchProduct = key.match(/product(\d+)_type/);
			if (matchProduct) {
				const index = matchProduct[1];
				const type = formDataObj[key];
				if (!type || type == '')
					return fail(400, {
						message: 'Neplatná operácia s produktom.',
						validate: [`createProduct${index}`, `selectProduct${index}`]
					});
				if (type === `selectProduct${index}`) {
					products.push({
						type,
						product: formDataObj[`product${index}`],
						product_val: formDataObj[`product${index}_val`],
						quantity: formDataObj[`quantityProduct${index}`],
						oddelenie: formDataObj[`departmentProduct${index}`] ?? null,
						vyrobene: formDataObj[`vyrobeneProduct${index}`]?.toString() == 'on'
					} as SelectProduct);
				} else if (type === `createProduct${index}`) {
					products.push({
						type,
						name: formDataObj[`nameProduct${index}`],
						catalogNumber: formDataObj[`catalogNumberProduct${index}`],
						price: formDataObj[`priceProduct${index}`],
						weight: formDataObj[`weightProduct${index}`],
						quantity: formDataObj[`quantityProduct${index}`],
						oddelenie: formDataObj[`departmentProduct${index}`] ?? null,
						vyrobene: formDataObj[`vyrobeneProduct${index}`].toString() == 'on'
					} as CreateProduct);
				}
			}
		});

		if (!expeditionDate || expeditionDate == '' || isNaN(Date.parse(expeditionDate.toString())))
			return fail(400, { message: 'Neplatný dátum expedície.', validate: ['dateExpedition'] });
		const normalizedProducts: Array<{
			id: number;
			name: string;
			quantity: number;
			oddelenie?: string;
		}> = [];
		let customerID: number;
		if (isCreateCustomer(customerData)) {
			if (!customerData.name || customerData.name == '')
				return fail(400, {
					message: 'Neplatné meno zákazníka',
					validate: [`nameCustomer`],
					errorArea: 'customer'
				});
			if (
				customerData.email &&
				customerData.email.trim() != '' &&
				!isValidEmail(customerData.email)
			)
				return fail(400, {
					message: 'Neplatný e-mail zákazníka',
					validate: [`emailCustomer`],
					errorArea: 'customer'
				});
			if (
				customerData.telephone &&
				customerData.telephone.trim() != '' &&
				!isValidTelephone(customerData.telephone)
			)
				return fail(400, {
					message: 'Neplatné telefónne číslo zákazníka',
					validate: [`telephoneCustomer`],
					errorArea: 'customer'
				});
			if (
				await Zakaznik.findOne({
					where: {
						Meno: customerData.name,
						Email: customerData.email,
						Telefon: customerData.telephone
					}
				})
			)
				return fail(400, {
					message:
						'Zákazník s takými istými údajmi už existuje. Zmeňte e-mail alebo telefónne číslo.',
					validate: [`emailCustomer`],
					errorArea: 'customer'
				});
			customerID = (
				await Zakaznik.create({
					Meno: customerData.name,
					Telefon: customerData.telephone,
					Email: customerData.email
				})
			).ZakaznikID;
		} else {
			if (!customerData.customer_val || customerData.customer_val == '')
				return fail(400, {
					message: 'Neplatný zákazník',
					validate: [`customer`],
					errorArea: 'customer'
				});
			if (!(await Zakaznik.findByPk(parseInt(customerData.customer_val))))
				return fail(400, {
					message: 'Zákazník neexistuje',
					validate: [`customer`],
					errorArea: 'customer'
				});
			customerID = parseInt(customerData.customer_val);
		}
		for (let i = 0; i < products.length; i++) {
			const product = products[i];
			if (isSelectProduct(product)) {
				if (
					!product.product_val ||
					product.product_val == '' ||
					isNaN(parseInt(product.product_val))
				)
					return fail(400, {
						message: 'Neplatný produkt',
						validate: [`product${i}`],
						errorArea: `product${i}`
					});
				if (!product.quantity || product.quantity == '' || isNaN(parseInt(product.quantity)))
					return fail(400, {
						message: 'Neplatné množstvo produktu',
						validate: [`quantityProduct${i}`],
						errorArea: `product${i}`
					});
				if (
					((locals.user as Pouzivatel).Rola == 'administrativny pracovnik' ||
						(locals.user as Pouzivatel).Rola == 'spravca') &&
					!product.oddelenie
				) {
					return fail(400, {
						message: 'Neplatné oddelenie produktu',
						validate: [`departmentProduct${i}`],
						errorArea: `product${i}`
					});
				}
				if (!(await Produkt.findByPk(parseInt(product.product_val))))
					return fail(400, {
						message: 'Produkt neexistuje',
						validate: [`product${i}`],
						errorArea: `product${i}`
					});
				normalizedProducts.push({
					id: parseInt(product.product_val),
					quantity: parseInt(product.quantity),
					name: product.product,
					oddelenie: product.oddelenie
				});
			} else if (isCreateProduct(product)) {
				if (!product.name || product.name == '')
					return fail(400, {
						message: 'Neplatný názov produktu',
						validate: [`nameProduct${i}`],
						errorArea: `product${i}`
					});
				if (!product.catalogNumber || product.catalogNumber == '')
					return fail(400, {
						message: 'Neplatné katalógové číslo produktu',
						validate: [`catalogNumberProduct${i}`],
						errorArea: `product${i}`
					});
				if (await Produkt.findOne({ where: { KatalogoveCislo: product.catalogNumber } }))
					return fail(400, {
						message: 'Produkt s týmto katalógovým číslom už existuje',
						validate: [`catalogNumberProduct${i}`],
						errorArea: `product${i}`
					});
				if (!product.quantity || product.quantity == '' || isNaN(parseInt(product.quantity)))
					return fail(400, {
						message: 'Neplatné množstvo produktu',
						validate: [`quantityProduct${i}`],
						errorArea: `product${i}`
					});
				const cena = product.price == '' ? '0' : product.price;
				const hmotnost = product.weight == '' ? '0' : product.weight;
				//If name and weight is the same, throw error
				if (await Produkt.findOne({ where: { Nazov: product.name, Hmotnost: hmotnost } }))
					return fail(400, {
						message: 'Produkt s rovnakým názvom a hmotnosťou už existuje.',
						validate: [`weightProduct${i}`],
						errorArea: `product${i}`
					});
				const created = await Produkt.create({
					VytvorilPouzivatelID: (locals.user as Pouzivatel).PouzivatelID,
					Nazov: product.name,
					Cena: cena,
					KatalogoveCislo: product.catalogNumber,
					Hmotnost: hmotnost
				});
				normalizedProducts.push({
					id: created.ProduktID,
					name: created.Nazov,
					quantity: parseInt(product.quantity),
					oddelenie: product.oddelenie
				});
			}
		}

		await objednavka?.update({
			ZakaznikID: customerID,
			Produkt: normalizedProducts,
			DatumExpedicie: new Date(expeditionDate.toString()),
			Stav: (locals.user as Pouzivatel).Rola == 'obchodnik' ? 'prijata' : 'vo vyrobe'
		});
		return { success: true };
	},
	createOrder: async ({ request, locals }) => {
		if (!locals.user)
			return fail(401, { message: 'Nie je možné vytvoriť objednávku bez prihlásenia.' });
		const formData = await request.formData();
		const formDataObj = Object.fromEntries(formData.entries());
		let customerData: Customer = { type: '', customer: '', customer_val: '' };
		const products: Product[] = [];
		const keys = Object.keys(formDataObj);
		const expeditionDate = formData.get('dateExpedition');
		keys.forEach((key) => {
			// Match customer keys
			const matchCustomer = key.match(/customer_type/);
			if (matchCustomer) {
				const type = formDataObj[key];
				if (!type || type == '')
					return fail(400, {
						message: 'Neplatná operácia so zákazníkom.',
						validate: [`createCustomer`, `selectCustomer`]
					});
				if (type === `selectCustomer`) {
					customerData = {
						type,
						customer: formDataObj[`customer`],
						customer_val: formDataObj[`customer_val`]
					} as SelectCustomer;
				} else {
					customerData = {
						type,
						name: formDataObj[`nameCustomer`],
						email: formDataObj[`emailCustomer`],
						telephone: formDataObj[`telephoneCustomer`]
					} as CreateCustomer;
				}
			}
			const matchProduct = key.match(/product(\d+)_type/);
			if (matchProduct) {
				const index = matchProduct[1];
				const type = formDataObj[key];
				if (!type || type == '')
					return fail(400, {
						message: 'Neplatná operácia s produktom.',
						validate: [`createProduct${index}`, `selectProduct${index}`]
					});
				if (type === `selectProduct${index}`) {
					products.push({
						type,
						product: formDataObj[`product${index}`],
						product_val: formDataObj[`product${index}_val`],
						quantity: formDataObj[`quantityProduct${index}`]
					} as SelectProduct);
				} else if (type === `createProduct${index}`) {
					products.push({
						type,
						name: formDataObj[`nameProduct${index}`],
						catalogNumber: formDataObj[`catalogNumberProduct${index}`],
						price: formDataObj[`priceProduct${index}`],
						weight: formDataObj[`weightProduct${index}`],
						quantity: formDataObj[`quantityProduct${index}`]
					} as CreateProduct);
				}
			}
		});

		if (!expeditionDate || expeditionDate == '' || isNaN(Date.parse(expeditionDate.toString())))
			return fail(400, { message: 'Neplatný dátum expedície.', validate: ['dateExpedition'] });
		const normalizedProducts: Array<{ id: number; name: string; quantity: number }> = [];
		let customerID: number;
		if (isCreateCustomer(customerData)) {
			if (!customerData.name || customerData.name == '')
				return fail(400, {
					message: 'Neplatné meno zákazníka',
					validate: [`nameCustomer`],
					errorArea: 'customer'
				});
			if (
				customerData.email &&
				customerData.email.trim() != '' &&
				!isValidEmail(customerData.email)
			)
				return fail(400, {
					message: 'Neplatný e-mail zákazníka',
					validate: [`emailCustomer`],
					errorArea: 'customer'
				});
			if (
				customerData.telephone &&
				customerData.telephone.trim() != '' &&
				!isValidTelephone(customerData.telephone)
			)
				return fail(400, {
					message: 'Neplatné telefónne číslo zákazníka',
					validate: [`telephoneCustomer`],
					errorArea: 'customer'
				});
			if (
				await Zakaznik.findOne({
					where: {
						Meno: customerData.name,
						Email: customerData.email,
						Telefon: customerData.telephone
					}
				})
			)
				return fail(400, {
					message:
						'Zákazník s takými istými údajmi už existuje. Zmeňte e-mail alebo telefónne číslo.',
					validate: [`emailCustomer`],
					errorArea: 'customer'
				});
			customerID = (
				await Zakaznik.create({
					Meno: customerData.name,
					Telefon: customerData.telephone,
					Email: customerData.email
				})
			).ZakaznikID;
		} else {
			if (!customerData.customer_val || customerData.customer_val == '')
				return fail(400, {
					message: 'Neplatný zákazník',
					validate: [`customer`],
					errorArea: 'customer'
				});
			if (!(await Zakaznik.findByPk(parseInt(customerData.customer_val))))
				return fail(400, {
					message: 'Zákazník neexistuje',
					validate: [`customer`],
					errorArea: 'customer'
				});
			customerID = parseInt(customerData.customer_val);
		}
		for (let i = 0; i < products.length; i++) {
			const product = products[i];
			if (isSelectProduct(product)) {
				if (
					!product.product_val ||
					product.product_val == '' ||
					isNaN(parseInt(product.product_val))
				)
					return fail(400, {
						message: 'Neplatný produkt',
						validate: [`product${i}`],
						errorArea: `product${i}`
					});
				if (!product.quantity || product.quantity == '' || isNaN(parseInt(product.quantity)))
					return fail(400, {
						message: 'Neplatné množstvo produktu',
						validate: [`quantityProduct${i}`],
						errorArea: `product${i}`
					});
				if (!(await Produkt.findByPk(parseInt(product.product_val))))
					return fail(400, {
						message: 'Produkt neexistuje',
						validate: [`product${i}`],
						errorArea: `product${i}`
					});
				normalizedProducts.push({
					id: parseInt(product.product_val),
					quantity: parseInt(product.quantity),
					name: product.product
				});
			} else if (isCreateProduct(product)) {
				if (!product.name || product.name == '')
					return fail(400, {
						message: 'Neplatný názov produktu',
						validate: [`nameProduct${i}`],
						errorArea: `product${i}`
					});
				if (!product.catalogNumber || product.catalogNumber == '')
					return fail(400, {
						message: 'Neplatné katalógové číslo produktu',
						validate: [`catalogNumberProduct${i}`],
						errorArea: `product${i}`
					});
				if (await Produkt.findOne({ where: { KatalogoveCislo: product.catalogNumber } }))
					return fail(400, {
						message: 'Produkt s týmto katalógovým číslom už existuje',
						validate: [`catalogNumberProduct${i}`],
						errorArea: `product${i}`
					});
				if (!product.quantity || product.quantity == '' || isNaN(parseInt(product.quantity)))
					return fail(400, {
						message: 'Neplatné množstvo produktu',
						validate: [`quantityProduct${i}`],
						errorArea: `product${i}`
					});
				const cena = product.price == '' ? '0' : product.price;
				const hmotnost = product.weight == '' ? '0' : product.weight;
				//If name and weight is the same, throw error
				if (await Produkt.findOne({ where: { Nazov: product.name, Hmotnost: hmotnost } }))
					return fail(400, {
						message: 'Produkt s rovnakým názvom a hmotnosťou už existuje.',
						validate: [`weightProduct${i}`],
						errorArea: `product${i}`
					});
				const created = await Produkt.create({
					VytvorilPouzivatelID: (locals.user as Pouzivatel).PouzivatelID,
					Nazov: product.name,
					Cena: cena,
					KatalogoveCislo: product.catalogNumber,
					Hmotnost: hmotnost
				});
				normalizedProducts.push({
					id: created.ProduktID,
					name: created.Nazov,
					quantity: parseInt(product.quantity)
				});
			}
		}

		Objednavka.create({
			ZakaznikID: customerID,
			PouzivatelID: (locals.user as Pouzivatel).PouzivatelID,
			Produkt: normalizedProducts,
			DatumExpedicie: new Date(expeditionDate.toString())
		});
		return { success: true };
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) error(401, { message: 'Nie ste prihlásený' });
	let objednavky: Objednavka[] = [];
	if (
		(locals.user as Pouzivatel).Rola == 'spravca' ||
		(locals.user as Pouzivatel).Rola == 'administrativny pracovnik'
	) {
		objednavky = await Objednavka.findAll({ include: [Zakaznik, Pouzivatel] });
	} else if ((locals.user as Pouzivatel).Rola == 'vyroba') {
		objednavky = [
			...(await Objednavka.findAll({
				include: [Zakaznik, Pouzivatel],
				where: { Stav: 'vo vyrobe' }
			})),
			...(await Objednavka.findAll({
				include: [Zakaznik, Pouzivatel],
				where: { Stav: 'expedovana' }
			}))
		];
		objednavky = objednavky.filter((objednavka) => {
			return objednavka.Produkt.some((produkt) => {
				return produkt?.oddelenie == (locals.user as Pouzivatel).OddelenieID;
			});
		});
	} else {
		objednavky = await Objednavka.findAll({
			where: { PouzivatelID: (locals.user as Pouzivatel).PouzivatelID },
			include: [Zakaznik, Pouzivatel]
		});
	}
	const zakaznici = await Zakaznik.findAll();
	const produkty = await Produkt.findAll();
	const oddelenia = await Oddelenie.findAll();
	return {
		objednavky: objednavky ? (serializeNonPOJOs(objednavky) as Objednavka[]) : [],
		zakaznici: zakaznici ? (serializeNonPOJOs(zakaznici) as Zakaznik[]) : [],
		produkty: produkty ? (serializeNonPOJOs(produkty) as Produkt[]) : [],
		oddelenia: oddelenia ? (serializeNonPOJOs(oddelenia) as Oddelenie[]) : []
	};
};
