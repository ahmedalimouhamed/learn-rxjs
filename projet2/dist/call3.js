import { of } from 'rxjs';
import { map } from 'rxjs/operators';
class Formatter {
    prefix;
    constructor(prefix) {
        this.prefix = prefix;
    }
    format(value) {
        return `${this.prefix} : ${value}`;
    }
}
const formatters = [
    new Formatter('INFO'),
    new Formatter('WARN'),
    new Formatter('ERROR'),
];
of('Something happened', 'Another event', 'Critical issue').pipe(map((message, index) => {
    const formatter = formatters[index % formatters.length];
    return formatter.format.call(formatter, message);
})).subscribe(formatted => console.log(formatted));
//# sourceMappingURL=call3.js.map