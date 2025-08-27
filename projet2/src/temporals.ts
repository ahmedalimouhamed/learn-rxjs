import {interval, of, fromEvent, take} from 'rxjs';
import {debounceTime, throttleTime, delay, timeout, auditTime, sampleTime} from 'rxjs/operators';

console.log('=== Gestion du temps ===');

//debounceTime - attend que les emissions se calment
const inputSimulation$ = of('a', 'ab', 'abc', 'abcd', 'abcde', 'abcdef', 'abcdefg', 'abcdefgh', 'abcdefghi', 'abcdefghij', 'abcdefghijk', 'abcdefghijkl', 'abcdefghijklm', 'abcdefghijklmn', 'abcdefghijklmno', 'abcdefghijklmnop', 'abcdefghijklmnopq', 'abcdefghijklmnopqr', 'abcdefghijklmnopqrs', 'abcdefghijklmnopqrst', 'abcdefghijklmnopqrstu', 'abcdefghijklmnopqrstuv', 'abcdefghijklmnopqrstuvw', 'abcdefghijklmnopqrstuvwx', 'abcdefghijklmnopqrstuvwxy', 'abcdefghijklmnopqrstuvwxyz').pipe(
    delay(0),
    debounceTime(300)
)

inputSimulation$.subscribe(value => 
    console.log('debounceTime : ', value)
)

const rapidClicks$ = interval(100).pipe(take(20));

rapidClicks$.pipe(
    throttleTime(500)
).subscribe(value => 
    console.log('throttledTime : ', value)
);

of('Delayed message').pipe(
    delay(2000)
).subscribe(message => console.log('delay : ', message));

of('Slow response').pipe(
    delay(3000),
    timeout(2500)
).subscribe({
    next: value => console.log('timeout success : ', value),
    error: err => console.error('timeout error : ', err.message)
});

const continiousData$ = interval(100).pipe(take(50));

continiousData$.pipe(
    auditTime(500)
).subscribe(value => 
    console.log('auditTime : ', value)
);