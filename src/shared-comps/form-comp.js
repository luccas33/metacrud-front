import { createCustomCrudComp } from "./custom-crud-comp";
import { createInputByType, newelm, onclick } from "../utils";

export function createFormComp(crud, inputs) {
    let main = newelm('div', 'form');
    main.style.display = 'none';

    let comp = { main };

    comp.render = () => {
        main.innerHTML = /*html*/`
            <div class="dialog">
                <div class="dialog-content form-dialog">
                    <div class="dialog-head">
                        <h3 class="title"></h3>
                        <button class="btn-negative close-dialog"> <i class="fa-solid fa-xmark"></i> </button>
                    </div>
                    <div class="form-inputs grid"></div>
                    <div class="subcrud-container"></div>
                    <div class="subcrud-list">
                        <h3>Sub Forms</h3>
                    </div>
                    <div class="form-actions">
                        <button class="save btn-positive"><i class="fa-solid fa-floppy-disk"></i> Save</button> 
                    </div>
                </div>
            </div>
        `;

        crud.title = main.querySelector('.title');
        let formInputs = main.querySelector('.form-inputs');
        let saveBtn = main.querySelector('.save');

        onclick(saveBtn, () => crud.save());

        inputs.forEach(ipt => {
            ipt.vo = crud.vo;
            let iptComp = createInputByType(ipt);
            iptComp.render();
            formInputs.appendChild(iptComp.main);
        });

        let btnClose = main.querySelector('.close-dialog');
        onclick(btnClose, () => crud.closeForm());

        createSubcruds(crud, comp);
    }

    crud.showForm = () => {
        comp.render();
        main.style.display = 'flex';
    }

    crud.closeForm = () => {
        main.style.display = 'none';
    }

    return comp;
}

function createSubcruds(crud, form) {
    let main = form.main;
    let subcrudList = main.querySelector('.subcrud-list');
    let subcrudPanel = main.querySelector('.subcrud-container');

    if (!crud.vo || !crud.vo.id || !crud.subcruds || crud.subcruds.length == 0) {
        subcrudList.style.display = 'none';
        subcrudPanel.style.display = 'none';
        return;
    }

    let parentId = crud.vo.id;

    form.closeSubcrud = () => {
        subcrudPanel.innerHTML = '';
    }

    form.showSubcrud = sc => {
        sc.isSubcrud = true;
        subcrudPanel.innerHTML = /*html*/`
                <div class="dialog">
                    <div class="page-dialog dialog-content">
                        <div class="dialog-head">
                            <h3 class="title"></h3>
                            <button class="btn-negative close-dialog"> <i class="fa-solid fa-xmark"></i> </button>
                        </div>
                    </div>
                </div>
            `;
        let container = subcrudPanel.querySelector('.dialog-content');
        let subcrudComp = createCustomCrudComp(sc);
        subcrudComp.parentId = parentId;
        container.appendChild(subcrudComp.main);
        subcrudComp.render();
        let btnClose = subcrudPanel.querySelector('.close-dialog');
        onclick(btnClose, () => form.closeSubcrud());
        let title = subcrudPanel.querySelector('.title');
        title.innerText = sc.label;
    }

    crud.subcruds.map(sc => {
        let btn = newelm('button', 'subcrud-btn');
        btn.innerText = sc.label;
        onclick(btn, () => form.showSubcrud(sc));
        subcrudList.appendChild(btn);
    });
}
