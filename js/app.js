import { isMainDomain } from './core/config.js';

// ⚠️ IMPORTANTE:
// apenas importar módulos que se auto-registram no eventBus
import './map/mapInit.js';
import './legend/legendInit.js';
import './modal/modalController.js';
import { eventBus } from './core/eventBus.js';
import { initLegend } from './legend/legendInit.js';
import { initLegendEvents } from './legend/legendEvents.js';

import { renderCategories } from './legend/legendCategories.js';
import { renderLegendItems } from './legend/legendItem.js';
import { hydrateLegendItems } from './legend/legendItem.js';


eventBus.on('city:loaded', city => {
    initLegend(city);
    initLegendEvents();

    renderCategories(city.categorias);
    renderLegendItems(city.negocios);
    hydrateLegendItems(city.negocios); // 👈 NOVO
});


(async function bootstrap() {

    // 🔐 DOMÍNIO DE CLIENTE → SITE DO NEGÓCIO
    if (!isMainDomain()) {
        if (!location.pathname.startsWith('/negocio')) {
            location.replace('/negocio/index.html');
        }
        return;
    }

    // 🗺️ DOMÍNIO PRINCIPAL → MAPA
    const { initCityStore } = await import('./core/cityStore.js');

    await initCityStore();
})();
