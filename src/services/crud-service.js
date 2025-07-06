import { menuComp } from "../shared-comps/menu";
import { notifyAllListeners } from "../utils";
import { createBaseRestService } from "./base-rest-service";

let crudList = [];

const crudRestService = createBaseRestService('load-cruds');

export function loadCruds(callback) {
    if (crudList.length > 0) {
        callback(crudList);
        return;
    } 
    crudRestService.getAll()
        .then(res => res.json())
        .then(res => {
            crudList = res.data;
            callback(crudList);
        });
}

export function reloadCruds() {
    crudList = [];
    menuComp.render();
}
