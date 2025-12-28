import { initPoiLayer } from './poiLayer.js';

eventBus.on('city:loaded', city => {
    initPoiLayer(map, city);
});
