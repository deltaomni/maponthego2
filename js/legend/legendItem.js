import { eventBus } from '../core/eventBus.js';
import { openSiteModal } from '../modal/modalController.js';
import { renderPremiumSite } from '../modal/siteRenderer.js';
import { getCity } from '../core/cityStore.js'; // ou onde a city está


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

//document.addEventListener('click', (e) => {
//    const card = e.target.closest('.business-card');
//    if (!card) return;

//    openSiteModal();
//    const container = document.getElementById('modal-site-root');

//    const isPremium = card.dataset.premium === 'true';
//    container.innerHTML = isPremium
//        ? '<h1 style="font-size:48px">EU SOU SITE PREMIUM</h1>'
//        : '<h1 style="font-size:48px">EU SOU WEBSITE EXTERNO</h1>';
//});

//document.addEventListener('click', (e) => {
//    const card = e.target.closest('.business-card');
//    if (!card) return;

//    openSiteModal();
//    const container = document.getElementById('modal-site-root');

//    const isPremium = card.dataset.premium === 'true';

//    // ✅ ISSO CONTINUA — NÃO TOCA
//    container.innerHTML = isPremium
//        ? '<h1 style="font-size:48px">EU SOU SITE PREMIUM</h1>'
//        : '<h1 style="font-size:48px">EU SOU WEBSITE EXTERNO</h1>';

//    // 🔥 APENAS ACOPLAMENTO
//    if (isPremium) {
//        eventBus.emit('site:render', {
//            target: 'modal',
//            slug: card.dataset.id
//        });
//    }
//});

document.addEventListener('click', (e) => {
        const card = e.target.closest('.business-card');
        if (!card) return;

        openSiteModal();
        const container = document.getElementById('modal-site-root');
    const isPremium = card.dataset.premium === 'true';
if (!isPremium) {
    container.innerHTML =
        '<h1 style="font-size:48px">EU SOU WEBSITE EXTERNO</h1>';
    return;
}

console.log('[LEGEND CLICK] premium detectado');
console.log('[LEGEND CLICK] container:', container);
console.log('[LEGEND CLICK] card slug:', card.dataset.id);

// ⚠️ pega a cidade do jeito MAIS BURRO POSSÍVEL (sem abstração)
   // const city = window.__CITY__;
    console.log(getCity());
    const city = getCity();
console.log('[LEGEND CLICK] city:', city);

if (!city) {
    console.error('❌ window.__CITY__ NÃO EXISTE');
    return;
}

const business = city.negocios.find(
    n => n.slug === card.dataset.id
);

console.log('[LEGEND CLICK] business:', business);

if (!business) {
    console.error('❌ negócio não encontrado');
    return;
}

console.log('[LEGEND CLICK] chamando renderPremiumSite');

renderPremiumSite({
    city,
    business,
    container
});
});

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
