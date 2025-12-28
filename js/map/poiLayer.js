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

export function initPoiLayer(map, negocios, categorias) {

    if (!map || !Array.isArray(negocios)) return;
console.log(negocios,categorias)
    negocios
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

