import { fromEvent } from 'rxjs';
import { EventEmitter } from 'events';
const emitter = new EventEmitter();
const data$ = fromEvent(emitter, 'data');
const error$ = fromEvent(emitter, 'error');
const complete$ = fromEvent(emitter, 'complete');
data$.subscribe((data) => {
    console.log('Donnée reçue : ', data);
});
error$.subscribe((error) => {
    console.log("Erreur reçue : ", error);
});
complete$.subscribe(() => {
    console.log('complete emise');
});
setInterval(() => {
    emitter.emit('data', {
        value: Math.random() * 100,
        timestamp: new Date().toLocaleTimeString()
    });
}, 1000);
setTimeout(() => {
    emitter.emit('error', new Error('Simulates error'));
}, 3000);
setTimeout(() => {
    emitter.emit('complete');
}, 5000);
//# sourceMappingURL=fromEvent5.js.map