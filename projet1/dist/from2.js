import { from } from 'rxjs';
const maPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Resultat de la promise arès 2s');
    }, 2000);
});
from(maPromise).subscribe({
    next: result => console.log('Promise réussie : ', result),
    error: err => console.error('Promise echouée : ', err),
    complete: () => console.log('Promise terminée')
});
//# sourceMappingURL=from2.js.map