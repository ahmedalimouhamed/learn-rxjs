import { ReplaySubject } from 'rxjs';
import { scan } from 'rxjs/operators';
const cart$ = new ReplaySubject();
cart$.pipe(scan((total, itemPrice) => total + itemPrice, 0)).subscribe(total => console.log("Total : ", total));
cart$.next(10);
cart$.next(20);
cart$.next(5);
//# sourceMappingURL=replaySubject.js.map