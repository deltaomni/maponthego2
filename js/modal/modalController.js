import { eventBus } from '../core/eventBus.js';

let modalRoot = null;

function ensureModal() {
    if (modalRoot) return modalRoot;

    modalRoot = document.createElement('div');
    modalRoot.id = 'site-modal';
    modalRoot.innerHTML = `
        <div class="modal-backdrop fade show"></div>
        <div class="modal d-block" tabindex="-1">
            <div class="modal-dialog modal-fullscreen">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Prévia do site</h5>
                        <button type="button" class="btn-close"></button>
                    </div>
                    <div class="modal-body p-0">
                        <div id="modal-site-root"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalRoot);

    modalRoot.querySelector('.btn-close')
        .addEventListener('click', closeModal);

    return modalRoot;
}

export function openSiteModal(payload) {
    const modal = ensureModal();

    eventBus.emit('site:render', {
        target: 'modal',
        ...payload
    });
}

export function closeModal() {
    if (!modalRoot) return;
    modalRoot.remove();
    modalRoot = null;
}



//import { eventBus } from '../core/eventBus.js';

///**
// * Abre o site do negócio no modal
// * (implementação provisória)
// */
//export function openSiteModal({ citySlug, businessSlug }) {
//    console.log('[modalController] openSiteModal', citySlug, businessSlug);

//    // por enquanto, apenas redireciona
//    const url = `/negocio/index.html?city=${citySlug}&site=${businessSlug}`;
//    window.location.href = url;
//}

///**
// * Escuta o contexto do negócio
// */
//eventBus.on('business:context', (context) => {
//    if (context.source === 'url' && context.businessSlug) {
//        console.log('[modalController] abrindo site demo:', context);

//        openSiteModal({
//            citySlug: context.citySlug,
//            businessSlug: context.businessSlug
//        });
//    }
//});
