import {BehaviorSubject} from 'rxjs';
import {map, filter} from 'rxjs/operators';

interface User{
    id: number;
    name: string;
    age: number;
}

const userStore = new BehaviorSubject<User | null>(null);

userStore.pipe(
    filter((user): user is User => user !== null),
    map(user => user.age >= 18 ? `${user.name} est majeur` : `${user.name} est mineur`)
).subscribe(msg => console.log(msg));

userStore.next({id: 1, name: 'Alice', age: 17});
userStore.next({id: 2, name: 'Bob', age: 25});
userStore.next(null);
userStore.next({id: 3, name: 'Charlie', age: 30});
userStore.next({id: 4, name: 'David', age: 18});