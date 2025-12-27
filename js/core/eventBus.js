const listeners = {};

export const eventBus = {
  on(event, fn) {
    listeners[event] = listeners[event] || [];
    listeners[event].push(fn);
  },
  emit(event, payload) {
    (listeners[event] || []).forEach(fn => fn(payload));
  }
};
