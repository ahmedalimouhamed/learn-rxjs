import { of } from 'rxjs';
of('Hello').subscribe(val => console.log('of string : ', val));
of(45).subscribe(val => console.log('of number : ', val));
of(true).subscribe(val => console.log('of boolean : ', val));
//# sourceMappingURL=of1.js.map