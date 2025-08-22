import {of, from} from 'rxjs';

const numbers = [1,2,3];

console.log('=== Tableaux ====');
of(numbers).subscribe(val => console.log('of([1,2,3]) : ', val));

from(numbers).subscribe(val => console.log('from([1,2,3]) : ', val));

const message = 'Hi';

console.log("=== STRING ===");
of(message).subscribe(val => console.log('of("Hi") : ', val));

from(message).subscribe(val => console.log('from("Hi")', val));

const promise = Promise.resolve('Resultat de la promise');

console.log("=== PROMISE ===");

of(promise).subscribe(val => console.log('of(promise) : ', val));

from(promise).subscribe(val => console.log('from(promise) : ', val));