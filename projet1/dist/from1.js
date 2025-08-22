import { from, of } from 'rxjs';
from([1, 2, 3, 4, 5]).subscribe({
    next: num => console.log('Nombre : ', num),
    complete: () => console.log('Array terminé!')
});
const array = [1, 2, 3];
from(array).subscribe(val => console.log('from array : ', val));
of(array).subscribe(val => console.log('of array : ', val));
//# sourceMappingURL=from1.js.map