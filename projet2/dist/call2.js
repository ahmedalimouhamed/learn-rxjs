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
    new Formatter('WARNING'),
    new Formatter('ERROR'),
];
of('something happened', 'Another event', 'Critical issue').pipe(map((message, index) => {
    const formatter = formatters[index % formatters.length];
    return formatter?.format.call(formatter, message);
})).subscribe(formatted => console.log(formatted));
//# sourceMappingURL=call2.js.map