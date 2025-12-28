// js/map/mapView.js
import { eventBus } from '../core/eventBus.js';

let map;
let markersLayer;
let activeMarker = null;

/* ============================
   INIT MAP
============================ */
function initMap(city) {
    if (map) return;

    const [lat, lng] = city.center;

    map = L.map('map').setView([lat, lng], city.zoom || 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    markersLayer = L.layerGroup().addTo(map);
}

/* ============================
   POI HTML (ORIGINAL VALIDADO)
============================ */
function buildPOIContent(n) {
    const type = n.type || 'shop';

    return `
        <div class="property d-flex">
            <div class="icon">
                <i class="fa fa-${type}"></i>
            </div>
            <div class="details">
                <div class="price">${n.price || ''}</div>
                <div class="address">${n.endereco || ''}</div>

                <div class="features d-flex flex-row">
                    ${n.bed ? `
                        <div>
                            <i class="fa fa-bed bed"></i>
                            <span>${n.bed}</span>
                        </div>` : ''}

                    ${n.bath ? `
                        <div>
                            <i class="fa fa-bath bath"></i>
                            <span>${n.bath}</span>
                        </div>` : ''}

                    ${n.size ? `
                        <div>
                            <i class="fa fa-ruler size"></i>
                            <span>${n.size}m²</span>
                        </div>` : ''}
                </div>
            </div>
        </div>
    `;
}

/* ============================
   RENDER POIs
============================ */
function renderPOIs(city) {
    markersLayer.clearLayers();

    city.negocios.forEach(n => {

        // 🔒 proteção absoluta
        if (
            typeof n.lat !== 'number' ||
            typeof n.lng !== 'number'
        ) return;

        const icon = L.divIcon({
            html: buildPOIContent(n),
            className: '',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });

        const marker = L.marker([n.lat, n.lng], { icon })
            .addTo(markersLayer);

        marker.on('click', () => onPOIClick(marker));
    });
}

/* ============================
   POI CLICK (100% IGUAL AO MVP)
============================ */
function onPOIClick(marker) {
    const el = marker.getElement()?.querySelector('.property');
    if (!el) return;

    const willOpen = !el.classList.contains('highlight');

    // Fecha o anterior
    if (activeMarker && activeMarker !== el) {
        activeMarker.classList.remove('highlight');
    }

    if (willOpen) {
        map.panTo(marker.getLatLng(), { animate: true });

        setTimeout(() => {
            el.classList.add('highlight');
            marker.setZIndexOffset(1000);
            activeMarker = el;
        }, 200);
    } else {
        el.classList.remove('highlight');
        marker.setZIndexOffset(0);
        activeMarker = null;
    }
}

/* ============================
   LEGENDA
============================ */
function renderLegend(city) {
    const container = document.getElementById('legendContent');
    if (!container) return;

    container.innerHTML = `
        <div class="list-group list-group-flush">
            ${city.negocios.map(n => `
                <button class="list-group-item list-group-item-action">
                    <strong>${n.nome}</strong>
                    <div class="small text-muted">
                        ${n.descricao || ''}
                    </div>
                </button>
            `).join('')}
        </div>
    `;
}

/* ============================
   EVENT BUS
============================ */
eventBus.on('city:loaded', city => {
    initMap(city);
    renderPOIs(city);
    renderLegend(city);
});
