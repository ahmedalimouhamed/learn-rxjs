import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';

const subject = new Subject<number>();

subject.pipe(
    map(x => x * 2)
).subscribe(val => console.log("Doubled : ", val));

subject.next(5);
subject.next(10);