import { of, Observable } from 'rxjs';
import { map, filter, tap, switchMap } from 'rxjs/operators';
class DataService {
    apiUrl;
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
        this.fetchData = this.fetchData.bind(this);
    }
    async fetchData(endpoint) {
        console.log(`Fetching data from ${this.apiUrl}/${endpoint}`);
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    { id: 1, name: 'Item 1', value: Math.random() * 100 },
                    { id: 2, name: 'Item 2', value: Math.random() * 100 },
                    { id: 3, name: 'Item 3', value: Math.random() * 100 },
                ]);
            }, 500);
        });
    }
    processData(data) {
        return of(data).pipe(map(items => items.filter(item => item.value > 50)), tap(items => console.log('Items filtrés : ', items.length)), switchMap(items => this.transformItems(items)));
    }
    transformItems(items) {
        return of(items).pipe(map(items => items.map(item => ({
            ...item,
            formatted: `#${item.id} - ${item.name} (${Math.round(item.value)})`
        }))));
    }
}
class DataProcessor {
    static calculateStats(...values) {
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
        const max = Math.max.apply(null, values);
        const min = Math.min.apply(null, values);
        return { avg, max, min };
    }
}
const service = new DataService('https://api.example.com');
of('users', 'products', 'orders').pipe(tap(endpoint => console.log('Traitement endpoint : ', endpoint)), switchMap(endpoint => {
    const boundFetch = service.fetchData.bind(service);
    return boundFetch.call(service, endpoint);
}), map(items => {
    const values = items.map(item => item.value);
    return DataProcessor.calculateStats.apply(null, values);
})).subscribe(stats => {
    console.log('statistiques :', stats);
});
//# sourceMappingURL=bind-call-apply.js.map