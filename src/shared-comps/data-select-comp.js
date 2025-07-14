import { loadCruds } from "../services/crud-service";
import { newelm, onclick, voToString } from "../utils";
import { createCustomCrudComp } from "./custom-crud-comp";

const count = {lastId: 1}

export function createDateSelectComp(options) {
    options.label = options.label || '';
    options.prop = options.prop || 'value';
    options.vo = options.vo || {};

    let main = newelm('div', 'data-select input');
    let comp = {main};

    comp.render = () => {
        let iptId = 'data_select_comp_' + count.lastId++;

        main.innerHTML = /*html*/`
            <label for="${iptId}">${options.label}</label>
            <input type="text" id="${iptId}" class="ipt-select" readonly>
            <div class="crud-container"></div>
        `;

        let ipt = main.querySelector('.ipt-select');
        comp.crudContainer = main.querySelector('.crud-container');

        comp.closeCrud = () => comp.crudContainer.innerHTML = '';

        let voValue = options.vo[options.prop];
        ipt.value = voValue?.label || 'Select';

        onclick(ipt, () => loadCruds(cruds => {
            let crud = cruds.find(c => options.form == c.name);
            showCrud(comp, options, crud);
        }));
    }

    return comp;
}

function showCrud(comp, options, crudInfo) {
    console.log('crud: ', crudInfo);

    let onSelect = selectedVo => {
        options.vo[options.prop] = selectedVo;
        comp.closeCrud();
        comp.render();
    }

    let crud = createCustomCrudComp(crudInfo, onSelect);

    comp.crudContainer.innerHTML = /*html*/`
        <div class="dialog">
            <div class="page-dialog dialog-content">
                <div class="dialog-head">
                    <h3 class="title"></h3>
                    <button class="btn-negative close-dialog"> <i class="fa-solid fa-xmark"></i> </button>
                </div>
            </div>
        </div>
    `;

    let content = comp.crudContainer.querySelector('.dialog-content');
    content.appendChild(crud.main);

    let btnClose = content.querySelector('.close-dialog');
    onclick(btnClose, () => comp.closeCrud());

    crud.render();
}
