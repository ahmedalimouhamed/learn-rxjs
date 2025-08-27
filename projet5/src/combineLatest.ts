import {Subject, combineLatest} from 'rxjs';

const age$ = new Subject<number>();
const name$ = new Subject<string>();

combineLatest([name$, age$]).subscribe(([name, age]) => console.log(`Name : ${name}, Age : ${age}`));

name$.next("Alice");
age$.next(25);
age$.next(26);
age$.next(27);
name$.next("Bob");
age$.next(30);