import { from, of } from 'rxjs';
import { filter, debounceTime, distinctUntilChanged, switchMap, tap, take, concatMap, delay } from 'rxjs/operators';
const searchSimulation$ = from(['a', 'ab', 'abc', 'abcd', 'abcde', 'abcdef', 'abcdefg', 'abcdefgh', 'abcdefghi', 'abcdefghij', 'abcdefghijk', 'abcdefghijkl', 'abcdefghijklm', 'abcdefghijklmn', 'abcdefghijklmno', 'abcdefghijklmnop', 'abcdefghijklmnopq', 'abcdefghijklmnopqr', 'abcdefghijklmnopqrs', 'abcdefghijklmnopqrst', 'abcdefghijklmnopqrstu', 'abcdefghijklmnopqrstuv', 'abcdefghijklmnopqrstuvw', 'abcdefghijklmnopqrstuvwx', 'abcdefghijklmnopqrstuvwxy', 'abcdefghijklmnopqrstuvwxyz']).pipe(concatMap((term, index) => of(term).pipe(delay(index * 50)) // Délai croissant pour chaque terme
))
    .pipe(tap(term => console.log('avant debounce tap : ', term)), debounceTime(5000), tap(term => console.log('apres debounce tap : ', term)), distinctUntilChanged(), tap(term => console.log('Recherche en cours : ', term)), filter(term => term.length >= 2), switchMap(term => {
    console.log('Appel API pour : ', term);
    return from([
        `${term} result 1`,
        `${term} result 2`,
        `${term} result 3`
    ]);
}), take(5));
searchSimulation$.subscribe(result => console.log('Resultat de recherche : ', result));
//# sourceMappingURL=pipe2.js.map