import { eventBus } from '../core/eventBus.js';
import { initLegendDrag } from './legendEvents.js';

initLegendDrag();


export function initLegend(city) {
    const container = document.getElementById('legend-content');
    if (!container) return;

    container.innerHTML = `
        <div class="legend-search mb-2">
            <input type="search"
                   class="form-control"
                   placeholder="Buscar negócios">
        </div>

        <div class="legend-filters mb-3">
            ${buildCategoryFilters(city.categorias)}
        </div>

        <ol class="list-group legend-list">
            ${city.negocios.map(buildBusinessCard).join('')}
        </ol>
    `;
}

function buildCategoryFilters(categorias) {
    return Object.values(categorias).map(cat => `
        <span class="badge rounded-pill"
              data-category="${cat.id}"
              style="background:${cat.color}">
            <i class="fa fa-${cat.icon}"></i> ${cat.label}
        </span>
    `).join('');
}

function buildBusinessCard(n) {

    const logo = n.premium && n.logobase64
        ? `<img src="${n.logobase64}" class="business-logo">`
        : `<div class="business-logo placeholder"></div>`;

    return `
<li class="list-group-item business-card"
    data-id="${n.slug}"
    data-category="${n.categoria}"
    data-premium="${n.premium}">

    <div class="business-header">
        ${logo}
        <div class="flex-grow-1">
            <div class="fw-bold">${n.nome}</div>
            <small class="text-muted">${shortAddress(n.endereco)}</small>
        </div>
    </div>

    <div class="business-actions">
        ${n.website?.enabled
            ? `<button class="btn btn-sm btn-outline-primary js-open-website"
                      data-slug="${n.slug}">
                  Website
               </button>`
            : ''
        }
        ${n.telefone
            ? `<a class="btn btn-sm btn-light"
                  target="_blank"
                  href="https://wa.me/${formatPhone(n.telefone)}">
                  <i class="fa-brands fa-whatsapp"></i>
               </a>`
            : ''
        }
    </div>
</li>`;
}

function shortAddress(addr) {
    return addr.split(' - ')[0];
}

function formatPhone(p) {
    return p.replace(/\D/g, '');
}
