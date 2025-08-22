import {interval, timer} from 'rxjs';
import {take} from 'rxjs/operators';

const interval$ = interval(1000).pipe(take(10));

interval$.subscribe(val => {
    console.log('interval : ', val, ' à ', new Date().toLocaleTimeString());
});

console.log('Démarrage du timer...');

const timerSimple$ = timer(3000);

timerSimple$.subscribe(() => {
    console.log('Timer simple : 3 secondes écoulées!')
});

const timerPeriodique$ = timer(2000, 1000).pipe(take(4));

timerPeriodique$.subscribe(val => {
    console.log('Timer periodique : ', val, ' à ', new Date().toLocaleTimeString());
});