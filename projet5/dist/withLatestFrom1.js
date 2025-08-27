import { Subject } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
const clicks$ = new Subject();
const position$ = new Subject();
clicks$.pipe(withLatestFrom(position$)).subscribe(([click, pos]) => console.log(`${click} at position ${pos}`));
position$.next(100);
position$.next(150);
clicks$.next("click1");
clicks$.next("click1");
position$.next(200);
position$.next(250);
clicks$.next("click2");
clicks$.next("click2");
//# sourceMappingURL=withLatestFrom1.js.map