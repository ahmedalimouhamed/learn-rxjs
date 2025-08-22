import { of, Observable } from 'rxjs';
const numbers$ = of(1, 2, 3, 4, 5);
const fruits$ = of("pomme", "poire", "orange");
numbers$.subscribe((valeur) => console.log('subscriber -1 Nombre : ', valeur), (error) => console.error('subscriber -1 Error : ', error), () => console.log('Flux de nombre terminé'));
//# sourceMappingURL=of.js.map