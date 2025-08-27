import {Subject, concat, merge} from 'rxjs';

const streamA$ = new Subject<string>();
const streamB$ = new Subject<string>();

//concat(streamA$, streamB$).subscribe(val => console.log("concat : ", val));

merge(streamA$, streamB$).subscribe(val => console.log("Merge : ", val));

streamA$.next("A1");
streamA$.next("A2");

streamA$.complete();

streamB$.next("B1");
streamB$.next("B2");
