import { fetchApi } from "./common/fetch.js";

const data = await fetchApi.getAll();

const administrarTareaDiv = document.getElementById('tareas');

const alerta = document.getElementById('alert');
const modal = document.getElementById('modal');
const divModal = document.getElementById('divModal');
const modalClass = "fixed bg-opacity-80 w-full h-full top-0 transition ease-in-out duration-500 flex flex-col items-center";
const divModalClass = 'relative -top-full bg-slate-50 w-2/4 transition-all ease-in-out duration-500 rounded-md';
console.log(data);

modal.className += ' invisible';
evalData(data)

/// Botones ///
const deleteTask = document.getElementById('delete-task');

deleteTask.addEventListener('click', async (e) => {
    const idTask = modal.querySelector('input').value;
    await fetchApi.delete(idTask);
    const newTasks = await fetchApi.getAll();
    administrarTareaDiv.innerHTML = '';
    evalData(newTasks);
    changeClasses();
});

const cancelModal = document.getElementById('cancel-modal');

cancelModal.addEventListener('click', cerrarModal);

const guardarInformacion = document.getElementById('guardar');
guardarInformacion.addEventListener('click', (e) => {
    e.preventDefault();
    postTask();
});

modal.addEventListener('click', cerrarModal);

administrarTareaDiv.addEventListener('click', async e => {
    if (e.target.classList.contains('eliminar')) {
        modal.className = modalClass;
        modal.className += ' visible bg-black';
        divModal.className = divModalClass;
        divModal.className = divModalClass.replace('-top-full', 'top-20');

        const { title } = await fetchApi.getById(e.target.getAttribute('data-id'));
        modal.querySelector('input').value = e.target.getAttribute('data-id');
        modal.querySelector('span').innerHTML = title;
        console.log(e.target.getAttribute('data-id'), 'eliminar');
    } else if (e.target.classList.contains('editar')) {
        console.log(e.target.getAttribute('data-id'), 'editar');
    }
});

/// Functiones ///

function evalData(data) {
    if (data.length > 0) {
        data.forEach(task => {
            inyect(task);
        });
        document.getElementById('sin-tareas').setAttribute('hidden', null);
    } else if (data.length === 0) {
        document.getElementById('sin-tareas').removeAttribute('hidden');
    }
}

function inyect(task) {
    const tareaDiv = document.createElement('div');
    tareaDiv.className += 'mx-5 my-10 bg-white shadow-md px-5 py-10 rounded-xl';
    tareaDiv.innerHTML = `
        <p class="font-bold mb-3 text-gray-700 uppercase">ID:
            <span class="font-normal normal-case">
                ${task.id}
            </span>
        </p>

        <p class="font-bold mb-3 text-gray-700 uppercase">Titulo:
            <span class="font-normal normal-case">
                ${task.title}
            </span>
        </p>

        <p class="font-bold mb-3 text-gray-700 uppercase">Descripcion:
            <span class="font-normal normal-case">
                ${task.description}
            </span>
        </p>

        <p class="font-bold mb-3 text-gray-700 uppercase">Estado:
            <span class="font-normal normal-case">
                ${(task.completed) ? 'Completada' : 'Pendiente'}
            </span>
        </p>

        <p class="font-bold mb-3 text-gray-700 uppercase">Etiqueta:
            <span class="font-normal normal-case">
                ${task.tag}
            </span>
        </p>
        
        <p class="font-bold mb-3 text-gray-700 uppercase">Prioridad:
            <span class="font-normal normal-case">
                ${task.priority}
            </span>
        </p>

        <p class="font-bold mb-3 text-gray-700 uppercase">Fecha:
            <span class="font-normal normal-case">
                ${(new Date(task.dueDate)).toISOString().substring(0, 10)}
            </span>
        </p>

        <div class="grid md:grid-cols-2  gap-5 mt-10 ">
            <button type="button"
                class="block w-full py-2 px-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase rounded-lg editar"
                data-id="${task.id}"
                >
                Editar
            </button>

            <button type="button"
                class="block w-full py-2 px-10 bg-red-600 hover:bg-red-700 text-white font-bold uppercase rounded-lg eliminar"
                data-id="${task.id}"
                >
                Eliminar
            </button>
        </div>
    `;
    administrarTareaDiv.appendChild(tareaDiv);
}

function cerrarModal(e) {
    console.log(e);
    if (e.target === this) {
        changeClasses();
    }
}
function changeClasses() {
    modal.className = modal.className.replace(' visible bg-black', ' bg-transparent');
    divModal.className = divModalClass.replace('top-20', '-top-full');
    setTimeout(() => {
        modal.className += ' invisible';
    }, 500);
}
async function postTask() {

    const title = document.getElementById('titulo').value;
    const description = document.getElementById('descripcion').value;
    const completed = document.getElementById('completado').checked;
    const priority = document.getElementById('alta').value;
    let dueDate = document.getElementById('fecha').value;

    if (title !== '' ||
        description !== '' ||
        priority !== '' ||
        dueDate !== '') {
        console.log({ title, description, completed, priority, dueDate });
        dueDate = (new Date(dueDate)).toISOString().substring(0, 10);

        const body = {
            title: title,
            description: description,
            completed: completed,
            priority: priority,
            tag: "DFE 2023-2",
            dueDate: dueDate
        };
        console.log(body);
        const result = await fetchApi.post(body);
        console.log(result);
        messageAlert('Datos guardados correctamente', 'bg-green-500');
        inyect(result);
    } else {
        messageAlert('Faltan campos por rellenar', 'bg-red-500');
    }
}

function messageAlert(message, color) {
    const originalClass = 'text-white text-center p-3 uppercase font-bold mb-3 rounded-md';

    alerta.className += ' ' + color;
    alerta.innerText = message;
    alerta.removeAttribute('hidden');
    setTimeout(() => {
        alerta.setAttribute('hidden', null);
        alerta.className = originalClass;
    }, 3000);

}