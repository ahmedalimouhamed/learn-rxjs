import {of} from 'rxjs';
import {map} from 'rxjs/operators';

class Formatter{
    private prefix: string;

    constructor(prefix: string){
        this.prefix = prefix;
    }

    format(value: any): string{
        return `${this.prefix} : ${value}`
    }
}

const formatters = [
    new Formatter('INFO'),
    new Formatter('WARNING'),
    new Formatter('ERROR'),
];

of('something happened', 'Another event', 'Critical issue').pipe(
    map((message, index) => {
        const formatter = formatters[index % formatters.length];
        return formatter?.format.call(formatter, message);
    })
).subscribe(formatted => console.log(formatted));