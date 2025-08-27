import { AsyncSubject, of } from 'rxjs';
import { delay } from 'rxjs/operators';
function fakeHttpRequest(url) {
    const result$ = new AsyncSubject();
    of(`Data from ${url}`).pipe(delay(2000)).subscribe(result => {
        result$.next(result);
        result$.complete();
    });
    return result$;
}
fakeHttpRequest("https://api.example.com/data").subscribe(console.log);
fakeHttpRequest("https://api.example.com/data").subscribe(console.log);
//# sourceMappingURL=AsyncSubject.js.map