import { eventBus } from './eventBus.js';

let cityData = null;

export async function initCityStore() {

  const params = new URLSearchParams(location.search);
  const citySlug = params.get('city') || 'tres-rios';

  const path = `/data/cities/${citySlug}.json`;

  console.log('[cityStore] carregando:', path);

  try {
    const res = await fetch(path);

    const contentType = res.headers.get('content-type') || '';
    console.log(res.toString())
    if (!res.ok || !contentType.includes('application/json') || res.includes('<!DOCTYPE html>')) {
      throw new Error(`Cidade inválida ou inexistente: ${citySlug}`);
    }

    cityData = await res.json();

    console.log('[cityStore] cidade carregada:', cityData);

    eventBus.emit('city:loaded', cityData);

  } catch (err) {
    console.error('[cityStore]', err);
    eventBus.emit('city:error', {
      slug: citySlug,
      error: err.message
    });
  }
}

export function getCity() {
  return cityData;
}


