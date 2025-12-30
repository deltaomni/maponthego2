export function renderCategories(categorias) {
    const container = document.querySelector('.legend-filters');
    if (!container) return;

    container.innerHTML = Object.values(categorias).map(cat => `
        <span class="badge rounded-pill"
              data-category="${cat.id}"
              style="background:${cat.color}">
            <i class="fa fa-${cat.icon}"></i> ${cat.label}
        </span>
    `).join('');
}
