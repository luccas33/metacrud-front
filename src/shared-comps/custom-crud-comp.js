import { createBaseCrudActions } from "../services/base-crud-actions";
import { createFormComp } from "./form-comp";
import { createTableComp } from "./table-comp";
import { newelm, onclick } from "../utils";

export function createCustomCrudComp(crudInfo) {
    let main = newelm('div', `custom-crud custom-crud-${crudInfo.name}`);

    let comp = {name: crudInfo.name, main, subcruds: crudInfo.subcruds, voModifier: crudInfo.voModifier};

    createBaseCrudActions(crudInfo.name, comp);

    comp.render = () => {
        let form = createFormComp(comp, crudInfo.inputs);
        let table = createTableComp(comp, crudInfo.inputs);

        table.render();
        comp.renderList = () => table.render();

        main.innerHTML = /*html*/`
            <h1 class="title">${crudInfo.label}</h1>
        `;

        if (crudInfo.isSubcrud) {
            let title = main.querySelector('.title');
            main.removeChild(title);
        }

        main.appendChild(form.main);
        main.appendChild(createNewButton(comp));
        main.appendChild(table.main);

        comp.list();
    }

    return comp;
}

function createNewButton(crud) {
    let main = newelm('div', 'actions');
    main.innerHTML = /*html*/`
        <button class="new-btn btn-positive"><i class="fa-solid fa-plus"></i> New Register</button>
    `;
    let btn = main.querySelector('.new-btn');
    onclick(btn, () => crud.newObj());
    return main;
}
