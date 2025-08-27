import { of, from } from 'rxjs';
import { map, filter, reduce, scan, pluck, tap, take, skip, distinctUntilChanged } from 'rxjs/operators';
const users = [
    { id: 1, name: 'Alice', age: 25, active: true },
    { id: 2, name: 'Bob', age: 14, active: true },
    { id: 3, name: 'Charlie', age: 35, active: false },
    { id: 4, name: 'David', age: 40, active: true },
    { id: 5, name: 'Eve', age: 45, active: false },
    { id: 6, name: 'Frank', age: 16, active: true },
    { id: 7, name: 'Grace', age: 55, active: false },
    { id: 8, name: 'Hank', age: 17, active: true },
    { id: 9, name: 'Ivy', age: 30, active: false },
    { id: 10, name: 'Jack', age: 17, active: true }
];
const numbers = [1, 2, 2, 3, 3, 3, 4, 5, 5, 1, 6];
console.log("=== Operateurs de transformation ===");
from(users).pipe(map(user => ({
    ...user,
    name: user.name.toUpperCase(),
    canVote: user.age >= 18
}))).subscribe(user => console.log('map : ', user));
from(users).pipe(filter(user => user.active && user.age > 25)).subscribe(user => console.log('filter actifs > 25 : ', user));
from(numbers).pipe(reduce((acc, val) => acc + val, 0)).subscribe(result => console.log('reduce total : ', result));
from(numbers).pipe(scan((acc, val) => acc + val, 0)).subscribe(accumulation => console.log('Scan accumulation : ', accumulation));
from(users).pipe(map(user => user.name)).subscribe(name => console.log('noms : ', name));
from(numbers).pipe(distinctUntilChanged()).subscribe(unique => console.log('distinctUntilChanged : ', unique));
from(users).pipe(take(2), skip(1)).subscribe(user => console.log('take(2) + skip(1) : ', user));
//# sourceMappingURL=transformation.js.map