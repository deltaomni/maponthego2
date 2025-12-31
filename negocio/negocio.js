import '../js/core/businessStore.js';
import '../js/modal/siteRenderer.js';

import { eventBus } from '../js/core/eventBus.js';
import { renderFullWebSite } from '../js/modal/siteRenderer.js';

const injectedContext = window.__MOTG_CONTEXT__;
console.log(injectedContext);
// inicializa o resolver (side-effect)
import '../js/core/businessStore.js';

eventBus.on('business:data', ({ city, business }) => {
    renderFullWebSite({ city, business });
});
