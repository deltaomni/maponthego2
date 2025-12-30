import { eventBus } from './eventBus.js';

export async function initBusinessStore() {
    const params = new URLSearchParams(location.search);

    let source = null;
    let citySlug = null;
    let businessSlug = null;

    // 1️⃣ PRIORIDADE: URL (?city & ?site)
    if (params.has('city') && params.has('site')) {
        source = 'url';
        citySlug = params.get('city');
        businessSlug = params.get('site');
    }
    // 2️⃣ DOMÍNIO PRÓPRIO
    else {
        source = 'domain';
        const host = location.hostname;
        businessSlug = host.split('.')[0];

        // ⚠️ provisório (até API de resolução)
        citySlug = 'tres-rios';
    }

    console.log('[businessStore] contexto:', {
        source,
        citySlug,
        businessSlug
    });

    try {
        // 📦 carregar cidade
        const city = await fetch(`/data/cities/${citySlug}.json`)
            .then(r => r.json());

        // 🔎 localizar negócio
        const business = city.negocios.find(
            n => n.slug === businessSlug
        );

        if (!business) {
            console.warn('[businessStore] negócio não encontrado');
            return;
        }

        const payload = {
            source,
            citySlug,
            businessSlug,
            city,
            business
        };

        // 🚀 EVENTO CANÔNICO
        eventBus.emit('business:data', payload);

    } catch (err) {
        console.error('[businessStore] erro ao carregar negócio', err);
    }
}

initBusinessStore();
