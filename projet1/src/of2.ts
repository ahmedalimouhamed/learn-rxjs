import {of} from 'rxjs';

of("Pomme", "Banane", "Orange").subscribe({
    next: fruit => console.log(fruit),
    complete: () => console.log('Panier de fruits complet!') 
});

of(1, 'deux', true, [4, 5]).subscribe(val => {
    console.log('Type : ', typeof val, ' valeur : ', val);
})