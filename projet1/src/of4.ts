import {of} from 'rxjs';
import {map, filter, tap} from 'rxjs/operators';

of(1,2,3,4,5,6,7,8,9,10).pipe(
    tap(val => console.log('Valeur originale : ', val)),
    filter(val => val % 2 === 0),
    tap(val => console.log('Valeur filtrée : ', val)),
    map(val => val * 10),
    tap(val => console.log('Valeur transformée : ', val))
).subscribe(result => console.log('Resultat final : ', result))