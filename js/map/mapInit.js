import { eventBus } from '../core/eventBus.js';
import { initPoiLayer } from './poiLayer.js';

let map;

eventBus.on('city:loaded', city => {
    console.log('[mapInit] city:loaded → initMap');
    initMap(city);
});

function initMap(city) {

    console.log('[mapInit] init map');

    map = L.map('map', {
        zoomControl: false
    }).setView(
        city.center,
        city.zoom || 17
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // 🔥 AQUI ESTÁ A CHAVE
    initPoiLayer(
        map,
        city.negocios,
        city.categorias
    );

    setTimeout(() => map.invalidateSize(), 0);
}

