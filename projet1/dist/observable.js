import { Observable } from 'rxjs';
const monObservable = new Observable((subscriber) => {
    subscriber.next("Bonjour");
    subscriber.next("Au revoir");
    subscriber.complete();
    return () => {
        console.log("Nettoyage des ressources");
    };
});
const subscription1 = monObservable.subscribe({
    next: (value) => console.log("subscriber -1 Got : " + value),
    error: (err) => console.error("subscriber -1 Error : " + err),
    complete: () => console.log("subscriber -1 Terminé")
});
const subscription2 = monObservable.subscribe({
    next: (value) => console.log("subscriber -2 Got : " + value),
    error: (err) => console.error("subscriber -2 Error : " + err),
    complete: () => console.log("subscriber -2 Terminé")
});
setTimeout(() => {
    subscription1.unsubscribe();
    subscription2.unsubscribe();
}, 1000);
//# sourceMappingURL=observable.js.map