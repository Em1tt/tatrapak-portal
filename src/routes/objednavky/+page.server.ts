import { Objednavka, Pouzivatel, Zakaznik, type Objednavka as ObjednavkaType} from "$lib/server/models";
import { serializeNonPOJOs } from "$lib/util/client";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const objednavky = await Objednavka.findAll({include: [Zakaznik, Pouzivatel]});
	return {
        objednavky: objednavky ? serializeNonPOJOs(objednavky) as ObjednavkaType : null
	};
};