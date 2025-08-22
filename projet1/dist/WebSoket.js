import { Observable } from 'rxjs';
import WebSocket from 'ws';
import { WebSocket as WS } from 'ws';
class WebSocketObservable extends Observable {
    ws = null;
    constructor(url) {
        super(subscriber => {
            this.ws = new WebSocket(url);
            this.ws.onmessage = (event) => {
                subscriber.next(event.data);
            };
            this.ws.onerror = (error) => {
                subscriber.error(error);
            };
            this.ws.onclose = () => {
                subscriber.complete();
            };
            return () => {
                if (this.ws) {
                    this.ws.close();
                }
            };
        });
    }
    send(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(message);
        }
    }
}
const mockWebSocker$ = new Observable(subscriber => {
    const messages = [
        "connextion établie",
        "message 1 : Bounjour",
        "message 2 : Comment allez-vous ?",
        "message 3 : Au revoir"
    ];
    messages.forEach((msg, index) => {
        setTimeout(() => {
            subscriber.next(msg);
            if (index === messages.length - 1) {
                subscriber.complete();
            }
        }, index * 1000);
    });
});
mockWebSocker$.subscribe({
    next: message => console.log(`${message} à ${new Date().toLocaleTimeString()}`),
    complete: () => console.log('Connexion terminée')
});
//# sourceMappingURL=WebSoket.js.map