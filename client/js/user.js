// user section script

import { request } from "./modules/request.js";

// authentication token 
import loginToken from "./verify-autentication.js";

const btn_new_user = document.getElementById("btn_new_user");
const cnt_form_user = document.getElementById("cnt_form_user");
const form_user = document.getElementById("form_user");

const input_email = document.getElementById("input_email");
const input_name = document.getElementById("input_name");
const input_last_name = document.getElementById("input_last_name");
const input_role_admin = document.getElementById("input_role_admin");
const input_role_user = document.getElementById("input_role_user");
const input_password = document.getElementById("input_password");
const input_repeat_password = document.getElementById("input_repeat_password");

const msg_repeatPassword_error = document.getElementById("msg_repeatPassword_error");
const msg_password_error = document.getElementById("msg_password_error");
const msg_email_error = document.getElementById("msg_email_error");
const msg_name_error = document.getElementById("msg_name_error");
const msg_lastName_error = document.getElementById("msg_lastName_error");

const btn_save = document.getElementById("btn_save");
const btn_cancelar = document.getElementById("btn_cancelar");

let id_user_select;


// user add button
btn_new_user.addEventListener("click", () => {
    form_user.reset();
    input_email.removeAttribute("disabled");
    document.querySelector("form h2").innerHTML = 'Agregar Usuario';
    cnt_form_user.classList.toggle("hide");
});

// cancel button in user creation or edition form 
btn_cancelar.addEventListener("click", () => {
    cnt_form_user.classList.toggle("hide");
});

// render users table 
renderUserTable()

