import { Observable } from 'rxjs';
import WebSocket from 'ws';
import { WebSocket as WS } from 'ws';



class WebSocketObservable extends Observable<string>{
    private ws: WebSocket | null = null;

    constructor(url: string){
        super(
            subscriber => {
                this.ws = new WebSocket(url);

                this.ws.onmessage = (event: any) => {
                    subscriber.next(event.data);
                };

                this.ws.onerror = (error: any) => {
                    subscriber.error(error);
                };

                this.ws.onclose = () => {
                    subscriber.complete();
                };

                return () => {
                    if(this.ws){
                        this.ws.close();
                    }
                }
            }
        );

    }

    send(message: string){
        if(this.ws && this.ws.readyState === WebSocket.OPEN){
            this.ws.send(message);
        }
    }
}

const mockWebSocker$ = new Observable<string>(subscriber => {
    const messages = [
        "connextion établie",
        "message 1 : Bounjour",
        "message 2 : Comment allez-vous ?",
        "message 3 : Au revoir"
    ];

    messages.forEach((msg, index) => {
        setTimeout(() => {
            subscriber.next(msg);
            if(index === messages.length - 1){
                subscriber.complete();
            }
        }, index * 1000)
    })
});

mockWebSocker$.subscribe({
    next: message => console.log(`${message} à ${new Date().toLocaleTimeString()}`),
    complete: () => console.log('Connexion terminée')
})