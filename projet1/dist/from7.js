import { from } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
function processApiResource(apiPromise) {
    return from(apiPromise).pipe(tap(users => console.log('Utilisateurs reçus : ', users)), filter(users => users.length > 0), tap(users => console.log('Utilisateurs valides : ', users)), map(users => users.map(user => user.name)), tap(names => console.log('Noms des utilisateurs : ', names)), map(names => names.join(', ')), tap(fullNames => console.log('Noms complets : ', fullNames)), map(fullNames => `Liste des utilisateurs : ${fullNames}`), tap(result => console.log('Resultat final : ', result)));
}
function readFileAsText(file) {
    return from(new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(file);
    }));
}
function fromEventTarget(target, eventName) {
    return from(new Promise(resolve => {
        target.addEventListener(eventName, resolve, { once: true });
    }));
}
processApiResource(fetch('https://jsonplaceholder.typicode.com/users').then(res => res.json())).subscribe(users => console.log(users));
//readFileAsText(new File([''], 'test.txt')).subscribe(content => console.log(content));
//fromEventTarget(document, 'click').subscribe(event => console.log(event));
//# sourceMappingURL=from7.js.map