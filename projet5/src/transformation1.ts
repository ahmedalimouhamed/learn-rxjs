import {Subject} from 'rxjs';
import {map, filter, scan, tap} from 'rxjs/operators';

const numbers$ = new Subject<number>();

const doubled$ = numbers$.pipe(
    map(n => n * 2),
    tap(n => console.log("apres map", n)),
    filter(n => n%4 === 0),
    tap(n => console.log("apres filter", n)),
    scan((acc, n) => acc + n, 0),
    tap(n => console.log("apres scan", n))
)

doubled$.subscribe(val => console.log("Accumulation : ", val));

numbers$.next(1);
numbers$.next(2);
numbers$.next(3);
numbers$.next(4);
numbers$.next(5);