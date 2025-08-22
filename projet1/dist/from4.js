import { from } from 'rxjs';
const monSet = new Set([10, 20, 30, 20, 10]);
from(monSet).subscribe(val => console.log('set value : ', val));
const monMap = new Map();
monMap.set('name', 'alice');
monMap.set('age', 25);
monMap.set('city', 'Paris');
from(monMap).subscribe(([key, value]) => {
    console.log(`${key} : ${value}`);
});
//# sourceMappingURL=from4.js.map