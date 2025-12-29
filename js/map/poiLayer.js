import { eventBus } from '../core/eventBus.js';

let mapInstance = null;
const markersBySlug = new Map();
let activeMarker = null;

/**
 * Inicializa os POIs de negócios no mapa.
 * @param {L.Map} map
 * @param {Array} negocios
 * @param {Object} categorias
 */

export function initPoiLayer(map, negocios, categorias) {
    mapInstance = map;

    const L = window.L;
    if (!L) {
        console.error('[poiLayer] Leaflet não carregado');
        return;
    }

    const premiumBounds = L.latLngBounds([]);

    negocios.forEach(negocio => {
        if (!negocio.poi?.enabled) return;

        const categoriaId = negocio.categoria;
        const categoria = categorias[categoriaId];

        if (!categoria) {
            console.warn('[poiLayer] categoria não encontrada:', categoriaId);
            return;
        }

        const iconHTML = resolveIconHTML(negocio, categoria);
        const html = buildPOIContent(negocio, iconHTML);

        const icon = L.divIcon({
            html,
            className: '',
            iconSize: [32, 32],
            iconAnchor: [16, 32]
        });

        const marker = L.marker(negocio.geo.coords, { icon }).addTo(map);
        markersBySlug.set(negocio.slug, marker);
        marker.on('click', () => handleMarkerClick(marker, negocio, map));

        // ⭐ coleta premiums
        if (negocio.premium) {
            premiumBounds.extend(negocio.geo.coords);
        }
    });

    // ⭐ Centralização inteligente
    if (premiumBounds.isValid()) {
        console.log('[poiLayer] centralizando pelos premiums');
        map.fitBounds(premiumBounds, {
            padding: [60, 60],
            maxZoom: 16,
            animate: true
        });
    }
}

eventBus.on('city:visibilityChanged', visibleNegocios => {

    const visibleSlugs = new Set(
        visibleNegocios.map(n => n.slug)
    );

    markersBySlug.forEach((marker, slug) => {
        if (visibleSlugs.has(slug)) {
            if (!mapInstance.hasLayer(marker)) {
                marker.addTo(mapInstance);
            }
        } else {
            if (mapInstance.hasLayer(marker)) {
                mapInstance.removeLayer(marker);
                marker.setZIndexOffset(0);

                if (activeMarker) {
                    const el = marker.getElement()?.querySelector('.property');
                    if (el === activeMarker) {
                        activeMarker = null;
                    }
                }
            }
        }
    });
});


function resolveIconHTML(negocio, categoria) {

    // Premium com logotipo
    if (negocio.premium && negocio.logobase64) {
        return `<img src="${negocio.logobase64}" class="avatar" />`;
    }

    // Ícone da categoria
    return `
        <i class="fa fa-${categoria.icon}"></i>
    `;
}

function buildPOIContent(negocio, iconHTML) {
    return `
    <div class="property ${negocio.premium ? 'premium' : ''}">
        <div class="icon">
            ${iconHTML}
        </div>
        <div class="details">
            <div class="name">${negocio.nome}</div>
            <div class="address">${shortAddress(negocio.endereco)}</div>
            <div class="actions d-flex justify-content-between">
                ${negocio.website?.enabled
            ? `<button class="btn btn-sm btn-outline-info js-open-website"
                    data-slug="${negocio.slug}">
                    Website
                </button>`
            : ''
        }
                ${negocio.telefone
            ? `<a href="https://wa.me/${formatPhone(negocio.telefone)}"
                          target="_blank"
                          class="btn btn-sm btn-light text-dark">
                          <i class="fa-brands fa-whatsapp"></i>
                       </a>`
            : ''
        }
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

eventBus.on('poi:focus', slug => {
    const marker = markersBySlug.get(slug);
    if (!marker || !mapInstance) return;

    const el = marker.getElement()?.querySelector('.property');
    if (!el) return;

    const latlng = marker.getLatLng();

    // Fecha POI anterior
    if (activeMarker && activeMarker !== el) {
        activeMarker.classList.remove('highlight');
    }

    // Centraliza e destaca
    mapInstance.panTo(latlng, { animate: true });

    setTimeout(() => {
        el.classList.add('highlight');
        marker.setZIndexOffset(1000);
        activeMarker = el;
    }, 200);
});
