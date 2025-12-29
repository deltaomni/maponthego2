import { eventBus } from './eventBus.js';

let cityData = null;

const filters = {
    categoriasAtivas: new Set(),
    searchText: ''
};

let visibleNegocios = [];

export async function initCityStore() {

    const params = new URLSearchParams(location.search);
    const citySlug = params.get('city') || 'tres-rios';

    const path = `data/cities/${citySlug}.json`;

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

        // ativa todas as categorias por padrão
        Object.keys(cityData.categorias).forEach(catId => {
            filters.categoriasAtivas.add(catId);
        });

        // primeira avaliação de visibilidade
        applyFilters();


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

function applyFilters() {

    visibleNegocios = cityData.negocios.filter(n => {

        if (!filters.categoriasAtivas.has(n.categoria)) {
            return false;
        }

        if (filters.searchText) {
            const hay = (
                n.nome +
                ' ' +
                n.endereco
            ).toLowerCase();

            if (!hay.includes(filters.searchText)) {
                return false;
            }
        }

        if (!n.poi?.enabled) {
            return false;
        }

        return true;
    });

    eventBus.emit('city:visibilityChanged', visibleNegocios);
}

export function toggleCategoria(catId) {
    if (filters.categoriasAtivas.has(catId)) {
        filters.categoriasAtivas.delete(catId);
    } else {
        filters.categoriasAtivas.add(catId);
    }
    applyFilters();
}

export function setSearch(text) {
    filters.searchText = text.toLowerCase();
    applyFilters();
}

export function getVisibleNegocios() {
    return visibleNegocios;
}
