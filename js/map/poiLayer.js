import { eventBus } from '../core/eventBus.js';

let map;
let markers = [];

export function initPoiLayer(leafletMap, negocios = []) {
    map = leafletMap;
    renderPOIs(negocios);
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
        className: '',
        html: `
          <div class="property">
            <div class="icon">
              <i class="fa-solid fa-location-dot"></i>
            </div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30]
    });
}
