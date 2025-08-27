import { Observable, throwError, of } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
/*
const observableAvecErreur = new Observable<number>(subscriber => {
    let count = 0;
    const intervalId = setInterval(() => {
        count++;
        if(count === 3){
            subscriber.error(new Error('Erreur critique à count = 3'));
            return;
        }

        subscriber.next(count);
        if(count === 5){
            subscriber.complete();
        }
    }, 1000);

    return () => {
        clearInterval(intervalId);
        console.log('Interval nettoyé')
    }
})

observableAvecErreur.pipe(
    tap(value => console.log('valeur avant erreur : ', value)),
    catchError(error => {
        console.log('Erreur attrapée : ', error.message);
        return of('valeur de remplacement');
    })
).subscribe({
    next: value => console.log('Reçu : ', value),
    error: err => console.error('Erreur finale : ', err),
    complete: () => console.log('Terminé aven succès')
});

*/
//mecanisme de retry
const observableFragile = new Observable(subscriber => {
    const shouldFail = Math.random() > 0.3;
    if (shouldFail) {
        subscriber.error(new Error('Echec aléatoire'));
    }
    else {
        subscriber.next(42);
        subscriber.complete();
    }
});
observableFragile.pipe(retry(3), catchError(error => {
    console.error('Erreur après toutes les tentatives :', error.message);
    return of(0);
})).subscribe(result => {
    console.log('Resultat final après retry : ', result);
});
//# sourceMappingURL=errors.js.map