import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

class MathOperations{
    static double(x: number): number{
        return x * 2;
    }

    static square(x: number): number{
        return x * x;
    }

}

const numbers$ = new Observable<number>(subscriber => {
    subscriber.next(2);
    subscriber.next(3);
    subscriber.next(4);
    subscriber.complete();
});

numbers$.pipe(
    map(value => MathOperations.double.call(null, value)),
    map(value => MathOperations.square.call(null, value))
).subscribe(result => console.log('Résultat : ', result));