import {newelm} from '../utils';

export function createNotFoundPage() {
    let main = newelm('div', 'not-found');
    let comp = {main, name: 'not-found'};

    comp.render = props => {
        main.innerHTML =  /*html*/`
            <h2>${props.message || 'Page not found'}</h2>
        `
    }

    return comp;
}
