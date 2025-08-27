import { from, of, Observable } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
class ApiClient {
    baseUrl;
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    async makeRequest(endpoint) {
        try {
            const response = await fetch(`${this.baseUrl}/${endpoint}`);
            return response.json();
        }
        catch (error) {
            throw new Error(`Failed to fetch data from ${this.baseUrl}/${endpoint}`);
        }
    }
    createRequestObservable(endpoint) {
        const boundRequest = this.makeRequest.bind(this);
        return from(boundRequest(endpoint)).pipe(catchError(error => {
            console.error('Erreur API : ', error.message);
            return of({ error: error.message });
        }));
    }
}
class DataTransformer {
    static transformData(data, ...transformations) {
        return data.map(item => {
            return transformations.reduce((transformed, transform) => {
                return transform.call(null, transformed);
            }, item);
        });
    }
}
const apiClient = new ApiClient('https://jsonplaceholder.typicode.com');
const endpoints = ['posts', 'comments', 'users'];
from(endpoints).pipe(switchMap(endpoint => apiClient.createRequestObservable(endpoint)), tap(data => console.log('Donnees recues : ', data)), map(data => Array.isArray(data) ? data.slice(0, 3) : data), map(data => {
    return DataTransformer.transformData.apply(null, [
        data,
        (item) => ({ ...item, processed: true }),
        (item) => ({ ...item, timestamp: new Date().toISOString() })
    ]);
})).subscribe(transformedData => {
    console.log('Données transformées : ', transformedData);
});
//# sourceMappingURL=api.js.map