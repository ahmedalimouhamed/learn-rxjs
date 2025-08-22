import { Observable } from 'rxjs';

class MockWebSocket {
    private listeners: { [type: string]: Function[] } = {};

    on(type: string, listener: Function) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type]?.push(listener);
    }

    off(type: string, listener: Function) {
        if (!this.listeners[type]) return;
        const index = this.listeners[type]?.indexOf(listener);
        if (index !== -1) {
            this.listeners[type]?.splice(index as number, 1);
        }
    }

    emit(type: string, data: any) {
        if (!this.listeners[type]) return;
        this.listeners[type]?.forEach(listener => listener({ data }));
    }

    simulateConnection() {
        setTimeout(() => this.emit('open', {}), 500);
    }

    simulateMessage(message: string) {
        setTimeout(() => this.emit('message', { data: message }), 1000);
    }
}

function fromCustomEvent(target: MockWebSocket, eventName: string): Observable<any> {
    return new Observable(subscriber => {
        const listener = (event: any) => subscriber.next(event);
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

message$.subscribe((event: any) => {
    console.log("Message WebSocket :", event.data);
});

error$.subscribe((error: any) => {
    console.log('Erreur WebSocket :', error);
});

// Simulation
mockWebSocket.simulateConnection();
mockWebSocket.simulateMessage('Hello RxJS');
mockWebSocket.simulateMessage('Deuxième message');
mockWebSocket.emit('error', { message: 'Simulated error' });