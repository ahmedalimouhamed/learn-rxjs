import { Subject, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
const price$ = new Subject();
const quantity$ = new Subject();
const total$ = combineLatest([price$, quantity$]).pipe(map(([price, quantity]) => price * quantity));
total$.subscribe(total => console.log('total : ', total));
price$.next(10);
quantity$.next(2);
price$.next(12);
quantity$.next(5);
//# sourceMappingURL=combinaison1.js.map