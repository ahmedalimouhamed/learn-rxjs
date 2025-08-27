import {Subject} from 'rxjs';
import {withLatestFrom, map} from 'rxjs/operators';

const userAction$ = new Subject<string>();
const authToken$ = new Subject<string>();

const securedRequest$ = userAction$.pipe(
    withLatestFrom(authToken$),
    map(([action, token]) => `Action "${action}" envoyée avec token : ${token}`)
);

securedRequest$.subscribe(console.log);

authToken$.next('token_123');
userAction$.next('DELETE_ITEM');