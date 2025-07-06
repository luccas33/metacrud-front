

import { newelm, onchange } from "../utils";

const count = {lastId: 1}

export function createSelectComp(options = {}) {
    options.label = options.label || '';
    options.prop = options.prop || 'value';
    options.vo = options.vo || {};
    options.className = options.className || '';
    options.options = options.options || [];

    let main = newelm('div', `input input-select ${options.className} ${options.size || ''}`);
    let comp = {main};

    comp.render = () => {
        let iptId = 'select_comp_' + count.lastId++;

        main.innerHTML = /*html*/`
            <label for="${iptId}">${options.label}</label>
            <select id="${iptId}" >
                ${createOptions(options)}
            </select>
        `;

        let ipt = main.querySelector('select');

        ipt.value = options.vo[options.prop];

        onchange(ipt, () => {
            options.vo[options.prop] = ipt.value;
            console.log(options.vo);
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
