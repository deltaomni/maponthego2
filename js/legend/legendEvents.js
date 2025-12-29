import { eventBus } from '../core/eventBus.js';
import { toggleCategoria, setSearch } from '../core/cityStore.js';


export function initLegendEvents() {

    document.addEventListener('click', e => {

        const card = e.target.closest('.business-card');
        if (card) {
            eventBus.emit('poi:focus', card.dataset.id);
        }

        const websiteBtn = e.target.closest('.js-open-website');
        if (websiteBtn) {
            eventBus.emit('website:open', websiteBtn.dataset.slug);
        }

        const badge = e.target.closest('.legend-filters [data-category]');

        if (badge) {
            badge.classList.toggle('inactive');
            toggleCategoria(badge.dataset.category);
        }

        const searchInput = document.querySelector('.legend-search input');
        if (searchInput) {
            searchInput.addEventListener('input', e => {
                setSearch(e.target.value);
            });
        }

    });
}

const MAX_HEIGHT = window.innerHeight * 0.7;
const MIN_VISIBLE = 100;

const minY = MAX_HEIGHT - MIN_VISIBLE; // recolhido
const maxY = 0;                        // expandido

const MOBILE_BREAKPOINT = 992;

function isMobile() {
    return window.innerWidth < MOBILE_BREAKPOINT;
}

export function initLegendDrag() {
    const panel = document.getElementById('legend-panel');
    const handle = document.getElementById('legend-handle');

    if (!panel || !handle) return;

    // 🚫 DESKTOP → desativa drag
    if (!isMobile()) {
        panel.style.transform = '';
        panel.style.transition = '';
        return;
    }

    const maxHeight = window.innerHeight * 0.7;
    const minVisible = 100;

    const minY = maxHeight - minVisible;
    const maxY = 0;

    let startY = 0;
    let startTranslate = minY;
    let currentTranslate = minY;
    let dragging = false;

    // estado inicial (mobile)
    panel.style.transform = `translateY(${minY}px)`;

    handle.addEventListener('touchstart', e => {
        dragging = true;
        startY = e.touches[0].clientY;
        panel.style.transition = 'none';

        const matrix = new WebKitCSSMatrix(
            getComputedStyle(panel).transform
        );
        startTranslate = matrix.m42;
    });

    window.addEventListener('touchmove', e => {
        if (!dragging) return;

        const delta = e.touches[0].clientY - startY;
        let next = startTranslate + delta;

        next = Math.max(maxY, Math.min(minY, next));

        panel.style.transform = `translateY(${next}px)`;
        currentTranslate = next;
    });

    window.addEventListener('touchend', () => {
        dragging = false;
        panel.style.transition = 'transform 0.25s ease-out';

        const midpoint = minY / 2;

        panel.style.transform =
            currentTranslate < midpoint
                ? `translateY(${maxY}px)`
                : `translateY(${minY}px)`;
    });
}

window.addEventListener('resize', () => {
    const panel = document.getElementById('legend-panel');
    if (!panel) return;

    if (!isMobile()) {
        panel.style.transform = '';
        panel.style.transition = '';
    }
});




