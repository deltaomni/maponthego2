import { eventBus } from '../core/eventBus.js';

let modalEl = null;

export function openBusinessModal({ city, business, mode = 'demo' }) {
    if (modalEl) return;

    modalEl = document.createElement('div');
    modalEl.id = 'motg-business-modal';

    modalEl.innerHTML = `
        <div class="modal-backdrop fade show"></div>
        <div class="modal d-block" tabindex="-1">
            <div class="modal-dialog modal-fullscreen">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${business.nome}</h5>
                        <button type="button" class="btn-close"></button>
                    </div>
                    <div class="modal-body p-0">
                        <div id="modal-business-root"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalEl);

    modalEl.querySelector('.btn-close')
        .addEventListener('click', closeBusinessModal);

    // 🔥 AQUI ESTÁ O PONTO-CHAVE
    eventBus.emit('business:render', {
        target: 'modal',
        city,
        business,
        mode
    });
}

export function closeBusinessModal() {
    if (!modalEl) return;
    modalEl.remove();
    modalEl = null;
}
