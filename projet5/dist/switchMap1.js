import { Subject, of } from 'rxjs';
import { switchMap, delay, tap } from 'rxjs/operators';
const search$ = new Subject();
search$.pipe(tap(term => console.log('Recherche en cours : ', term)), switchMap(term => of(`Result for ${term}`).pipe(delay(500)))).subscribe(result => console.log(result));
search$.next("RxjS");
search$.next("Angular");
search$.next("React");
//# sourceMappingURL=switchMap1.js.map