import { of } from 'rxjs';
const observable$ = of('A', 'B', 'C');
const subscription = observable$.subscribe({
    next: valeur => console.log('Next : ', valeur),
    error: err => console.error('Error : ', err),
    complete: () => console.log('Terminé')
});
observable$.subscribe(valeur => console.log('Simple : ', valeur));
observable$.subscribe(valeur => console.log('Next : ', valeur), erreur => console.error('error : ', erreur), () => console.log('Terminé'));
//# sourceMappingURL=methode-subscription.js.map