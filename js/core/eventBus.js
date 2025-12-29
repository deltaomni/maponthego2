export const eventBus = {
    events: {},
    id: Math.random().toString(36).slice(2),

    on(event, handler) {
        (this.events[event] ||= []).push(handler);
    },

    emit(event, payload) {
        console.log(`[eventBus ${this.id}] emit →`, event);
        (this.events[event] || []).forEach(h => h(payload));
    }
};
