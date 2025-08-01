

import { newelm, onchange } from "../utils";

const count = {lastId: 1}

export function createSelectComp(options = {}) {
    options.label = options.label || '';
    options.prop = options.prop || 'value';
    options.vo = options.vo || {};
    options.className = options.className || '';
    options.options = options.options || [];

    let main = newelm('div', `input input-select ${options.className} ${options.size || ''}`);
    let comp = {main, prop: options.prop, onchangeList: []};

    comp.render = () => {
        let iptId = 'select_comp_' + count.lastId++;

        main.innerHTML = /*html*/`
            <label for="${iptId}">${options.label}</label>
            <select id="${iptId}" >
                ${createOptions(options)}
            </select>
        `;

        let ipt = main.querySelector('select');

        let voValue = options.vo[options.prop];
        if (voValue != null && voValue != undefined) {
            ipt.value = typeof voValue == 'string' ? voValue : voValue.value;
        }

        onchange(ipt, () => {
            let selectedValue = options.options.find(opt => opt.value == ipt.value);
            selectedValue = typeof selectedValue.value == 'string' ? selectedValue.value : selectedValue;
            console.log('selected value: ', selectedValue)
            options.vo[options.prop] = selectedValue;
            comp.onchangeList.forEach(callback => callback({originInput: comp, originProp: options.prop, value: selectedValue}));
        });
    }

    return comp;
}

function createOptions(options) {
    return options.options.map(opt => {
        return /*html*/`
            <option value="${opt.value}">${opt.label}</option>
        `;
    }).join('');
}
