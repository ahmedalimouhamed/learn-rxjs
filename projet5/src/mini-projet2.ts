import {Subject, BehaviorSubject, merge, combineLatest} from 'rxjs';
import {filter, map, scan, delay} from 'rxjs/operators';

type Order = {
    id: number;
    table: number;
    dish: string;
    status: "pending" | "cooking" | "done";
}

const orderStream = new Subject<Order>();
const kitchenStream = new Subject<Order>();
const globalState = new BehaviorSubject<Order[]>([]);

merge(orderStream, kitchenStream)
    .pipe(
        scan((allOrders: Order[], newOrder: Order) => {
            const index = allOrders.findIndex(o => o.id === newOrder.id);

            if(index >= 0){
                allOrders[index] = newOrder;
            }else{
                allOrders.push(newOrder);
            }
            return [...allOrders];
        }, [])
    )
    .subscribe(globalState);

orderStream
    .pipe(filter(order => order.status === "pending"))
    .subscribe(order => {
        console.log(`cuisinier reçoit commande #${order.id} : ${order.dish}`);
        setTimeout(() => {
            kitchenStream.next({...order, status: 'done'});
        }, 1000)
    })

globalState.subscribe(orders => {
    const pending = orders.filter(o => o.status === 'pending').length;
    const done = orders.filter(o => o.status === 'done').length;
    console.log(`Status -> En attente : ${pending}, Terminées ; ${done}`);
});

let id = 1;

function newOrder(table: number, dish: string){
    orderStream.next({id: id++, table, dish, status: 'pending'});
}

newOrder(1, 'Pizza');
newOrder(2, "Pates");

setTimeout(() => newOrder(3, "Salade"), 2000);
setTimeout(() => newOrder(4, "Tajine"), 3000)