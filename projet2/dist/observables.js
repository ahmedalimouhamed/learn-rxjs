import { Observable, of, from, interval, fromEvent, timer } from 'rxjs';
//1observable manuel avec new Observable()
const observableManuel = new Observable(subscriber => {
    console.log('Observable exécuté');
    subscriber.next('Premier valeur');
    subscriber.next('dexième valeur');
    setTimeout(() => subscriber.next('valeur après timeout'), 1000);
    setTimeout(() => subscriber.complete(), 2000);
    return () => console.log('nettoyage des resources');
});
//2. of() pour des valeurs simples
const observableOf = of('a', 'b', 'c', [1, 2, 3]);
//3. from() - conversion depuis d'autre structures
const observableFromArray = from([10, 20, 30]);
const observableFromPromise = from(Promise.resolve('Promise resolved'));
//interval() - emet des valeurs à interval regular
const observableInterval = interval(1000);
//5. timer() - emet apres un délai
const observableTimer = timer(3000);
//Abonnement aux observables
console.log('=========Abonnement========');
//abonnement simple
observableOf.subscribe(value => console.log('of : ', value));
//Abonnement complet avec objet
observableManuel.subscribe({
    next: value => console.log('next : ', value),
    error: err => console.error('error : ', err),
    complete: () => console.log('complete')
});
//abonnement avec gestion du désabonnement
const subscription = observableInterval.subscribe(value => {
    console.log('Interval : ', value);
    if (value >= 5) {
        subscription.unsubscribe();
        console.log('Désabonnement abrès 5 valeurs');
    }
});
//# sourceMappingURL=observables.js.map