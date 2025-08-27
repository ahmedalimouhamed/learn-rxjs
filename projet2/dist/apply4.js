import { from } from 'rxjs';
import { map } from 'rxjs/operators';
const transformations = {
    uppercase: (str) => str.toUpperCase(),
    reverse: (str) => str.split('').reverse().join(''),
    capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1)
};
const words$ = from(['hello', 'world', 'rxjs', 'typescript', 'javascript', 'nodejs', 'reactjs', 'angularjs', 'vuejs', 'emberjs']);
words$.pipe(map(word => {
    const randomTransform = Object.keys(transformations)[Math.floor(Math.random() * Object.keys(transformations).length)];
    const result = transformations[randomTransform].apply(null, [word]);
    return `${word} => ${randomTransform} -> ${typeof transformations} -> ${result}`;
})).subscribe(transformation => console.log(transformation));
//# sourceMappingURL=apply4.js.map