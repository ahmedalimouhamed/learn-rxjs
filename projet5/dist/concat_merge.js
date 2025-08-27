import { Subject, concat, merge } from 'rxjs';
const streamA$ = new Subject();
const streamB$ = new Subject();
//concat(streamA$, streamB$).subscribe(val => console.log("concat : ", val));
merge(streamA$, streamB$).subscribe(val => console.log("Merge : ", val));
streamA$.next("A1");
streamA$.next("A2");
streamA$.complete();
streamB$.next("B1");
streamB$.next("B2");
//# sourceMappingURL=concat_merge.js.map