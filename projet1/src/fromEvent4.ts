import {fromEvent} from 'rxjs';

class CustomEventTarget implements EventTarget{
    private listeners: {[type: string]: EventListener[]} = {};

    addEventListener(type: string, listener: EventListener): void{
        if(!this.listeners[type]){
            this.listeners[type] = [];
        }

        this.listeners[type]?.push(listener);
    }

    removeEventListener(type: string, listener: EventListener): void{
        if(!this.listeners[type]) return;

        const index = this.listeners[type]?.indexOf(listener);

        if(index as number > -1){
            this.listeners[type]?.splice(index as number, 1);
        }
    }

    dispatchEvent(event: Event): boolean{
        if(!this.listeners[event.type]) return true;
        this.listeners[event.type]?.forEach(listener => listener(event));
        return true;
    }
}

const customTarget = new CustomEventTarget();

const customClick$ = fromEvent(customTarget, 'click');
const customMessage$ = fromEvent(customTarget, 'message');

customClick$.subscribe((event: Event) => {
    console.log('Click custom reçu : ', (event as CustomEvent).detail);
});

customMessage$.subscribe((event: Event) => {
    console.log('Message Custom : ', (event as CustomEvent).detail);
});

setTimeout(() => {
    const clickEvent = new CustomEvent('click', {detail: {x: 100, y: 200}});
    customTarget.dispatchEvent(clickEvent);
}, 1000);

setTimeout(() => {
    const messageEvent = new CustomEvent('message', {detail: 'Hello fromEvent!'});
    customTarget.dispatchEvent(messageEvent);
}, 2000)