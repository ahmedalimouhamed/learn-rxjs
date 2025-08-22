import { shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
class DonneesAvecCache extends Observable {
    cache = null;
    cacheTimestamp = null;
    CACHE_DURATION = 30000;
    constructor() {
        super(subscriber => {
            if (this.cache && this.cacheTimestamp && Date.now() - this.cacheTimestamp < this.CACHE_DURATION) {
                subscriber.next(this.cache);
                subscriber.complete();
            }
            else {
                this.fetchData().then((data) => {
                    this.cache = data;
                    this.cacheTimestamp = Date.now();
                    subscriber.next(data);
                    subscriber.complete();
                }).catch((error) => {
                    subscriber.error(error);
                });
            }
        });
    }
    async fetchData() {
        console.log('Chargement des données...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return [
            { id: 1, name: 'Donnee 1' },
            { id: 2, name: 'Donnee 2' },
            { id: 3, name: 'Donnee 3' }
        ];
    }
    invalidateCache() {
        this.cache = null;
        this.cacheTimestamp = null;
        console.log('Cache invalide');
    }
}
const donnees$ = new DonneesAvecCache();
donnees$.subscribe(data => console.log('Données 1 ', data));
setTimeout(() => {
    donnees$.subscribe(data => console.log('Donnees 2 (cache) : ', data));
}, 1000);
setTimeout(() => {
    const service = new DonneesAvecCache();
    service.invalidateCache();
    service.subscribe(data => console.log('Donnees 3 (rechargé) : ', data));
}, 4000);
//# sourceMappingURL=Cache.js.map