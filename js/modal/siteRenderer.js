import { eventBus } from '../core/eventBus.js';

function renderFullSite({ city, business }) {
    const root = document.getElementById('business-root');

    if (!root) {
        console.warn('[siteRenderer] #business-root não encontrado');
        return;
    }

    root.innerHTML = `
        <section style="padding:24px">
            <h1>${business.nome}</h1>
            <p><strong>Cidade:</strong> ${city.cidade} / ${city.uf}</p>
            <p><strong>Categoria:</strong> ${business.categoria}</p>
            <p><strong>Slug:</strong> ${business.slug}</p>

            <hr />

            <pre style="font-size:12px; background:#f5f5f5; padding:12px">
${JSON.stringify(business, null, 2)}
            </pre>
        </section>
    `;

    console.log('[siteRenderer] site FULL renderizado:', business.slug);
}

function renderModalSite({ city, business }) {
    console.log('[siteRenderer] site MODAL (placeholder):', business.slug);
}

eventBus.on('business:data', (payload) => {
    console.log('[siteRenderer] business:data recebido', payload);

    if (payload.source === 'url') {
        renderFullSite(payload);
    } else {
        renderModalSite(payload);
    }
});
