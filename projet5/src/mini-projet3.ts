import {Subject, interval, merge} from 'rxjs';
import {map, filter, scan, take, bufferCount} from 'rxjs/operators';

type Order = {
    id: number;
    client: string;
    product: string;
    price: number;
}

const orderStream$ = new Subject<Order>();

orderStream$.subscribe(order => 
    console.log(`Nouvelle commande : ${order.client} a acheté ${order.product} (${order.price}€)`)
);

orderStream$
    .pipe(
        map(order => order.price),
        scan((acc, curr) => acc + curr, 0)
    )
    .subscribe(total => 
        console.log(`chiffre d'affaires total : ${total}€`)
    )

orderStream$
    .pipe(filter(order => order.client === 'Alice'))
    .subscribe(order => 
        console.log(`commande spéciale : Alice a acheté ${order.product}`)
    );

orderStream$
    .pipe(bufferCount(3))
    .subscribe(batch => 
        console.log(`Analuse batch de 3 commandes : `, batch.map(o => o.product))
    ) 

const promoStream$ = interval(5000).pipe(
    take(3),
    map(i => `promo spécial -${10 * (i + 1)}% sur tout !`)
);

merge(orderStream$, promoStream$).subscribe(event => 
    console.log("Evenement : ", event)
);

setTimeout(() => {
    orderStream$.next({id: 1, client: "Alice", product: "Laptop", price: 1200});
    orderStream$.next({id: 2, client: "Bob", product: "Smartphone", price: 800});
    orderStream$.next({id: 3, client: "Charlie", product: "Tablet", price: 500});
    orderStream$.next({id: 4, client: "David", product: "Laptop", price: 1200});
    orderStream$.next({id: 5, client: "Eve", product: "Smartphone", price: 800});
    orderStream$.next({id: 6, client: "Frank", product: "Tablet", price: 500});
    orderStream$.next({id: 7, client: "Grace", product: "Laptop", price: 1200});
    orderStream$.next({id: 8, client: "Hank", product: "Smartphone", price: 800});
    orderStream$.next({id: 9, client: "Ivy", product: "Tablet", price: 500});
    orderStream$.next({id: 10, client: "Jack", product: "Laptop", price: 1200});
}, 1000)