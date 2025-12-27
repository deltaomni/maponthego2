import { eventBus } from './eventBus.js';

export function initBusinessStore() {
  const params = new URLSearchParams(location.search);
  const slug = params.get('site') || 'desconhecido';

  console.log('[businessStore] slug:', slug);

  document.getElementById('business-root').innerText =
    `Negócio carregado: ${slug}`;

  eventBus.emit('business:ready', { slug });
}

initBusinessStore();
