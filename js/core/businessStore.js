import { eventBus } from './eventBus.js';
import { openBusinessModal } from '../modal/modalController.js';

async function loadCity(citySlug) {
    const res = await fetch(`/data/cities/${citySlug}.json`);
    if (!res.ok) return null;
    return res.json();
}

async function resolveFromDomain() {
    const domain = location.hostname;

    try {
        const res = await fetch(
            `https://mapomni.azurewebsites.net/resolve-domain?domain=${domain}`
        );

        if (!res.ok) return null;

        const { city, site } = await res.json();
        return { citySlug: city, businessSlug: site };

    } catch (e) {
        console.warn('[businessStore] falha ao resolver domínio', e);
        return null;
    }
}

function resolveFromURL() {
    const params = new URLSearchParams(location.search);
    const citySlug = params.get('city');
    const businessSlug = params.get('site');

    if (!citySlug || !businessSlug) return null;

    return { citySlug, businessSlug };
}

export async function initBusinessStore() {
    let context = null;
    let source = null;

    // 🌐 PRIORIDADE 1: domínio do cliente
    if (!location.hostname.includes('maponthego.com')) {
        context = await resolveFromDomain();
        source = 'domain';
    }

    // 🔗 PRIORIDADE 2: URL (?city=&site=)
    if (!context) {
        context = resolveFromURL();
        source = 'url';
    }

    if (!context) {
        console.warn('[businessStore] nenhum contexto válido encontrado');
        return;
    }

    console.log('[businessStore] contexto:', { source, ...context });

    const city = await loadCity(context.citySlug);
    if (!city) {
        console.warn('[businessStore] cidade não encontrada');
        return;
    }

    const business = city.negocios.find(
        n => n.slug === context.businessSlug
    );

    if (!business) {
        console.warn('[businessStore] negócio não encontrado');
        return;
    }

    eventBus.emit('business:data', {
        source,
        city,
        business
    });

    if (source === 'url') {
        openBusinessModal({
            city,
            business,
            mode: 'demo'
        });
    }

}

initBusinessStore();