// load users table  users from endpoint
async function renderUserTable() {
    try {
        const endpoint = '/api/user'
        let response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${loginToken}`
            }
        });
        const user = await response.json();

        if (user.status != 200) {
            throw { error: error.message || "Internal server error" }
        }

        let tableUser = document.getElementsByTagName("table")[0];

        tableUser.innerHTML = `<tr>
                                    <th hidden>id</th>
                                    <th>Email</th>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Role</th>
                                    <th>Acciones</th>
                                 </tr>`;

        user.data.forEach(user => {
            let row = document.createElement('tr');
            row.innerHTML = `<td hidden>${user.id}</td>
                             <td>${user.email}</td>
                             <td>${user.first_name}</td>
                             <td>${user.last_name}</td>
                             <td>${(user.is_admin ? "Administrador" : "Usuario")}</td>
                             <td>
                                <i id="btnMoreOption" class="fas fa-ellipsis-h"></i>
                                <div class="box-more-action">
                                    <i id="btn_delete_user${user.id}" class="fas fa-trash-alt tag-hover" data-text="Eliminar Usuario"></i>
                                    <i id="btn_edit_user${user.id}" class="fas fa-pen tag-hover" data-text="Editar Usuario"></i>
                                </div>
                            </td>`;
            tableUser.appendChild(row);

            //user delete button
            let btn_delete_user = document.getElementById(`btn_delete_user${user.id}`);
            btn_delete_user.addEventListener("click", () => showDeleteUserConfirmation(user.id));

            //user delete button
            let btn_edit_user = document.getElementById(`btn_edit_user${user.id}`);
            btn_edit_user.addEventListener("click", () => showEditForm(user));
        });

    } catch (error) {
        console.log(error.message);
    }
}

/**
 * Show Edit Form User
 * @param {user} user object
 */
function showEditForm(user) {
    form_user.reset();
    id_user_select = user.id;
    document.querySelector("form h2").innerHTML = 'Editar Usuario';
    document.querySelectorAll(".msg-error-input").forEach(msg_input => {
        msg_input.innerHTML = "";
    });
    input_email.setAttribute("disabled", "");
    input_email.value = user.email
    input_name.value = user.first_name
    input_last_name.value = user.last_name
    if (user.is_admin) {
        input_role_admin.checked = true;
        input_role_user.checked = false;
    } else {
        input_role_user.checked = true;
        input_role_admin.checked = false;
    }
    cnt_form_user.classList.toggle("hide");
};


function showDeleteUserConfirmation(user_id) {
    document.getElementById("modal_delete_user").classList.toggle("hide");
    id_user_select = user_id;
};

//button cancel user delet
document.getElementById("btn_cancel_dlt").addEventListener("click", () => {
    document.getElementById("modal_delete_user").classList.toggle("hide");
});


//confirm button delete  user 
document.getElementById("btn_delete").addEventListener("click", () => {
    deleteUser();
});

// add  and edit new user
btn_save.addEventListener("click", () => {
    let addUser = document.querySelector("form h2").innerHTML === 'Agregar Usuario' ? true : false;

    if (validateFormUser(addUser)) return;

    let data;
    if (addUser) {

        data = {
            email: input_email.value,
            first_name: input_name.value,
            last_name: input_last_name.value,
            is_admin: input_role_admin.checked,
            password: input_password.value
        };

        createUser(data);
        return;
    }

    data = {
        email: input_email.value,
        first_name: input_name.value,
        last_name: input_last_name.value,
        is_admin: input_role_admin.checked
    };

    if (input_password.value.trim() != "") data = {...data, password: input_password.value};

    editUser(data)
});

/**
 * 
 * @param {boolean} addUser  true if add new user or false if edit user
 * @returns true if error
 */
function validateFormUser(addUser) {
    let error = false;

    // email
    if (input_email.value.trim() === "" && addUser) {
        msg_email_error.innerHTML = "Este campo es obligatorio"
        error = true;
    }

    // Nombre
    if (input_name.value.trim() === "") {
        msg_name_error.innerHTML = "Este campo es obligatorio"
        error = true;
    }

    //Apellido
    if (input_last_name.value.trim() === "") {
        msg_lastName_error.innerHTML = "Este campo es obligatorio"
        error = true;
    }

    // pasword
    if (input_password.value.trim() === "" && addUser) {
        msg_password_error.innerHTML = "Este campo es obligatorio"
        error = true;
    }

    // password repeat
    if (input_password.value.trim() != input_repeat_password.value.trim()) {
        msg_repeatPassword_error.innerHTML = "Las contraseñas no coinciden";
        error = true;
    }

    return error;
}

// form input event 
input_email.addEventListener("input", () => {
    msg_email_error.innerHTML = "";
});

input_name.addEventListener("input", () => {
    msg_name_error.innerHTML = "";
});

input_last_name.addEventListener("input", () => {
    msg_lastName_error.innerHTML = "";
});

input_password.addEventListener("input", () => {
    msg_password_error.innerHTML = "";
});

input_repeat_password.addEventListener("input", () => {

    msg_repeatPassword_error.innerHTML = "";

    if (input_repeat_password.value != input_password.value) {
        msg_repeatPassword_error.innerHTML = "Las contraseñas no coinciden";
    }
});

// send user delete request to services
function deleteUser() {
    request(`/api/user/${id_user_select}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${loginToken}`
        }
    }).then(res => {
        document.getElementById("modal_delete_user").classList.toggle("hide");
        renderUserTable()
    }).catch((err) => {
        console.log(err);
    });
};

// send user post request to services
function createUser(data) {

    request(`/api/user`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${loginToken}`
        },
        body: data
    }).then(res => {
        cnt_form_user.classList.toggle("hide");
        renderUserTable()
    }).catch((err) => {
        console.log(err);

        switch (err.status) {
            case 409:
                msg_email_error.innerHTML = "Email ya se encuentra registrado ";
                break;
            default:
                break;
        }
    });
};

// send user put request to services 
function editUser(data) {
    request(`/api/user/${id_user_select}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${loginToken}`
        },
        body: data
    }).then(res => {
        cnt_form_user.classList.toggle("hide");
        renderUserTable()
    }).catch((err) => {
        console.log(err);
    });
};