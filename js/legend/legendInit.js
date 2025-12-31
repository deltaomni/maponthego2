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

        <div class="legend-filters mb-3"></div>

        <ol class="list-group legend-list"></ol>
    `;
}
