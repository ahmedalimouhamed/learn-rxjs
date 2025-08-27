import {of, from, throwError} from 'rxjs';
import {map, catchError, tap, shareReplay, switchMap} from 'rxjs/operators';

class SmartCacheSystem{
    private cache = new Map<string, {data: any; timestamp: number; expires: number}>();
    private readonly CACHE_DURATION = 10000;

    async fetchWithCache(key: string): Promise<any>{
        const cached = this.cache.get(key);
        const now = Date.now();

        if(cached && now < cached.expires){
            console.log('feom cache : ', key);
            return cached.data;
        }

        console.log('fetching fresh : ', key);
        const data = await new Promise(resolve => {
            setTimeout(() => {
                resolve({[key]: `Data for ${key} at ${new Date().toISOString()}`})
            }, 1000);

        });

        this.cache.set(key, {
            data,
            timestamp: now,
            expires: now + this.CACHE_DURATION
        });

        return data
    }

    createCachedObservable(key: string){
        return from(this.fetchWithCache(key)).pipe(
            shareReplay(1),
            catchError(error => {
                console.error('Error fetching data : ', error);
                return of({error: error.message});
            })
        )
    }

    invalidateCache(key?: string){
        if(key){
            this.cache.delete(key);
            console.log('cache invalidated for : ', key);
        }else{
            this.cache.clear();
            console.log('All cache inalidated')
        }
    }

    getCacheStats(){
        return Array.from(this.cache.entries()).map(([key, value]) => ({
            key,
            age: Date.now() - value.timestamp,
            expiresIn: value.expires - Date.now()
        }))
    }
}

const cacheSystem = new SmartCacheSystem();

cacheSystem.createCachedObservable('userProfile').subscribe(data => {
    console.log('User data : ', data);
});

setTimeout(() => {
    cacheSystem.createCachedObservable('userProfile').subscribe(data => {
        console.log('User data : ', data);
    })
}, 500);

setTimeout(() => {
    cacheSystem.createCachedObservable('userProfile').subscribe(data => {
        console.log('User Data (freesh) : ', data);
    }) 
}, 11000);

setTimeout(() => {
    console.log('Cache Stats : ', cacheSystem.getCacheStats());
}, 3000)