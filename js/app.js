import { isMainDomain } from './core/config.js';

// ⚠️ IMPORTANTE:
// apenas importar módulos que se auto-registram no eventBus
import './map/mapInit.js';
import './legend/legendInit.js';
import './modal/modalController.js';
//import './core/businessStore.js';

import { eventBus } from './core/eventBus.js';
import { initLegend } from './legend/legendInit.js';
import { initLegendEvents } from './legend/legendEvents.js';

import { renderCategories } from './legend/legendCategories.js';
import { renderLegendItems } from './legend/legendItem.js';
import { hydrateLegendItems } from './legend/legendItem.js';

import { openSiteModal } from './modal/modalController.js';
import { initBusinessStore } from './core/businessStore.js';


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

eventBus.on('business:data', ({ source, city, business }) => {

    if (source === 'url') {
        requestAnimationFrame(() => {
            openSiteModal();

            const container = document.getElementById('modal-site-root');
            if (!container) {
                console.warn('modal-site-root ainda não existe');
                return;
            }

            console.log("[template] render site via URL");
        //    container.innerHTML = business.premium
        //        ? '<h1 style="font-size:48px">EU SOU SITE PREMIUM</h1>'
        //        : '<h1 style="font-size:48px">EU SOU WEBSITE EXTERNO</h1>';
        });
    }

});


// depois de tudo registrado
// depois de tudo registrado
if (!window.__MOTG_CONTEXT__) {
    initBusinessStore();
}

