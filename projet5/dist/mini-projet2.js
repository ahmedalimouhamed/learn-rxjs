import { Subject, BehaviorSubject, merge, combineLatest } from 'rxjs';
import { filter, map, scan, delay } from 'rxjs/operators';
const orderStream = new Subject();
const kitchenStream = new Subject();
const globalState = new BehaviorSubject([]);
merge(orderStream, kitchenStream)
    .pipe(scan((allOrders, newOrder) => {
    const index = allOrders.findIndex(o => o.id === newOrder.id);
    if (index >= 0) {
        allOrders[index] = newOrder;
    }
    else {
        allOrders.push(newOrder);
    }
    return [...allOrders];
}, []))
    .subscribe(globalState);
orderStream
    .pipe(filter(order => order.status === "pending"))
    .subscribe(order => {
    console.log(`cuisinier reçoit commande #${order.id} : ${order.dish}`);
    setTimeout(() => {
        kitchenStream.next({ ...order, status: 'done' });
    }, 1000);
});
globalState.subscribe(orders => {
    const pending = orders.filter(o => o.status === 'pending').length;
    const done = orders.filter(o => o.status === 'done').length;
    console.log(`Status -> En attente : ${pending}, Terminées ; ${done}`);
});
let id = 1;
function newOrder(table, dish) {
    orderStream.next({ id: id++, table, dish, status: 'pending' });
}
newOrder(1, 'Pizza');
newOrder(2, "Pates");
setTimeout(() => newOrder(3, "Salade"), 2000);
setTimeout(() => newOrder(4, "Tajine"), 3000);
//# sourceMappingURL=mini-projet2.js.map