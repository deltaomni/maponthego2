import { eventBus } from '../core/eventBus.js';

function renderFullSite({ city, business }) {
    const root = document.getElementById('business-root');
    if (!root) return;

    root.innerHTML = `
        <!-- Header -->
        <header class="bg-dark text-white py-4">
            <div class="container d-flex justify-content-between align-items-center">
                <h1 class="h4 m-0">${business.nome}</h1>
                <a href="https://wa.me/${business.whatsapp || ''}"
                   class="btn btn-success">
                   Falar no WhatsApp
                </a>
            </div>
        </header>

        <!-- Hero -->
        <section class="py-5 bg-light">
            <div class="container text-center">
                <h2 class="fw-bold mb-3">
                    ${business.slogan || 'Seu negócio no mapa de serviços de ' + city.cidade}
                </h2>
                <p class="text-muted mb-4">
                    Atendimento profissional em ${city.cidade}.
                </p>
                <a href="https://wa.me/${business.whatsapp || ''}"
                   class="btn btn-primary btn-lg">
                   Solicitar atendimento
                </a>
            </div>
        </section>

        <!-- Serviços -->
        <section class="py-5">
            <div class="container">
                <h3 class="mb-4 text-center">Serviços</h3>
                <div class="row g-4">
                    ${(business.servicos || []).map(s => `
                        <div class="col-md-4">
                            <div class="card h-100 shadow-sm">
                                <div class="card-body">
                                    <h5 class="card-title">${s}</h5>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <!-- Mapa (placeholder) -->
        <section class="py-5 bg-light">
            <div class="container text-center">
                <h3 class="mb-3">Onde estamos</h3>
                <div class="ratio ratio-16x9 bg-secondary text-white d-flex align-items-center justify-content-center">
                    <span>Mapa será carregado aqui</span>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="py-4 bg-dark text-white text-center">
            <small>
                ${business.nome} · ${city.cidade}/${city.uf}<br/>
                Presente no MapOnTheGo
            </small>
        </footer>
    `;
}

//function renderFullSite({ city, business }) {
//    const root = document.getElementById('business-root');

//    if (!root) {
//        console.warn('[siteRenderer] #business-root não encontrado');
//        return;
//    }

//    root.innerHTML = `
//        <section style="padding:24px">
//            <h1>${business.nome}</h1>
//            <p><strong>Cidade:</strong> ${city.cidade} / ${city.uf}</p>
//            <p><strong>Categoria:</strong> ${business.categoria}</p>
//            <p><strong>Slug:</strong> ${business.slug}</p>

//            <hr />

//            <pre style="font-size:12px; background:#f5f5f5; padding:12px">
//${JSON.stringify(business, null, 2)}
//            </pre>
//        </section>
//    `;

//    console.log('[siteRenderer] site FULL renderizado:', business.slug);
//}

function renderModalSite({ city, business }) {
    console.log('[siteRenderer] site MODAL (placeholder):', business.slug);
}

eventBus.on('business:data', (payload) => {
    console.log('[siteRenderer] business:data recebido', payload);

    //if (payload.source === 'url') {
    //    renderFullSite(payload);
    //} else {
    //    renderModalSite(payload);
    //}
    if (payload.source === 'domain') {
        renderFullSite(payload);
    } else {
        renderModalSite(payload);
    }

});
