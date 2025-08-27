import { of } from 'rxjs';
import { map } from 'rxjs/operators';
class Calculator {
    static sum(...numbers) {
        return numbers.reduce((total, num) => total + num, 0);
    }
    static multiply(...numbers) {
        return numbers.reduce((total, num) => total * num, 1);
    }
}
const numberArrays$ = of([1, 2, 3], [4, 5, 6], [7, 8, 9]);
numberArrays$.pipe(map(numbers => {
    return Calculator.sum.apply(null, numbers);
})).subscribe(result => console.log('Somme : ', result));
numberArrays$.pipe(map(numbers => {
    return Calculator.multiply.apply(null, numbers);
})).subscribe(result => console.log('Produit : ', result));
//# sourceMappingURL=apply3.js.map