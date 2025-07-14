import { newelm, onchange } from "../utils";

const count = {lastId: 1}

export function createInputComp(options = {}) {
    options.type = options.type || 'text';
    options.label = options.label || '';
    options.prop = options.prop || 'value';
    options.vo = options.vo || {};
    options.className = options.className || '';

    let main = newelm('div', `input input-${options.type} ${options.className} ${options.size || ''}`);
    let comp = {main, prop: options.prop, onchangeList: []};

    comp.render = () => {
        let iptId = 'input_comp_' + count.lastId++;

        let elmValue = `value="${options.vo[options.prop] || ''}"`;
        if (options.type == 'checkbox') {
            elmValue = options.vo[options.prop] ? 'checked' : '';
        }

        main.innerHTML = /*html*/`
            <label for="${iptId}">${options.label}</label>
            <input type="${options.type}" id="${iptId}" ${elmValue}>
        `;

        let ipt = main.querySelector('input');
        onchange(ipt, () => {
            let value = ipt.value;
            if (options.type == 'number') {
                value = Number.parseFloat(value);
                if (Number.isNaN(value)) {
                    value = 0;
                }
            }
            if (options.type == 'checkbox') {
                value = ipt.checked;
            }
            options.vo[options.prop] = value;
            comp.onchangeList.forEach(callback => callback({originInput: comp, originProp: options.prop, value}));
        });
    }

    return comp;
}
