//import '../js/core/businessStore.js';
//import '../js/modal/siteRenderer.js';

eventBus.on('business:data', ({ city, business }) => {
    renderFullSite({ city, business });
});
