import { eventBus } from './eventBus.js';

function getUrlContext() {
    const params = new URLSearchParams(location.search);

    const citySlug = params.get('city');
    const businessSlug = params.get('site');

    if (citySlug && businessSlug) {
        return {
            source: 'url',
            citySlug,
            businessSlug,
            isDemo: true
        };
    }

    return null;
}

function getDomainContext() {
    const domain = location.hostname;

    // provisório — API entra depois
    const businessSlug = domain.split('.')[0];

    return {
        source: 'domain',
        domain,
        businessSlug,
        citySlug: null,
        isDemo: false
    };
}

function resolveBusinessContext() {
    const urlContext = getUrlContext();
    if (urlContext) return urlContext;

    return getDomainContext();
}

export function initBusinessStore() {
    const context = resolveBusinessContext();

    console.log('[businessStore] context:', context);

    const root = document.getElementById('business-root');
    if (root) {
        root.innerText = `Negócio: ${context.businessSlug}`;
    }

    eventBus.emit('business:context', context);
    eventBus.emit('business:ready', { slug: context.businessSlug });
}

initBusinessStore();


//import { eventBus } from './eventBus.js';

//export function initBusinessStore() {
//    const host = location.hostname;

//    // slug provisório
//    const slug = host.split('.')[0];

//    console.log('[businessStore] negócio:', slug);

//    const root = document.getElementById('business-root');
//    if (root) {
//        root.innerText = `Site do negócio: ${slug}`;
//    }

//    eventBus.emit('business:ready', { slug });
//}

//initBusinessStore();


