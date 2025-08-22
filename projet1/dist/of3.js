import { of } from 'rxjs';
const user = { id: 1, name: 'alice', age: 25 };
of(user).subscribe((user) => {
    console.log('Utimisateur : ', user);
});
of([1, 2, 3, 4, 5, 6]).subscribe(arr => {
    console.log('Tableau reçu : ', arr);
    console.log('longeur : ', arr.length);
});
//# sourceMappingURL=of3.js.map