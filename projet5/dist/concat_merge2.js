import { Subject, merge } from 'rxjs';
import { map } from 'rxjs/operators';
const user1$ = new Subject();
const user2$ = new Subject();
const chat$ = merge(user1$.pipe(map(msg => `user1 : ${msg}`)), user2$.pipe(map(msg => `user2 : ${msg}`)));
chat$.subscribe(msg => console.log(msg));
user1$.next("Hello ! ");
user2$.next("Hello ! ");
user1$.next("How are you ?");
user2$.next("I'm fine, thanks !");
//# sourceMappingURL=concat_merge2.js.map