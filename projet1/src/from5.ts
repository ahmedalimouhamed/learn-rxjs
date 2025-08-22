import {from} from 'rxjs';

const iterableObject = {
    values: [100, 200, 300],
    [Symbol.iterator]: function*(){
        for(let value of this.values){
            yield value;
        }
    }
};

from(iterableObject).subscribe(val => console.log('iterable object : ', val));