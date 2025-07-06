import {newelm} from '../utils';

export function createHomePage() {
    let main = newelm('div', 'home-page');
    let comp = {main, name: 'home'};

    comp.render = () => {
        if (comp.rendered) {
            return;
        }
        main.innerHTML = /*html*/`
            <h1>Hello World!</h1>
            <p>Welcome to Meta CRUD project!</p>
        `;
    }

    return comp;
}
