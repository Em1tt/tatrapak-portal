import { Objednavka, Pouzivatel, Produkt, Zakaznik } from "$lib/server/models";
import { serializeNonPOJOs } from "$lib/util/client";
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

// Define the types for selectProduct and createProduct
type SelectProduct = {
    type: string;
    product: string;
    product_val: string;
    quantity: string;
};

type CreateProduct = {
    type: string;
    name: string;
    catalogNumber: string;
    price: string;
    weight: string;
    quantity: string;
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
    createOrder: async ({ request, locals }) => {
        if(!locals.user) return;
        const formData = await request.formData();
        const formDataObj = Object.fromEntries(formData.entries());
        console.log(formData);
        let customerData: Customer = {type: "", customer: "", customer_val: ""};
        const products: Product[] = [];
        const keys = Object.keys(formDataObj);

        keys.forEach(key => {
            // Match customer keys
            const matchCustomer = key.match(/customer_type/);
            if (matchCustomer) {
                const type = formDataObj[key];

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
        const normalizedProducts: Array<{ id: number; name: string; quantity: number }> = [];

        let customerID: number;
        if (isCreateCustomer(customerData)) {
            customerID = (await Zakaznik.create({Meno: customerData.name, Telefon: customerData.telephone, Email: customerData.email})).ZakaznikID;
        }else{
            customerID = parseInt(customerData.customer_val)
        };
        products.forEach(async product => {
            if (isSelectProduct(product)) {
                normalizedProducts.push({id: parseInt(product.product_val), quantity: parseInt(product.quantity), name: product.product})
            } else if (isCreateProduct(product)) {
                const cena = product.price == "" ? "0" : product.price;
                const hmotnost = product.weight == "" ? "0" : product.weight;
                const created = await Produkt.create({VytvorilPouzivatelID: (locals.user as Pouzivatel).PouzivatelID, Nazov: product.name, Cena: cena, KatalogoveCislo: product.catalogNumber, Hmotnost: hmotnost});
                normalizedProducts.push({id: created.ProduktID, name: created.Nazov, quantity: parseInt(product.quantity)});
            }
        });

        const objednavka = Objednavka.create({ZakaznikID: customerID, PouzivatelID: (locals.user as Pouzivatel).PouzivatelID, Produkt: normalizedProducts, DatumExpedicie: new Date(Date.now())})
        console.log(objednavka)
    }
} satisfies Actions;

export const load: PageServerLoad = async () => {
    const objednavky = await Objednavka.findAll({ include: [Zakaznik, Pouzivatel] });
    const zakaznici = await Zakaznik.findAll();
    const produkty = await Produkt.findAll();
    return {
        objednavky: objednavky ? serializeNonPOJOs(objednavky) as Objednavka[] : [],
        zakaznici: zakaznici ? serializeNonPOJOs(zakaznici) as Zakaznik[] : [],
        produkty: produkty ? serializeNonPOJOs(produkty) as Produkt[] : []
    };
};