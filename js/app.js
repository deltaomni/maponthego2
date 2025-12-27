import { isMainDomain } from './core/config.js';

(async function bootstrap() {

  // 🔐 DOMÍNIO DE CLIENTE → NEGÓCIO
  if (!isMainDomain()) {
    // evita loop
    if (!location.pathname.startsWith('/negocio')) {
      location.replace('/negocio/index.html');
    }
    return;
  }

  // 🗺️ DOMÍNIO PRINCIPAL → MAPA
  const { initCityStore } = await import('./core/cityStore.js');
  await initCityStore();

  console.log('[app] mapa inicializado');

})();


