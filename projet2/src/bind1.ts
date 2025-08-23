import {Observable} from 'rxjs';

class DataProcessor{
    private multiplier: number;

    constructor(multiplier: number){
        this.multiplier = multiplier;
    }

    processValue(value: number): number{
        return value * this.multiplier;
    }

    createProcessingObservable(values: number[]): Observable<number>{
        return new Observable<number>(subscriber => {
            values.forEach(value => {
                const processed = this.processValue.bind(this)(value);
                subscriber.next(processed);
            });
            subscriber.complete();
        })
    }
}

const processor = new DataProcessor(5);
processor.createProcessingObservable([1,2,3,4,5]).subscribe(result => 
    console.log('Valeur processée : ', result)
);