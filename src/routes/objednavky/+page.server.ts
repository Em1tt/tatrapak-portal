import { Objednavka, Pouzivatel, Produkt, Zakaznik} from "$lib/server/models";
import { serializeNonPOJOs } from "$lib/util/client";
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const actions = {
    createOrder: async ({request}) => {
        const formData = await request.formData();
        console.log(formData);
        console.log("hi");
    }
} satisfies Actions

export const load: PageServerLoad = async () => {
    const objednavky = await Objednavka.findAll({include: [Zakaznik, Pouzivatel]});
    const zakaznici = await Zakaznik.findAll();
    const produkty = await Produkt.findAll();
	return {
        objednavky: objednavky ? serializeNonPOJOs(objednavky) as Objednavka[] : [],
        zakaznici: zakaznici ? serializeNonPOJOs(zakaznici) as Zakaznik[] : [],
        produkty: produkty ? serializeNonPOJOs(produkty) as Produkt[] : []
	};
};