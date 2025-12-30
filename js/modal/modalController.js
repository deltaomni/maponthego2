import { eventBus } from '../core/eventBus.js';

/**
 * Abre o site do negócio no modal
 * (implementação provisória)
 */
export function openSiteModal({ citySlug, businessSlug }) {
    console.log('[modalController] openSiteModal', citySlug, businessSlug);

    // por enquanto, apenas redireciona
    const url = `/negocio/index.html?city=${citySlug}&site=${businessSlug}`;
    window.location.href = url;
}

/**
 * Escuta o contexto do negócio
 */
eventBus.on('business:context', (context) => {
    if (context.source === 'url' && context.businessSlug) {
        console.log('[modalController] abrindo site demo:', context);

        openSiteModal({
            citySlug: context.citySlug,
            businessSlug: context.businessSlug
        });
    }
});
