import { Subject, interval, merge } from 'rxjs';
import { take } from 'rxjs/operators';
const clicks$ = new Subject();
const timer$ = interval(1000).pipe(take(3));
merge(clicks$, timer$).subscribe(value => console.log("Event : ", value));
clicks$.next("click1");
setTimeout(() => clicks$.next("click 2"), 500);
setTimeout(() => clicks$.next("click 3"), 1000);
setTimeout(() => clicks$.next("click 4"), 1500);
//# sourceMappingURL=subject_merge_interval.js.map