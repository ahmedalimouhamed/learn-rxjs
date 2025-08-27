import { Subject, merge, interval, take, map, filter, combineLatest } from 'rxjs';
import { tap } from 'rxjs/operators';
const orderStream = new Subject();
const preparedOrders$ = orderStream.pipe(filter(order => order.dish.startsWith("p")), map(order => ({
    ...order,
    status: 'Being prepared '
})));
const timer$ = interval(1000).pipe(take(5));
const combined$ = combineLatest([preparedOrders$, timer$]).pipe(map(([order, time]) => ({
    ...order,
    progress: `${time + 1} sec(s)`
})));
const finishedOrders$ = preparedOrders$.pipe(map(order => ({
    ...order,
    status: "finished"
})));
const restaurant$ = merge(combined$, finishedOrders$);
restaurant$.subscribe({
    next: val => console.log("update : ", val),
    complete: () => console.log("All done")
});
orderStream.next({ client: "Alice", dish: 'pizza' });
orderStream.next({ client: "Bob", dish: "pasta" });
orderStream.next({ client: "charlie", dish: "Salade" });
//orderStream.subscribe(order => console.log("Nouvelle commande : ", order));
/*
setTimeout(() => {
    orderStream.next({client: "David", dish: "pizza"});
    orderStream.next({client: "Eve", dish: "pasta"});
    orderStream.next({client: "Frank", dish: "Salade"});
}, 2000)

*/
//# sourceMappingURL=mini-projet4.js.map