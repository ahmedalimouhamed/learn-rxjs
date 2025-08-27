import {BehaviorSubject, combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';

const search$ = new BehaviorSubject<string>('');
const category$ = new BehaviorSubject<string>('all');

combineLatest([search$, category$]).pipe(
    map(([search, category]) => `Recherche : ${search} | Categorie : ${category}`)
).subscribe(console.log);

search$.next("pizza");
category$.next("food");
search$.next("burger");
category$.next("food");
search$.next("pizza");
category$.next("drink");
