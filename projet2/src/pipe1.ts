import {of, from} from 'rxjs';
import {map, filter, tap, reduce, catchError} from 'rxjs/operators';

const numbers$ = of(1,2,3,4,5,6,7,8,9,10);

numbers$.pipe(
    tap(val => console.log('Valeur originale : ', val)),
    filter(val => val % 2 === 0),
    tap(val => console.log('Valeur filtrée : ', val)),
    map(val => val * 2),
    tap(val => console.log('Valeur après transformation : ', val)),
    tap(val => console.log('Valeur finale après transformation : ', val))
).subscribe(result => console.log('Resultat final : ', result));

const risckyOperation$ = of('a', 2, 'b', 4, 'c').pipe(
    map((val: any) => {
        if(typeof val !== 'number'){
            throw new Error('Valeur non numérique : ', val);
        }
        return val * 2;
    }),

    catchError((error: any) => {
        console.log('Erreur attrapée', error);
        return of(0);
    })

)

risckyOperation$.subscribe(result => console.log('Valeur traitée : ', result));
