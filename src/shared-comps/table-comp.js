import { newelm, onclick } from "../utils";

export function createTableComp(crud, inputs) {
    let main = newelm('table');
    let comp = { main };

    inputs = inputs.filter(ipt => ipt.onTable);

    let headColumns = inputs.map(ipt => {
        return /*html*/`
            <th>${ipt.label}</th>
        `;
    }).join('');

    comp.render = () => {
        let list = crud.dataList || [];

        console.log('table.render(): ', list);

        main.innerHTML = /*html*/`
            <thead>
                ${headColumns}
                <th class="table-actions">Actions</th>
            </thead>

            <tbody></tbody>
        `;

        let tbody = main.querySelector('tbody');
        list.forEach(item => tbody.appendChild(createTableItem(item, crud, inputs)));
    }

    return comp;
}

function createTableItem(item, crud, inputs) {
    let main = newelm('tr');

    let columns = inputs.map(ipt => {
        let value = item[ipt.prop];
        if (ipt.type == 'checkbox') {
            value = value ? 'YES' : 'NO';
        }
        return /*html*/`
            <td>${value}</td>
        `;
    }).join('');

    main.innerHTML = /*html*/`
        <tr>
            ${columns}
            <td>
                <button class="btn-edit"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-delete btn-negative"> <i class="fa-solid fa-trash"></i> </button>
            </td>
        </tr>  
    `;

    let btnEdit = main.querySelector('.btn-edit');
    let btnDel = main.querySelector('.btn-delete');

    onclick(btnEdit, () => crud.edit(item));
    onclick(btnDel, () => crud.del(item));

    return main;
}
