import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { scan, filter, map } from 'rxjs/operators';
const stock$ = new BehaviorSubject(100);
const commandes$ = new Subject();
const stockRestant$ = commandes$.pipe(scan((stock, commande) => stock - commande, stock$.value));
combineLatest([stockRestant$, commandes$])
    .pipe(map(([stock, commande]) => {
    return { commande, stock };
}), filter(({ stock }) => stock >= 0))
    .subscribe({
    next: ({ commande, stock }) => {
        console.log(`-> commande de ${commande} acceptée. stock restant: ${stock}`);
    },
    error: (err) => console.error('Erreur : ', err)
});
stockRestant$
    .pipe(filter((stock) => stock <= 0))
    .subscribe(() => {
    console.log('rupture de stock');
});
commandes$.next(20);
commandes$.next(30);
commandes$.next(40);
commandes$.next(15);
//# sourceMappingURL=mini-projet1.js.map