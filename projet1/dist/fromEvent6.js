import { Observable } from 'rxjs';
class MockWebSocket {
    listeners = {};
    on(type, listener) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type]?.push(listener);
    }
    off(type, listener) {
        if (!this.listeners[type])
            return;
        const index = this.listeners[type]?.indexOf(listener);
        if (index !== -1) {
            this.listeners[type]?.splice(index, 1);
        }
    }
    emit(type, data) {
        if (!this.listeners[type])
            return;
        this.listeners[type]?.forEach(listener => listener({ data }));
    }
    simulateConnection() {
        setTimeout(() => this.emit('open', {}), 500);
    }
    simulateMessage(message) {
        setTimeout(() => this.emit('message', { data: message }), 1000);
    }
}
function fromCustomEvent(target, eventName) {
    return new Observable(subscriber => {
        const listener = (event) => subscriber.next(event);
        target.on(eventName, listener);
        return () => target.off(eventName, listener);
    });
}
// Utilisation
const mockWebSocket = new MockWebSocket();
const open$ = fromCustomEvent(mockWebSocket, 'open');
const message$ = fromCustomEvent(mockWebSocket, 'message');
const error$ = fromCustomEvent(mockWebSocket, 'error');
open$.subscribe(() => {
    console.log("WebSocket connecté");
});
message$.subscribe((event) => {
    console.log("Message WebSocket :", event.data);
});
error$.subscribe((error) => {
    console.log('Erreur WebSocket :', error);
});
// Simulation
mockWebSocket.simulateConnection();
mockWebSocket.simulateMessage('Hello RxJS');
mockWebSocket.simulateMessage('Deuxième message');
mockWebSocket.emit('error', { message: 'Simulated error' });
//# sourceMappingURL=fromEvent6.js.map