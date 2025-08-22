import { fromEvent, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
class MouseSimulator {
    position = { x: 0, y: 0 };
    isMouseDown = false;
    simulateMouseMove() {
        return new Observable(subscriber => {
            const interval = setInterval(() => {
                this.position.x += Math.random() * 10 - 5;
                this.position.y += Math.random() * 10 - 5;
                const simulatedEvent = {
                    clientX: this.position.x,
                    clientY: this.position.y,
                    type: 'mousemove'
                };
                subscriber.next(simulatedEvent);
            }, 100);
            return () => clearInterval(interval);
        });
    }
    simulateClicks() {
        return new Observable(subscriber => {
            let clickCount = 0;
            const interval = setInterval(() => {
                clickCount++;
                const simulatedEvent = {
                    clientX: Math.random() * 500,
                    clientY: Math.random() * 500,
                    type: 'click',
                    button: 0
                };
                subscriber.next(simulatedEvent);
                if (clickCount >= 5) {
                    subscriber.complete();
                }
            }, 1500);
            return () => clearInterval(interval);
        });
    }
}
const mouseSim = new MouseSimulator();
mouseSim.simulateMouseMove().pipe(map(event => ({ x: event.clientX, y: event.clientY }))).subscribe(pos => {
    console.log('Position souris : ', pos);
});
mouseSim.simulateClicks().subscribe(event => {
    console.log('click à : ', event.clientX, event.clientY);
    console.log('click numéro : ', event.button);
});
//# sourceMappingURL=fromEvent2.js.map