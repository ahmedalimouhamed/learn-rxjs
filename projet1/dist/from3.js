import { from, of } from 'rxjs';
from('hello').subscribe({
    next: char => console.log('Caractère : ', char),
    complete: () => console.log('string complete traité')
});
of('RxJS').subscribe(s => console.log('of string : ', s));
//# sourceMappingURL=from3.js.map