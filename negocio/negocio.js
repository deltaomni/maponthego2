import '../js/core/businessStore.js';
import '../js/modal/siteRenderer.js';

import { eventBus } from '../js/core/eventBus.js';
import { renderFullSite } from '../js/modal/siteRenderer.js';

// inicializa o resolver (side-effect)
import '../js/core/businessStore.js';

eventBus.on('business:data', ({ city, business }) => {
    renderFullWebSite({ city, business });
});


