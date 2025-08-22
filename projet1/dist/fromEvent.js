import { fromEvent } from 'rxjs';
const button = document.querySelector('button');
button.textContent = 'Cliquez-moi';
document.body.appendChild(button);
const clicks$ = fromEvent(button, 'click');
clicks$.subscribe((event) => {
    console.log('Button cliqué!', event);
    console.log(`Position : ${event.clientX}, ${event.clientY}`);
});
const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Tapez quelque chose...';
document.body.appendChild(input);
const keypress$ = fromEvent(input, 'keyup');
keypress$.subscribe((event) => {
    console.log('Touche Pressée : ', event.key, 'Valeur : ', event.target.value);
});
//# sourceMappingURL=fromEvent.js.map