import { eventBus } from '../core/eventBus.js';
eventBus.on('business:render', ({ target, city, business, mode }) => {
    if (target !== 'modal') return;

    const root = document.getElementById('modal-business-root');
    if (!root) {
        console.warn('[siteRenderer] modal root não encontrado');
        return;
    }

    root.innerHTML = `
        <header class="bg-dark text-white py-3">
            <div class="container">
                <h1 class="h4 m-0">${business.nome}</h1>
            </div>
        </header>

        <section class="p-4 text-center">
            <h2 class="fw-bold mb-3">
                ${mode === 'demo'
            ? 'Este é um site demonstrativo'
            : 'Site oficial'}
            </h2>

            <p class="mb-4">
                Atendimento em ${city.cidade}/${city.uf}
            </p>

            <a href="https://wa.me/${business.whatsapp || ''}"
               class="btn btn-success btn-lg">
               Falar no WhatsApp
            </a>
        </section>
    `;

    console.log('[siteRenderer] site renderizado no MODAL:', business.slug);
});
