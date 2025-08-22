import {of} from 'rxjs';

const user = {id: 1, name: 'alice', age: 25};
of(user).subscribe((user: {id: number, name: string, age: number}) => {
    console.log('Utimisateur : ', user);
})

of([1,2,3,4,5,6]).subscribe(arr => {
    console.log('Tableau reçu : ', arr);
    console.log('longeur : ', arr.length)
})