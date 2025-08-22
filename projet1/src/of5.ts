import {of} from 'rxjs';
import {switchMap} from 'rxjs/operators';

function getMockData(){
    return of({id: 1, name: 'test user', active: true});
}

function getDefaultSettings(){
    return of({
        theme: "dark",
        language: 'fr',
        notifications: true
    });
}

of('user123').pipe(
    switchMap(userId => {
        return of({userId, data: 'user data'});
    })
).subscribe(result => console.log('Resultat : ', result));