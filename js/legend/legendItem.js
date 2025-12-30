
import { eventBus } from '../core/eventBus.js';

eventBus.on('city:visibilityChanged', updateLegendVisibility);

export function renderLegendItems(negocios) {
    const list = document.querySelector('.legend-list');
    if (!list) return;

    list.innerHTML = negocios.map(buildLegendItem).join('');
}

function buildLegendItem(n) {
    return `
<li class="list-group-item business-card"
    data-id="${n.slug}"
    data-category="${n.categoria}"
    data-premium="${n.premium}">

    <div class="business-shell">
        <!-- AQUI entra qualquer lógica futura -->
    </div>

</li>`;
}

export function hydrateLegendItems(negocios) {

    negocios.forEach(n => {
        const el = document.querySelector(
            `.business-card[data-id="${n.slug}"]`
        );
        if (!el) return;

        el.innerHTML = n.premium
            ? premiumMask(n)
            : basicMask(n);
    });
}

function basicMask(n) {
    return `
        <div class="fw-bold">${n.nome}</div>
        <small class="text-muted">${n.endereco.split(' - ')[0]}</small>
    `;
}

function premiumMask(n) {
    return `
        <div class="premium-item">
            <img src="${n.logobase64}">
            <div>${n.nome}</div>
        </div>
    `;
}


//Atuslizar legenda com categorias selecionadas:
function updateLegendVisibility(visibleNegocios) {

    const visibleSlugs = new Set(
        visibleNegocios.map(n => n.slug)
    );

    const cards = document.querySelectorAll('.business-card');
    const list = document.querySelector('.legend-list');
    if (!list) return;

    let visibleCount = 0;

    cards.forEach(card => {
        const slug = card.dataset.id;

        if (visibleSlugs.has(slug)) {
            card.classList.remove('d-none');
            visibleCount++;
        } else {
            card.classList.add('d-none');
        }
    });

    // estado vazio
    let empty = list.querySelector('.legend-empty');

    if (visibleCount === 0) {
        if (!empty) {
            empty = document.createElement('li');
            empty.className =
                'legend-empty list-group-item text-muted text-center';
            empty.innerText = 'Nenhum negócio encontrado';
            list.appendChild(empty);
        }
    } else {
        empty?.remove();
    }
}
