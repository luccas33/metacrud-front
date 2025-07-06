import { createMenuComp } from './shared-comps/menu';
import {newelm} from './utils';

export function createPageTemplate() {
    let main = newelm('div', 'template');
    let comp = {main};

    let html = /*html*/`
        <header class="header">
            <h2>Meta CRUD Project</h2>
        </header>
        <main>
            <section class="menu-container"></section>
            <section class="page-container"></section>
        </main>
        <footer></footer>
    `;

    comp.render = () => {    
        main.innerHTML = html;

        let menu = main.querySelector('.menu-container');
        let menuComp = createMenuComp();
        menu.appendChild(menuComp.main);
        menuComp.render();
    }

    comp.renderPage = props => {
        if (props?.page?.main && props.page.render) {
            let container = main.querySelector('.page-container');
            props.page.render(props.pageProps);
            container.innerHTML = '';
            container.appendChild(props.page.main);
        }
    }

    return comp;
}
