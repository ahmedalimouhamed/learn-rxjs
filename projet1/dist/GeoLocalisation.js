import { Observable } from 'rxjs';
class GeoLocalisationObservable extends Observable {
    constructor(options) {
        super(subscriber => {
            if (!navigator.geolocation) {
                subscriber.error('Géolocalisation non supportée');
                return;
            }
            const watchId = navigator.geolocation.watchPosition(position => subscriber.next(position), error => subscriber.error(error), options);
            return () => navigator.geolocation.clearWatch(watchId);
        });
    }
}
const geolocationSimulation$ = new Observable(subscriber => {
    let lat = 48.8566;
    let lng = 2.3522;
    const intervalId = setInterval(() => {
        lat += (Math.random() - 0.5) * 0.001;
        lng += (Math.random() - 0.5) * 0.001;
        subscriber.next({ lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) });
    }, 3000);
    return () => clearInterval(intervalId);
});
geolocationSimulation$.subscribe({
    next: position => {
        console.log(`Position : ${position.lat}, ${position.lng}`);
        console.log(`https://www.google.com/maps?q=${position.lat},${position.lng}`);
    },
    error: err => console.error('Erreur de géolocalisation : ', err)
});
//# sourceMappingURL=GeoLocalisation.js.map