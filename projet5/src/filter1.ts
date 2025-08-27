import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';

const subject = new Subject<number>();

subject.pipe(
    filter(x => x % 2 === 0)
).subscribe(val => console.log("Event number : ", val));

subject.next(1);
subject.next(2);
subject.next(3);
subject.next(4);