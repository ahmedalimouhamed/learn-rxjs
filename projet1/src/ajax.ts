import {of, from} from 'rxjs';
import fetch from 'node-fetch';
import {catchError} from 'rxjs/operators';

const apiUrl = 'https://jsonplaceholder.typicode.com/users';

const users$ = from(fetch(apiUrl).then(res => res.json()));


users$.subscribe({
    next: (users: any) => console.log('Utilisateurs : ', users.slice(0, 2)),
    error: err => console.error('Erreur API : ', err),
    complete: () => console.log('Requête terminée')
});

/*
const userDetails$ = ajax.getJSON(`${apiUrl}/999`).pipe(
    catchError((error: any) => {
        console.log('Utilisateur non trouvé, utilisation des données par défaut');
        return of({
            id: 999,
            name: 'Utilisateur par défaut'
        })
    })
);

userDetails$.subscribe(user => console.log('Détail utilisateur : ', user))

*/