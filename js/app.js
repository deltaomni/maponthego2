import { isMainDomain } from './core/config.js';
import { eventBus } from './core/eventBus.js';
import { initMap } from './map/mapView.js';

(async function bootstrap() {

    if (!isMainDomain()) {
        if (!location.pathname.startsWith('/negocio')) {
            location.replace('/negocio/index.html');
        }
        return;
    }

    const { initCityStore, getCity } = await import('./core/cityStore.js');

    eventBus.on('city:loaded', city => {
        initMap(city);           // 🗺️ mapa + POIs
        buildLegend();           // 🎯 legado V1
    });

    eventBus.on('poi:click', negocio => {
        openBusinessModal(negocio.id);
    });

    await initCityStore();
})();

