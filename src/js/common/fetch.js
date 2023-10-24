const url = 'https://653485e2e1b6f4c59046c7c7.mockapi.io/api/users/219204315/tasks';

export const fetchApi = {
    getAll: async () => {
        return await fetch(url, { method: 'GET' })
            .then(res => res.json())
            .then(data => data)
            .catch(error => console.log(error));
    },
    getById: async (id) => {
        return await fetch(`${url}/${id}`, { method: 'GET' })
            .then(res => res.json())
            .then(data => data)
            .catch(error => console.log(error));
    },
    post: async (body) => {
        return await fetch(url, {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .catch(error => console.log(error));
    },
    put:async(id,body)=>{
        return await fetch(`${url}/${id}`, {
            method: 'PUT',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .catch(error => console.log(error));
    },
    delete:async (id)=>{
        return await fetch(`${url}/${id}`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json"
            }
        }).then(res=>res.json()).catch(error => console.log(error));
    }
}