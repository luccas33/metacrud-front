import { voToString } from "../utils";
import { createBaseRestService } from "./base-rest-service";

export function createBaseCrudActions(name, crud) {
    const service = createBaseRestService(name);

    console.log('createBaseCrudActions(): ', crud)

    crud.newObj = () => {
        crud.vo = {};
        if (crud.parentId) {
            crud.vo.parentId = crud.parentId;
        }
        crud.showForm();
        crud.title.innerHTML = '<i class="fa-solid fa-plus"></i> New Register';
    }

    crud.list = () => {
        crud.page = crud.page || 1;
        crud.pageSize = crud.pageSize || 20;
        let filter = {page: crud.page, pageSize: crud.pageSize};
        if (crud.parentId) {
            filter.parentId = crud.parentId;
        }
        service.getAll(filter)
            .then(res => res.json())
            .then(data => {
                crud.dataList = data.data;
                crud.renderList();
            });
    };

    crud.save = () => {
        if (crud.voModifier) {
            crud.voModifier(crud.vo);
        }
        crud.vo._label = voToString(crud.vo, crud.inputs);
        console.log('save(): ', crud.vo);
        if (crud.vo.id) {
            service.put(crud.vo)
                .then(() => {
                    crud.closeForm();
                    crud.list();
                });
            return;
        }
        service.post(crud.vo)
            .then(() => {
                crud.closeForm();
                crud.list();
            });
    }

    crud.edit = vo => {
        crud.vo = vo;
        service.getById(vo.id)
            .then(res => res.json())
            .then(data => {
                crud.vo = data.data;
                crud.showForm();
                crud.title.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Register';
            });
    }

    crud.del = vo => {
        verifyRelations(vo);
        service.del(vo.id)
            .then(() => crud.list());
    }

    function verifyRelations(vo) {
        vo = {...vo};
        let mustUpdate = {value: false};
        Object.keys(vo).forEach(key => {
            let value = vo[key];
            if (value && typeof value == 'object' && value.form && value.id) {
                value.removedId = value.id;
                delete value.id;
                mustUpdate.value = true;
            }
        });
        if (mustUpdate.value) {
            service.put(vo);
        }
    }
}
