import { eventBus } from '../js/core/eventBus.js';
import { renderFullWebSite } from '../js/modal/siteRenderer.js';

// 1️⃣ CONTEXTO INJETADO (modal premium)
const injectedContext = window.__MOTG_CONTEXT__;

if (injectedContext) {
    const { city, business } = injectedContext;

    renderFullWebSite({ city, business });

    // 🚫 NÃO escuta eventos se já renderizou
    console.log('[negocio] render via contexto injetado');
    return;
}

// 2️⃣ FLUXO NORMAL (domínio próprio / URL direta)
import('../js/core/businessStore.js');

// 3️⃣ ESCUTA PADRÃO
eventBus.on('business:data', ({ city, business }) => {
    renderFullWebSite({ city, business });
});
