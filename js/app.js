import { initCityStore } from './core/cityStore.js';
import { eventBus } from './core/eventBus.js';

(async function bootstrap() {
  console.log('[app] bootstrap');

  await initCityStore();

  eventBus.emit('app:ready');
})();
