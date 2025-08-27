import {from, of, Observable} from 'rxjs';
import {map, tap, catchError, switchMap} from 'rxjs/operators';

class ApiClient{
    constructor(private baseUrl: string){}

    async makeRequest(endpoint: string): Promise<any>{
        try{
            const response = await fetch(`${this.baseUrl}/${endpoint}`);
            return response.json();
        }catch(error){
            throw new Error(`Failed to fetch data from ${this.baseUrl}/${endpoint}`);
        }
    }

    createRequestObservable(endpoint: string): Observable<any>{
        const boundRequest = this.makeRequest.bind(this);
        return from(boundRequest(endpoint)).pipe(
            catchError(error => {
                console.error('Erreur API : ', error.message);
                return of({error: error.message});
            })
        )
    }
}

class DataTransformer{
    static transformData(data: any[], ...transformations: Function[]): any[]{
        return data.map(item => {
            return transformations.reduce((transformed, transform) => {
                return transform.call(null, transformed)
            },item)
        })
    }
}

const apiClient = new ApiClient('https://jsonplaceholder.typicode.com');

const endpoints = ['posts', 'comments', 'users'];

from(endpoints).pipe(
    switchMap(endpoint => apiClient.createRequestObservable(endpoint)),
    tap(data => console.log('Donnees recues : ', data)),
    map(data => Array.isArray(data) ? data.slice(0, 3) : data),
    map(data => {
        return DataTransformer.transformData.apply(null, [
            data,
            (item:any) => ({...item, processed: true}),
            (item:any) => ({...item, timestamp: new Date().toISOString()})
        ]);
    })
).subscribe(transformedData => {
    console.log('Données transformées : ', transformedData)
})