import { eventBus } from './eventBus.js';

let cityData = null;

export async function initCityStore() {

  const params = new URLSearchParams(location.search);
  const citySlug = params.get('city') || 'tres-rios';

  const path = `/data/cities/${citySlug}.json`;

  console.log('[cityStore] carregando:', path);

  try {
    const res = await fetch(path);

    const rawText = await res.text();

    // 🛑 Detecta HTML (Netlify SPA fallback)
    if (
      !res.ok ||
      rawText.trim().startsWith('<!DOCTYPE') ||
      rawText.trim().startsWith('<html')
    ) {
      throw new Error(`Cidade inválida ou inexistente: ${citySlug}`);
    }

    // ✅ Agora sim: JSON válido
    cityData = JSON.parse(rawText);

    console.log('[cityStore] cidade carregada:', cityData);

    eventBus.emit('city:loaded', cityData);

  } catch (err) {
    console.error('[cityStore]', err.message);

    eventBus.emit('city:error', {
      slug: citySlug,
      error: err.message
    });
  }
}

export function getCity() {
  return cityData;
}
