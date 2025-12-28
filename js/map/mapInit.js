import { initPoiLayer } from './poiLayer.js';

let map;
console.log("init map");
export function initMap(city) {

    map = L.map('map', {
        zoomControl: false
    }).setView(
        city.center, // ⚠️ array [lat, lng]
        city.zoom || 14
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    initPoiLayer(map, city.negocios);

    setTimeout(() => map.invalidateSize(), 0);
}

