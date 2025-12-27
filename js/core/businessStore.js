import { eventBus } from './eventBus.js';

export function initBusinessStore() {
  const host = location.hostname;

  // slug provisório
  const slug = host.split('.')[0];

  console.log('[businessStore] negócio:', slug);

  const root = document.getElementById('business-root');
  if (root) {
    root.innerText = `Site do negócio: ${slug}`;
  }

  eventBus.emit('business:ready', { slug });
}

initBusinessStore();
