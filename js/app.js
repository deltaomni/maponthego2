import { isMainDomain } from './core/config.js';

// ⚠️ IMPORTANTE:
// apenas importar módulos que se auto-registram no eventBus
import './map/mapInit.js';
import './legend/legendInit.js';
import './modal/modalController.js';

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
