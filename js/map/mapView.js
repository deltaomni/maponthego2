import { eventBus } from '../core/eventBus.js';

let map;
let markers = [];

export function initMap(city) {
map = L.map('map', {
    zoomControl: false
}).setView(
    city.center,
    city.zoom || 14
);


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    renderPOIs(city.negocios);
}

function renderPOIs(negocios) {
    clearMarkers();

    negocios.forEach(negocio => {
        if (!negocio.lat || !negocio.lng) return;

        const marker = L.marker([negocio.lat, negocio.lng], {
            icon: buildIcon(negocio)
        }).addTo(map);

        marker.on('click', () => {
            eventBus.emit('poi:click', negocio);
        });

        markers.push(marker);
    });
}

function clearMarkers() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
}

function buildIcon(negocio) {
    return L.divIcon({
        className: 'motg-poi',
        html: `
          <div class="poi-dot ${negocio.premium ? 'premium' : ''}">
            <i class="fa-solid fa-location-dot"></i>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
    });
}
