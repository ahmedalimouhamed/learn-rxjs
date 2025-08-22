import {of, Observable} from 'rxjs';

const numbers$: Observable<number> = of(1, 2, 3, 4, 5);
const fruits$: Observable<string> = of("pomme", "poire", "orange");

numbers$.subscribe(
    (valeur: number) => console.log('subscriber -1 Nombre : ', valeur),
    (error: Error | unknown) => console.error('subscriber -1 Error : ', error),
    () => console.log('Flux de nombre terminé')
)