import { loadCruds } from "../services/crud-service";
import { createSelectComp } from "./select-comp";

export function createCrudSelectComp(options) {
    let comp = createSelectComp(options);

    loadCruds(cruds => {
        let values = cruds.map(crud => {return {label: crud.label, value: crud.name}});
        options.options = values;
        comp.render();
    });

    return comp;
}
