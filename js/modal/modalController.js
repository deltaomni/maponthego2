import { eventBus } from '../core/eventBus.js';
import { openSiteModal } from './modalController.js'; // ajuste se necessário


eventBus.on('business:context', (context) => {
    if (context.source === 'url' && context.businessSlug) {
        console.log('[modalController] abrindo site demo:', context);

        openSiteModal({
            citySlug: context.citySlug,
            businessSlug: context.businessSlug
        });
    }
});
