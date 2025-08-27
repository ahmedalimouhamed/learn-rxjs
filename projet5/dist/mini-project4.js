import { Subject, merge, interval, take, map, filter, combineLatest } from 'rxjs';
const orderStream = new Subject();
orderStream.next({ client: "Alice", dish: 'Pizza' });
orderStream.next({ client: "Bob", dish: "pasta" });
orderStream.next({ client: "charlie", dish: "Salade" });
const prepareOrders$ = orderStream.pipe(filter(order => order.dish.startsWith("P")), map(order => ({
    ...order,
    status: 'Being prepared '
})));
const timer$ = interval(1000).pipe(take(5));
const combined$ = combineLatest([prepareOrders$, timer$]).pipe(map(([order, time]) => ({
    ...order,
    progress: `${time + 1} sec(s)`
})));
const finishedOrders$ = prepareOrders$.pipe(map(order => ({
    ...order,
    status: "finished"
})));
const restaurant$ = merge(combined$, finishedOrders$);
restaurant$.subscribe({
    next: val => console.log("update : ", val),
    complete: () => console.log("All done")
});
//# sourceMappingURL=mini-project4.js.map