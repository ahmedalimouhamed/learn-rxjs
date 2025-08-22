import {interval} from 'rxjs';
import {Subscription} from 'rxjs';

const source$ = interval(1000);

const subscriptions: Subscription[] = [];

const sub1 = source$.subscribe(val => console.log('Abonnement 1 : ', val));
subscriptions.push(sub1);

setTimeout(() => {
    const sub2 = source$.subscribe(val => console.log('Abonnement 2 ', val));
    subscriptions.push(sub2);
}, 2500);

setTimeout(() => {
    const sub3 = source$.subscribe(val => console.log('Abonnement 3 ', val));
    subscriptions.push(sub3);
}, 5000);

setTimeout(() => {
    console.log("Désabonnement de tous...");
    subscriptions.forEach(sub => sub.unsubscribe());
}, 10000)