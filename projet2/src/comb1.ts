import {interval, of, merge, concat, combineLatest, zip, forkJoin} from 'rxjs';
import {take, map, delay} from 'rxjs/operators';

console.log("=== Combinaison d'observables ===");

const source1$ = interval(1000).pipe(take(3), map(x => `Source1${x}`));
const source2$ = interval(2000).pipe(take(3), map(x => `Source2${x}`));

merge(source1$, source2$).subscribe(
    value => console.log('merge : ', value)
)


//concat - combine en séquence
const first$ = of('A', 'B', 'C');
const second$ = of(1, 2, 3);

concat(first$, second$).subscribe(value => 
    console.log('cocat : ', value)
);


//combineLatest - emet quand n'importe laquel change
const temperature$ = of(20, 22, 25).pipe(delay(0));
const humidity$ = of(40, 45, 50).pipe(delay(100));

combineLatest([temperature$, humidity$]).subscribe(([temp, hum]) => 
    console.log(`combineLatest : ${temp}°C, ${hum}%`)
);

//zip - combine les valeurs deux à deux
const names$ = of('Alice', 'Bob', 'Charlie', 'mouhamed');
const ages$ = of(25, 30, 35, 40);

zip(names$, ages$).subscribe(([name, age]) => {
    console.log(`Zip : ${name} est agé de ${age} ans`)
})

//forkJoin - attend que tous les observables se terminent
const apiCall1$ = of('Données utilisateur').pipe(delay(1000));
const apiCall2$ = of('Données produits').pipe(delay(1500));

forkJoin([apiCall1$, apiCall2$]).subscribe(([result1, result2]) => {
    console.log(`fork Join : ${result1}, ${result2}`)
})

