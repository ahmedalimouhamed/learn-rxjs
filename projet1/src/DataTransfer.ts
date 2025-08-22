import {Observable, filter} from 'rxjs';

class CapteurTemperature extends Observable<{temp: number, timestamp: Date}>{
    constructor(){
        super(
            subscriber => {
                const intervalId = setInterval(() => {
                    const temperature = Math.random()* 30 + 10;
                    const data = {
                        temp: parseFloat(temperature.toFixed(1)),
                        timestamp: new Date()
                    }
                    subscriber.next(data);
                }, 2000);

                return () => clearInterval(intervalId)
            }
        )
    }
}

const capteur$ = new CapteurTemperature();

capteur$.subscribe({
    next: data =>{
        console.log(`Temperature : ${data.temp}°C à ${data.timestamp.toLocaleTimeString()}`)
    }
});

capteur$.pipe(
    filter((data: {temp: number, timestamp: Date}) => data.temp > 15 && data.temp < 35)
).subscribe({
    next: (data: {temp: number, timestamp: Date}) => {
        console.log(`Temperature normale : ${data.temp}°C à ${data.timestamp.toLocaleTimeString()}`)
    }
})