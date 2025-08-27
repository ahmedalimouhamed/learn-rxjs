import {Observable, Subject, interval} from 'rxjs';
import {filter, map, scan, throttleTime, distinctUntilChanged, tap} from 'rxjs/operators';

class NotificationSystem{
    private notification$ = new Subject<{
        type: 'info' | 'warning' | 'error';
        message: string;
        id: number;
    }>();

    private notificationId = 0;

    showNotification(type: 'info' | 'warning' | 'error', message: string){
        this.notification$.next({
            type,
            message,
            id: ++this.notificationId
        })
    }

    getNotifications(){
        return this.notification$.pipe(
            throttleTime(1000),
            scan((notifications, newNotification) => [...notifications, newNotification].slice(-5), [] as any[]),
            distinctUntilChanged()
        )
    }

    getErrorNotifications(){
        return this.notification$.pipe(
            filter(notification => notification.type === 'error'),
            map(notification => ({
                ...notification,
                timestamp: new Date()
            }))
        )
    }
}

const notifySystem = new NotificationSystem();

notifySystem.getNotifications().subscribe(notifications => {
    console.log('Toutes les notifications : ', notifications);
});

notifySystem.getErrorNotifications().subscribe(errorNotif => {
    console.log('Erreur : ', errorNotif);
})

notifySystem.showNotification('info', 'Ceci est une notification d\'information');
notifySystem.showNotification('warning', 'Ceci est une notification d\'avertissement');
notifySystem.showNotification('error', 'Ceci est une notification d\'erreur');
notifySystem.showNotification('info', 'Ceci est une notification d\'information');
notifySystem.showNotification('warning', 'Ceci est une notification d\'avertissement');
notifySystem.showNotification('error', 'autre notification d\'erreur');


interval(500).subscribe(() => {
    notifySystem.showNotification('info', 'Heartbeat')
})