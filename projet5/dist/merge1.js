import { Subject, merge } from "rxjs";
const s1 = new Subject();
const s2 = new Subject();
merge(s1, s2).subscribe(val => console.log("Merged : ", val));
s1.next("Hello");
s2.next("World");
s1.next("Goodbye");
s2.next("World");
s1.complete();
s2.complete();
//# sourceMappingURL=merge1.js.map