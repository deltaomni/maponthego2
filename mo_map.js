if (window.__IS_MAIN_DOMAIN__) {

    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(css);

    const js = document.createElement('script');
    js.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    js.onload = () => initMap();
    document.body.appendChild(js);

}

function initMap() {
    if (!window.__IS_MAIN_DOMAIN__) return;

    const map = L.map('map').setView([-22.116, -43.209], 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    // resto da lógica...
}