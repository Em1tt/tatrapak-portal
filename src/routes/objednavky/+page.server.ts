import { Objednavka, Pouzivatel, Produkt, Zakaznik} from "$lib/server/models";
import { serializeNonPOJOs } from "$lib/util/client";
import type { PageServerLoad } from "./$types";

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