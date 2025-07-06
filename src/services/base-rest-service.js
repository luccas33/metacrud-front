
const baseUrl = 'http://localhost:3000/metacrud/';

export function createBaseRestService(name) {
    const url = baseUrl + name;

    async function getAll(filter) {
        filter = filter || {};
        let getUrl = url;
        let firstParam = true;
        Object.keys(filter).forEach(key => {
            let value = filter[key];
            if (value == null || value == undefined) {
                return;
            }
            let separator = firstParam ? '?' : '&';
            firstParam = false;
            getUrl += `${separator}${key}=${encodeURIComponent(value)}`;
        });
        return fetch(getUrl, {method: 'GET'});
    }

    async function getById(id) {
        return fetch(`${url}/${id}`, {method: 'GET'});
    }

    async function post(vo) {
        let body = JSON.stringify(vo);
        return fetch(url, {method: 'POST', body, headers: {'Content-Type': 'application/json'}});
    }

    async function put(vo) {
        let id = vo.id;
        delete vo.id;
        let body = JSON.stringify(vo);
        return fetch(`${url}/${id}`, {method: 'PUT', body, headers: {'Content-Type': 'application/json'}});
    }

    async function del(id) {
        return fetch(`${url}/${id}`, {method: 'DELETE'});
    }

    return {
        getAll,
        getById,
        post,
        put,
        del
    };
}
