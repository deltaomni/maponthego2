// js/map/mapView.js
import { eventBus } from '../core/eventBus.js';

let map;
let activePOI = null;
let markersLayer;

/* ============================
   INIT MAP
============================ */
export function initMap(city) {
    if (map) return;

    map = L.map('map').setView(
        [city.center.lat, city.center.lng],
        city.center.zoom || 14
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    markersLayer = L.layerGroup().addTo(map);
}

/* ============================
   POI HTML
============================ */
function buildPOIContent(n) {
    return `
        <div class="property">
            <div class="icon">
                <i class="fa fa-shop"></i>
            </div>
            <div class="details">
                <strong>${n.nome}</strong>
                <div class="text-muted small">
                    ${n.descricao || ''}
                </div>
            </div>
        </div>
    `;
}

/* ============================
   RENDER POIS
============================ */
export function renderPOIs(city) {
    if (!map) initMap(city);

    markersLayer.clearLayers();

    city.negocios.forEach(n => {

        if (!n.lat || !n.lng) return;

        const icon = L.divIcon({
            html: buildPOIContent(n),
            className: '',
            iconSize: [32, 32],
            iconAnchor: [16, 32]
        });

        const marker = L.marker([n.lat, n.lng], { icon })
            .addTo(markersLayer);

        marker.on('click', () => handlePOIClick(marker, n));
    });
}

/* ============================
   POI CLICK BEHAVIOR
============================ */
function handlePOIClick(marker, negocio) {
    const el = marker.getElement()?.querySelector('.property');
    if (!el) return;

    const willOpen = !el.classList.contains('highlight');

    if (activePOI && activePOI !== el) {
        activePOI.classList.remove('highlight');
    }

    if (willOpen) {
        map.panTo(marker.getLatLng(), { animate: true });

        setTimeout(() => {
            el.classList.add('highlight');
            marker.setZIndexOffset(1000);
            activePOI = el;
        }, 200);

        eventBus.emit('poi:selected', negocio);

    } else {
        el.classList.remove('highlight');
        marker.setZIndexOffset(0);
        activePOI = null;
    }
}

/* ============================
   LEGENDA
============================ */
export function renderLegend(city) {
    const container = document.getElementById('legendContent');
    if (!container) return;

    container.innerHTML = `
        <div class="list-group list-group-flush">
            ${city.negocios.map(n => `
                <button
                    class="list-group-item list-group-item-action"
                    data-id="${n.id}">
                    <strong>${n.nome}</strong>
                    <div class="small text-muted">
                        ${n.descricao || ''}
                    </div>
                </button>
            `).join('')}
        </div>
    `;

    container.querySelectorAll('[data-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            const negocio = city.negocios.find(
                n => n.id === btn.dataset.id
            );
            if (negocio) {
                eventBus.emit('legend:selected', negocio);
            }
        });
    });
}

/* ============================
   EVENT BUS WIRES
============================ */
eventBus.on('city:loaded', city => {
    initMap(city);
    renderPOIs(city);
    renderLegend(city);
});

eventBus.on('legend:selected', negocio => {
    map.panTo([negocio.lat, negocio.lng], { animate: true });
});

