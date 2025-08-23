import { Observable } from 'rxjs';
class DataProcessor {
    multiplier;
    constructor(multiplier) {
        this.multiplier = multiplier;
    }
    processValue(value) {
        return value * this.multiplier;
    }
    createProcessingObservable(values) {
        return new Observable(subscriber => {
            values.forEach(value => {
                const processed = this.processValue.bind(this)(value);
                subscriber.next(processed);
            });
            subscriber.complete();
        });
    }
}
const processor = new DataProcessor(5);
processor.createProcessingObservable([1, 2, 3, 4, 5]).subscribe(result => console.log('Valeur processée : ', result));
//# sourceMappingURL=bind1.js.map