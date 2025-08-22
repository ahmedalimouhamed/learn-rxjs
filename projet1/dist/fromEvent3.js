import { fromEvent, Observable } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
class KeyboaedSimulator {
    keys = "abcdefghijklmopqrstuvwxzy0123456789";
    isShiftPressed = false;
    simulatekeyPress() {
        return new Observable(subscriber => {
            const interval = setInterval(() => {
                const randomKey = this.keys[Math.floor(Math.random() * this.keys.length)];
                const key = this.isShiftPressed ? randomKey?.toUpperCase() : randomKey;
                const simulatedEvent = {
                    key: key,
                    code: `Key${key?.toUpperCase()}`,
                    shiftKey: this.isShiftPressed,
                    type: 'keydown'
                };
                subscriber.next(simulatedEvent);
                if (Math.random() > 0.8) {
                    this.isShiftPressed = !this.isShiftPressed;
                }
            }, 500);
            return () => clearInterval(interval);
        });
    }
    simulateSpecialKeys() {
        const specialKeys = ['Enter', 'Escape', 'Shape', 'Backspace', 'Tab'];
        return new Observable(subscriber => {
            const interval = setInterval(() => {
                const key = specialKeys[Math.floor(Math.random() * specialKeys.length)];
                const simulatesEvent = {
                    key: key,
                    code: key === 'Space' ? 'Space' : `key${key}`,
                    type: 'keydown'
                };
                subscriber.next(simulatesEvent);
            }, 2000);
            return () => clearInterval(interval);
        });
    }
}
const keyboardSim = new KeyboaedSimulator();
keyboardSim.simulatekeyPress().pipe(map(event => ({
    key: event.key,
    shift: event.shiftKey,
    timestamp: new Date().toLocaleTimeString()
}))).subscribe(key => console.log('Touche pressée : ', key));
keyboardSim.simulateSpecialKeys().pipe(filter(event => event.key === 'Enter')).subscribe(event => {
    console.log('Enter pressé! soumission du formulaire...');
});
//# sourceMappingURL=fromEvent3.js.map