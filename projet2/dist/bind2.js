import { fromEvent, Observable } from 'rxjs';
class EventHandler {
    count = 0;
    constructor() {
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(event) {
        this.count++;
        console.log(`Click ${this.count} à `, event);
    }
}
//# sourceMappingURL=bind2.js.map