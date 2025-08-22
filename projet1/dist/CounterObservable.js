import { Observable } from 'rxjs';
class CounterObservable extends Observable {
    value = 0;
    constructor() {
        super(subscriber => {
            const intervalId = setInterval(() => {
                this.value++;
                subscriber.next(this.value);
                if (this.value >= 10) {
                    subscriber.complete();
                }
            }, 1000);
            return () => {
                clearInterval(intervalId);
                console.log('Compteur arrêté et nettoyé');
            };
        });
    }
    reset() {
        this.value = 0;
    }
}
const counter$ = new CounterObservable();
console.log('Démarrage du compteur...');
const subscription = counter$.subscribe({
    next: value => console.log(`Counter : ${value}`),
    complete: () => console.log('Compteur terminé')
});
setTimeout(() => {
    console.log('Réinitialisation ...');
    subscription.unsubscribe();
    counter$.reset();
    counter$.subscribe(v => console.log(`Nouveau compteur : ${v}`));
}, 3000);
//# sourceMappingURL=CounterObservable.js.map