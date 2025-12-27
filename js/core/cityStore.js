import { eventBus } from './eventBus.js';

let cityData = null;

export async function initCityStore() {

  const params = new URLSearchParams(location.search);
  const citySlug = params.get('city') || 'tres-rios';

  const path = `/data/cities/${citySlug}.json`;

  console.log('[cityStore] carregando:', path);

  try {
    const res = await fetch(path);

    if (!res.ok) {
      throw new Error(`Cidade não encontrada: ${citySlug}`);
    }

    cityData = await res.json();

    console.log('[cityStore] cidade carregada:', cityData);

    eventBus.emit('city:loaded', cityData);

  } catch (err) {
    console.error('[cityStore]', err);
    eventBus.emit('city:error', err);
  }
}

export function getCity() {
  return cityData;
}
