import { Objednavka, type Objednavka as ObjednavkaType} from "$lib/server/models";
import { serializeNonPOJOs } from "$lib/util/client";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const objednavky = await Objednavka.findAll();
	return {
        objednavky: objednavky ? serializeNonPOJOs(objednavky) as ObjednavkaType : null
	};
};