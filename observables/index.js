import { Observable } from "rxjs";
const obs$ = new Observable((subscriber) => {
    subscriber.next("Hello");
    subscriber.next("world");
    subscriber.complete();
});
obs$.subscribe({
    next: (value) => console.log("Got : ", value),
    error: (err) => console.error("Error : ", err),
    complete: () => console.log("completed!")
});
//# sourceMappingURL=index.js.map