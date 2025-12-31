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

export function renderFullWebSite({ city, business }) {
    const fullwebsite = renderFullSite({ city, business });

}

function renderModalSite({ city, business }) {
    const root = document.getElementById('modal-site-root');
    if (!root) return;

    root.innerHTML = `
        <div class="bg-light">
            <header class="bg-dark text-white py-3">
                <div class="container">
                    <h1 class="h4 m-0">${business.nome}</h1>
                </div>
            </header>

            <section class="p-4 text-center">
                <h2 class="fw-bold mb-3">
                    Este é um site demonstrativo
                </h2>
                <p class="mb-4">
                    Seu negócio pode ter um site como este,
                    integrado ao mapa de serviços de ${city.cidade}.
                </p>
                <a href="https://wa.me/${business.whatsapp || ''}"
                   class="btn btn-success btn-lg">
                   Quero meu site
                </a>
            </section>
        </div>
    `;

    console.log('[siteRenderer] site MODAL renderizado:', business.slug);
}

export async function renderPremiumSite({ city, business, container }) {
 
    // limpa o modal
    container.innerHTML = '';

    // carrega a máscara
    const res = await fetch('/negocio/index.html');
    const html = await res.text();
    console.log(html);
    // injeta a máscara no modal
    container.innerHTML = html;

    // expõe o contexto ANTES da máscara rodar
    window.__MOTG_CONTEXT__ = {
        source: 'modal',
        city,
        business
    };

    // carrega o JS da máscara manualmente
    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/negocio/negocio.js';

    container.appendChild(script);
}


// 🔥 DOMÍNIO PRÓPRIO → SITE COMPLETO
eventBus.on('business:data', ({ source, city, business }) => {
    if (source === 'domain') {
        renderFullSite({ city, business });
    }
});

// 🔥 MAPONTHEGO → MODAL
eventBus.on('site:render', ({ target, city, business }) => {
    if (target === 'modal') {
        renderPremiumSite({ city, business });
    }

    if (target === 'url') {
        renderPremiumSite({ city, business });
    }
});
