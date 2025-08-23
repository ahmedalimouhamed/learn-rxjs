import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
class MathOperations {
    static double(x) {
        return x * 2;
    }
    static square(x) {
        return x * x;
    }
}
const numbers$ = new Observable(subscriber => {
    subscriber.next(2);
    subscriber.next(3);
    subscriber.next(4);
    subscriber.complete();
});
numbers$.pipe(map(value => MathOperations.double.call(null, value)), map(value => MathOperations.square.call(null, value))).subscribe(result => console.log('Résultat : ', result));
//# sourceMappingURL=call1.js.map