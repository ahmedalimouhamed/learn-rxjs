import {Subject, interval, of, merge, timer} from 'rxjs';
import {scan, map, filter, switchMap, startWith} from 'rxjs/operators';

class ChatSystem{
    private messages$ = new Subject<{user: string; message: string; timestamp: Date}>();
    private users: string[] = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
    private currentUser = 'vous';

    simulateOtherUsers(){
        return interval(3000 + Math.random() * 7000).pipe(
            map(() => {
                const randomUser = this.users[Math.floor(Math.random() * this.users.length)]!
                const messages = [
                    'Salut comment ça va?',
                    'Quoi de neuf?',
                    'Tu as vu le dernier projet?',
                    'je travaille sur quelques chose d\'interessant!',
                    'Besoin d\'aide sur un bug...'
                ];

                return {
                    user: randomUser,
                    message: messages[Math.floor(Math.random() * messages.length)]!,
                    timestamp: new Date()
                }
            })
        )
    }

    sendMessage(message: string){
        this.messages$.next({
            user: this.currentUser,
            message,
            timestamp: new Date()
        })
    }

    getChatStream(){
        const otherUsers$ = this.simulateOtherUsers();

        return merge(
            this.messages$,
            otherUsers$
        ).pipe(
            scan((messages: any[], newMessage) => 
                [...messages, newMessage].slice(-10), 
            [])
        )
    }

    createTypingIndicator(){
        return this.messages$.pipe(
            filter(msg => msg.user === this.currentUser),
            switchMap(() => 
                of('typing...').pipe(
                    switchMap(() => timer(2000).pipe(map(() => '')))
                )
            ),
            startWith('')
        )
    }

}

const chatSystem = new ChatSystem();
const chat$ = chatSystem.getChatStream();
const typing$ = chatSystem.createTypingIndicator();

chat$.subscribe(messages => {
    console.clear();
    console.log('Chat Room');
    messages.forEach((msg: any) => {
        const time = msg.timestamp.toLocaleTimeString();
        console.log(`[${msg.user}] ${msg.user} : ${msg.message}`);
    });
});

typing$.subscribe(indicator => {
    if(indicator){
        console.log(indicator);
    }
})

setTimeout(() => chatSystem.sendMessage('Bonjour tout le monde!'), 1000);
setTimeout(() => chatSystem.sendMessage('Quelqu\'un est là?'), 2000);