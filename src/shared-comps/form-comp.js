import { createCustomCrudComp } from "./custom-crud-comp";
import { createInputByType, newelm, onclick } from "../utils";
import { loadCruds } from "../services/crud-service";

export function createFormComp(crud, inputs) {
    let main = newelm('div', 'form');
    main.style.display = 'none';

    let comp = { main, inputCompList: [] };

    comp.render = () => {
        comp.inputCompList = [];

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
            comp.inputCompList.push(iptComp);
            iptComp.render();
            formInputs.appendChild(iptComp.main);
        });

        inputs.filter(ipt => ipt.requiredOn)
            .forEach(ipt => linkRequiredOn(ipt, comp.inputCompList, crud.vo));

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

function linkRequiredOn(inputInfo, inputList, vo) {
    console.log(`${inputInfo.prop} required on ${inputInfo.requiredOn.prop}`);
    let input = inputList.find(ipt => ipt.prop == inputInfo.prop);
    let masterInput = inputList.find(ipt => ipt.prop == inputInfo.requiredOn.prop);
    if (!masterInput) {
        console.log('master input not found')
        return;
    }
    const defDisplay = input.main.style.display || 'flex';

    function verifyInputDisplay() {
        let value = vo[inputInfo.requiredOn.prop];

        if (value == null || value == undefined) {
            input.main.style.display = 'none';
            return;
        }
        let requiredValues = inputInfo.requiredOn.values || [];
        if (requiredValues.length == 0) {
            input.main.style.display = defDisplay;
            input.render();
            return;
        }
        let requiredValue = requiredValues.find(v => v == value);
        if (requiredValue != null && requiredValue != undefined) {
            input.main.style.display = defDisplay;
            input.render();
            return;
        }
        input.main.style.display = 'none';
    }

    verifyInputDisplay();

    masterInput.onchangeList.push(() => verifyInputDisplay());
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

    loadCruds(cruds => {
        console.log('subcruds: ', crud.subcruds)

        crud.subcruds.map(sc => {
            sc = cruds.find(c => sc.name == c.name) || sc;
            if (!sc || !sc.name || !sc.inputs || !sc.label) {
                return;
            }
            let btn = newelm('button', 'subcrud-btn');
            btn.innerText = sc.label;
            onclick(btn, () => form.showSubcrud(sc));
            subcrudList.appendChild(btn);
        });
    })

    
}
