import { newelm, onclick, voToString } from "../utils";

export function createTableComp(crud, inputs, onSelect) {
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

        let onSelectColumn = /*html*/`<th>Select</th>`;

        main.innerHTML = /*html*/`
            <thead>
                ${onSelect ? onSelectColumn : ''}
                ${headColumns}
                <th class="table-actions">Actions</th>
            </thead>

            <tbody></tbody>
        `;

        let tbody = main.querySelector('tbody');
        list.forEach(item => tbody.appendChild(createTableItem(item, crud, inputs, onSelect)));
    }

    return comp;
}

function createTableItem(item, crud, inputs, onSelect) {
    let main = newelm('tr');

    let columns = inputs.map(ipt => {
        let value = item[ipt.prop];
        if (ipt.type == 'checkbox') {
            value = value ? 'YES' : 'NO';
        }
        if (ipt.type == 'linkcrud') {
            value = value?._label || '';
        }
        return /*html*/`
            <td>${value}</td>
        `;
    }).join('');

    let onSelectColumn = /*html*/`
        <td><input type="checkbox" class="input input-checkbox select"></td>
    `;

    main.innerHTML = /*html*/`
        <tr>
            ${onSelect ? onSelectColumn : ''}
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

    if (onSelect) {
        let ckbSelect = main.querySelector('.input.select');
        onclick(ckbSelect, () => {
            console.log('inputs: ', inputs)
            onSelect({id: item.id, _label: voToString(item, inputs), form: crud.name});
        });
    }

    return main;
}
