import {Observable} from 'rxjs';

class FileUploadObservable extends Observable<{progress: number, loaded: number, total: number}>{
    constructor(file: File, url: string){
        super(subscriber => {
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (event) => {
                if(event.lengthComputable){
                    const progress = (event.loaded / event.total) * 100;
                    subscriber.next({
                        progress: Math.round(progress),
                        loaded: event.loaded,
                        total: event.total
                    });
                }
            });

            xhr.addEventListener('load', () => {
                if(xhr.status >= 200 && xhr.status < 300){
                    subscriber.complete();
                }else{
                    subscriber.error(`Erreur HTTP ${xhr.status}`);
                }
            });

            xhr.addEventListener('error', () => {
                subscriber.error('Erreur de reseau');
            });

            xhr.open('POST', url, true);
            const formData = new FormData();
            formData.append('file', file);
            xhr.send(formData);

            return () => {
                xhr.abort();
                console.log('Uploaded annulé')
            }
        })
    }
}

const fileUploadSimulation$ = new Observable<{progress: number}>(
    subscriber => {
        let progress = 0;
        const intervalId = setInterval(() => {
            progress += Math.random() * 10;

            if(progress >= 100){
                progress = 100;
                subscriber.next({progress});
                subscriber.complete();
                clearInterval(intervalId);
            }else{
                subscriber.next({progress: Math.round(progress)});
            }
        }, 500);

        return () => clearInterval(intervalId);
    }
);

fileUploadSimulation$.subscribe({
    next: ({progress}) => {
        console.log(`Upload : ${progress}%`)
    },
    complete: () => console.log('Upload terminé avec succès!'),
    error: (err) => console.error('Erreur de upload : ', err)
})