// /js/map/poiLayer.js
import { eventBus } from '../core/eventBus.js';

let activeMarker = null;

/**
 * Inicializa os POIs de negócios no mapa.
 * @param {L.Map} map 
 * @param {Array} negocios 
 */
export function initPoiLayer(map, negocios) {

    negocios.forEach(negocio => {
        if (!negocio.poi?.enabled) return;

        const categoria = negocio.categoria; // categoria string
        const iconHTML = negocio.premium && negocio.logo
            ? `<img src="${negocio.logo}" class="avatar" />`
            : `<i class="fa fa-${negocio.categoria.toLowerCase()}"></i>`;

        const html = buildPOIContent(negocio, iconHTML);

        const icon = L.divIcon({
            html,
            className: '', // evita CSS padrão do Leaflet
            iconSize: [32, 32],
            iconAnchor: [16, 32]
        });

        const marker = L.marker(negocio.geo.coords, { icon }).addTo(map);

        marker.on('click', () => handleMarkerClick(marker, negocio, map));
    });
}

/**
 * Monta o conteúdo HTML do POI
 */
function buildPOIContent(negocio, iconHTML) {
    return `
    <div class="property ${negocio.premium ? 'premium' : ''}">
        <div class="icon">
            ${iconHTML}
        </div>
        <div class="details">
            <div class="name">${negocio.nome}</div>
            <div class="address">${shortAddress(negocio.endereco)}</div>
            <div class="actions">
                ${negocio.website?.enabled ? `<a href="${negocio.website.url}" target="_blank" class="btn btn-sm btn-outline-primary">Website</a>` : ''}
                ${negocio.telefone ? `<a href="https://wa.me/${formatPhone(negocio.telefone)}" target="_blank" class="btn btn-sm btn-success">WhatsApp</a>` : ''}
            </div>
        </div>
    </div>
    `;
}

/**
 * Função utilitária para resumir endereço
 */
function shortAddress(fullAddress) {
    const parts = fullAddress.split(' - ');
    return parts[0]; // retorna só a rua
}

/**
 * Formata telefone para link WhatsApp
 */
function formatPhone(phone) {
    // Remove caracteres não numéricos
    return phone.replace(/\D/g, '');
}

/**
 * Evento de clique no marker
 */
function handleMarkerClick(marker, negocio, map) {
    const el = marker.getElement().querySelector('.property');
    const latlng = marker.getLatLng();
    const willOpen = !el.classList.contains('highlight');

    // Fecha POI anterior
    if (activeMarker && activeMarker !== el) {
        activeMarker.classList.remove('highlight');
    }

    if (willOpen) {
        // Centraliza mapa
        map.panTo(latlng, { animate: true });
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
