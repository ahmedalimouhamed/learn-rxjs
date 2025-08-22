import { fromEvent } from 'rxjs';
class CustomEventTarget {
    listeners = {};
    addEventListener(type, listener) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type]?.push(listener);
    }
    removeEventListener(type, listener) {
        if (!this.listeners[type])
            return;
        const index = this.listeners[type]?.indexOf(listener);
        if (index > -1) {
            this.listeners[type]?.splice(index, 1);
        }
    }
    dispatchEvent(event) {
        if (!this.listeners[event.type])
            return true;
        this.listeners[event.type]?.forEach(listener => listener(event));
        return true;
    }
}
const customTarget = new CustomEventTarget();
const customClick$ = fromEvent(customTarget, 'click');
const customMessage$ = fromEvent(customTarget, 'message');
customClick$.subscribe((event) => {
    console.log('Click custom reçu : ', event.detail);
});
customMessage$.subscribe((event) => {
    console.log('Message Custom : ', event.detail);
});
setTimeout(() => {
    const clickEvent = new CustomEvent('click', { detail: { x: 100, y: 200 } });
    customTarget.dispatchEvent(clickEvent);
}, 1000);
setTimeout(() => {
    const messageEvent = new CustomEvent('message', { detail: 'Hello fromEvent!' });
    customTarget.dispatchEvent(messageEvent);
}, 2000);
//# sourceMappingURL=fromEvent4.js.map