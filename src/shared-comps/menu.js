import { addPage, getPageFromPath, navToPage } from "../main";
import { loadCruds } from "../services/crud-service";
import { newelm, onclick } from "../utils";
import { createCustomCrudComp } from "./custom-crud-comp";

export const menuComp = {
    render: () => { },
    loadedFromPath: false,
    items: []
}

menuComp.setSelectedMenuItem = name => {
    menuComp.items.forEach(item => {
        if (item.main.classList.contains('selected')) {
            item.main.classList.remove('selected');
        }
    });
    let selectItem = menuComp.items.find(item => item.name == name);
    selectItem.main.classList.add('selected');
};

export function createMenuComp() {
    let main = newelm('div', 'menu');
    let comp = { main };

    comp.render = () => {
        console.log('menu.render()')

        loadCruds(crudList => {
            main.innerHTML = '';

            createMenuItem(comp, 'Home', 'home');
            createMenuItem(comp, 'Master Form', 'metacrud');

            console.log('crud list: ', crudList);

            crudList.forEach(crud => createPageMenuItem(comp, crud));

            if (!menuComp.loadedFromPath) {
                getPageFromPath();
                menuComp.loadedFromPath = true;
            }
        });
    }

    menuComp.render = () => comp.render();

    return comp;
}

function createPageMenuItem(menu, crud) {
    let page = createCustomCrudComp(crud);
    addPage(page);
    createMenuItem(menu, crud.label, crud.name);
}

function createMenuItem(menu, label, name) {
    let main = newelm('div', 'menu-item');
    menuComp.items = menuComp.items || [];
    menuComp.items.push({ main, name });
    main.innerHTML = /*html*/`
        <p><i class="fa-solid fa-table"></i> ${label}</p>
    `;
    let p = main.querySelector('p');

    onclick(p, () => {
        navToPage(name);
    });

    menu.main.appendChild(main);

    return main;
}
