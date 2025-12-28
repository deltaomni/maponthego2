import { isMainDomain } from './core/config.js';
import { eventBus } from './core/eventBus.js';
await import('./map/mapView.js');


(async function bootstrap() {
  // 🔐 DOMÍNIO DE CLIENTE → NEGÓCIO
  if (!isMainDomain()) {
    if (!location.pathname.startsWith('/negocio')) {
      location.replace('/negocio/index.html');
    }
    return;
  }
  
  // 🗺️ DOMÍNIO PRINCIPAL → MAPA
  const { initCityStore } = await import('./core/cityStore.js');

  eventBus.on('city:loaded', city => {
    console.log('[app] cidade pronta:', city.slug);
  });

  await initCityStore();

})();

