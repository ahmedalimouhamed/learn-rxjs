import { Observable } from "rxjs";

const obs$ = new Observable<string>((subscriber) => {
    subscriber.next("Hello");
    subscriber.next("world");
    subscriber.complete();
});

obs$.subscribe({
    next: (value) => console.log("Got : ", value),
    error: (err) => console.error("Error : ", err),
    complete: () => console.log("completed!")
})