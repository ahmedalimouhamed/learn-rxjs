import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { switchMap, shareReplay, finalize, share, exhaustMap, delay, tap, debounceTime } from 'rxjs/operators';
console.log("=== Patterns avancés ===");
function createCachedObservable() {
    let callCount = 0;
    return of("Data from expensive operation").pipe(delay(1000), tap(() => console.log('Appel API effectué : ', ++callCount)), shareReplay(1));
}
const cached$ = createCachedObservable();
cached$.subscribe(data => console.log('Premier abonné : ', data));
setTimeout(() => {
    cached$.subscribe(data => console.log('Deuxième abonné : ', data));
}, 500);
const userState$ = new BehaviorSubject({
    name: 'John Doe',
    loggedIn: false
});
userState$.subscribe(state => console.log('User state : ', state));
setTimeout(() => userState$.next({ name: 'Alice', loggedIn: true }), 1000);
setTimeout(() => userState$.next({ name: 'Alice', loggedIn: false }), 2000);
const searchTerm$ = new Subject();
searchTerm$.pipe(debounceTime(300), switchMap(term => of(`Resultat pour ${term}`).pipe(delay(500)))).subscribe(results => console.log('Resultats de recherche : ', results));
searchTerm$.next('a');
searchTerm$.next('ab');
searchTerm$.next('abc');
searchTerm$.next('abcd');
searchTerm$.next('abcde');
searchTerm$.next('abcdef');
setTimeout(() => searchTerm$.next('angular'), 300);
const loadingState$ = new BehaviorSubject(false);
function withLoading(observable) {
    loadingState$.next(true);
    return observable.pipe(finalize(() => loadingState$.next(false)));
}
loadingState$.subscribe(loading => console.log('Loading state : ', loading));
withLoading(of('Data').pipe(delay(1500))).subscribe(data => console.log('Data with loading : ', data));
//# sourceMappingURL=pratique1.js.map