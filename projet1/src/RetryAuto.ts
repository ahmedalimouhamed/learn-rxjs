import {Observable, throwError, timer} from 'rxjs';
import {mergeMap, retryWhen, delayWhen} from 'rxjs/operators';

class ServiceAvecRetry extends Observable<string>{
    private tentatives: number = 0;

    constructor(){
        super(
            subscriber => {
                this.tentatives++;
                console.log(`Tentative ${this.tentatives}`);

                if(Math.random() > 0.5){
                    subscriber.next("Succès Données reçues");
                    subscriber.complete();
                }else{
                    subscriber.error("Erreur temporaire");
                }
            }
        )
    }
}

const service$ = new ServiceAvecRetry();

service$.pipe(
    retryWhen(errors => errors.pipe(
        mergeMap((error, attempt) => {
            if(attempt >= 3){
                return throwError(`Trop de tentatives echouées`);
            }

            console.log(`Nouvelle tentative dans ${attempt + 1} second(s)...`);
            return timer((attempt + 1) * 1000);

        })
    ))
).subscribe({
    next: message => console.log(`${message}`),
    error: err => console.error(`echec final : ${err}`),
    complete: () => console.log("Operation terminée avec succès")
});