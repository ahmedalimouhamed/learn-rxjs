import { from } from 'rxjs';
const fromArray$ = from([10, 20, 30, 40, 50]);
fromArray$.subscribe(val => console.log('Array : ', val));
const maPromise = new Promise(resolve => {
    console.log('Attente de la promise...');
    setTimeout(() => resolve('Resultat de la promise'), 1000);
});
const fromPromise$ = from(maPromise);
fromPromise$.subscribe(val => console.log('Promise : ', val));
const fromString$ = from("Hello");
fromString$.subscribe(char => console.log('Caractère : ', char));
//# sourceMappingURL=from.js.map