import { Subject } from "rxjs";
import { scan } from 'rxjs/operators';
const subject = new Subject();
subject.pipe(scan((acc, curr) => acc + curr, 0)).subscribe(total => console.log("running total : ", total));
subject.next(3);
subject.next(5);
subject.next(10);
//# sourceMappingURL=scan1.js.map