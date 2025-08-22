import { Observable } from 'rxjs';
class EventEmitterSimulation {
    listeners = new Map();
    emit(eventName, data) {
        console.log('Événement "' + eventName + '" émis');
        const eventListeners = this.listeners.get(eventName) || [];
        eventListeners.forEach(listener => listener(data));
    }
    on(eventName, callback) {
        console.log('Écouteur ajouté pour l\'événement "' + eventName + '"');
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, []);
        }
        this.listeners.get(eventName).push(callback);
    }
    asObservable(eventName) {
        return new Observable(subscriber => {
            const listener = (data) => subscriber.next(data);
            this.on(eventName, listener);
            return () => {
                const listeners = this.listeners.get(eventName) || [];
                const index = listeners.indexOf(listener);
                if (index > -1) {
                    listeners.splice(index, 1);
                }
            };
        });
    }
}
const emitter = new EventEmitterSimulation();
const click$ = emitter.asObservable('click');
const message$ = emitter.asObservable('message');
click$.subscribe(event => {
    console.log('clic simulé reçu : ', event);
});
message$.subscribe(msg => {
    console.log('Message reçu : ', msg);
});
setTimeout(() => emitter.emit('click', { x: 100, y: 200 }), 1000);
setTimeout(() => emitter.emit('message', "Hello RxJs!"), 2000);
setTimeout(() => emitter.emit('click', { x: 300, y: 400 }), 3000);
//# sourceMappingURL=fromEvent1.js.map