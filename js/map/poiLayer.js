import { eventBus } from '../core/eventBus.js';
import { cityStore } from '../core/cityStore.js';

let map;
let activeCard = null;

function buildPOI(negocio, categoria) {
    return `
    <div class="property ${negocio.premium ? 'premium' : ''}"
         style="--poi-color: ${categoria.color}">
         
        <div class="icon">
            <i class="fa fa-${categoria.icon}"></i>
        </div>

        <div class="details">
            <div class="price fw-bold">${negocio.nome}</div>
            <div class="address">${negocio.endereco}</div>
        </div>
    </div>
    `;
}

function addBusinessPOIs() {
    const city = cityStore.getCity();
    if (!city || !city.negocios) return;

    const categorias = city.categorias || {};

    city.negocios
        .filter(n =>
            n.poi?.enabled &&
            n.geo?.coords?.length === 2
        )
        .forEach(negocio => {

            const categoria = categorias[negocio.categoria];
            if (!categoria) return;

            const [lat, lng] = negocio.geo.coords;

            const icon = L.divIcon({
                html: buildPOI(negocio, categoria),
                className: '',
                iconSize: [30, 30],
                iconAnchor: [15, 30]
            });

            const marker = L.marker([lat, lng], { icon }).addTo(map);

            marker.on('click', () => {
                const el = marker.getElement().querySelector('.property');
                const latlng = marker.getLatLng();
                const willOpen = !el.classList.contains('highlight');

                if (activeCard && activeCard !== el) {
                    activeCard.classList.remove('highlight');
                }

                if (willOpen) {
                    map.panTo(latlng, { animate: true });

                    setTimeout(() => {
                        el.classList.add('highlight');
                        marker.setZIndexOffset(1000);
                        activeCard = el;
                    }, 200);

                } else {
                    el.classList.remove('highlight');
                    marker.setZIndexOffset(0);
                    activeCard = null;
                }
            });
        });
}

/* =========================
   EVENTOS
========================= */

eventBus.on('map:ready', leafletMap => {
    map = leafletMap;
});

eventBus.on('city:loaded', () => {
    addBusinessPOIs();
});
