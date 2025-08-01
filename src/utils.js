import { typeOptionsEnum } from "./pages/meta-crud";
import { createCrudSelectComp } from "./shared-comps/crud-select-comp";
import { createDateSelectComp } from "./shared-comps/data-select-comp";
import { createInputComp } from "./shared-comps/input-comp";
import { createSelectComp } from "./shared-comps/select-comp";

export function newelm(name = 'div', className) {
    let elm = document.createElement(name);
    if (className) {
        elm.className = className;
    }
    return elm;
}

export function onevent(elm, evtName, callback) {
    if (elm && evtName && callback) {
        elm.addEventListener(evtName, callback);
    }
}

export function onclick(elm, callback) {
    onevent(elm, 'click', callback);
}

export function onchange(elm, callback) {
    onevent(elm, 'change', callback);
}

export function createInputByType(options) {
    options = options || {};
    options.type = options.type || 'input';
    if (options.type == 'select') {
        return createSelectComp(options);
    }
    if (options.type == typeOptionsEnum.crudselect) {
        return createCrudSelectComp(options);
    }
    if (options.type == 'linkcrud') {
        return createDateSelectComp(options);
    }
    return createInputComp(options)
}

export function voToString(vo, inputs) {
    return inputs.filter(ipt => ipt.onTable)
        .map(ipt => vo[ipt.prop])
        .filter(value => value != null && value != undefined && typeof value != 'object')
        .join(' ');
}

export function notifyAllListeners(listeners, info = {}) {
    if (!listeners) {
        return;
    }
    Object.keys(listeners).keys(key => {
        let value = listeners[key];
        if (!value) {
            return;
        }
        try {
            info = {...info, origin: value.origin};
            console.log(`Running app event ${key} from origin ${value.origin}`);
            value.callback(info);
        } catch (error) {
            console.log(`Error running app event ${key} from origin ${value.origin}: `, error);
        }
    });
}
