// Login script 
import { request } from "./modules/request.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const btnLogin = document.getElementById("btnLogin");
const errorMsg = document.getElementById("errorMsg");
const iconLoading = '<i id="loadingIconLogin" class="fas fa-spinner hide"></i>';


// user login
btnLogin.addEventListener("click", (e) => {
    e.preventDefault();

    errorMsg.innerHTML = ' ';

    if (email.value === '' || password.value === '') {
        errorMsg.innerHTML = 'Ingrese Email y Contraseña';
        return;
    }

    btnLogin.toggleAttribute('disabled');
    btnLogin.innerHTML = iconLoading;
    const loadingIconLogin = document.getElementById("loadingIconLogin");
    loadingIconLogin.classList.toggle("hide");

    request('/api/login', {
        method: 'POST',
        body: {
            email: email.value,
            password: password.value
        }
    }).then(res => {
        localStorage.setItem("dw-token", res.token);
        localStorage.setItem("data-user", JSON.stringify(res.data));
        console.log(res);
        window.location.href = "contacts.html"
    }).catch((err) => {
        console.log(err);
        btnLogin.innerHTML = 'Ingresar';
        errorMsg.innerHTML = err.response.error;
        btnLogin.toggleAttribute('disabled');
        loadingIconLogin.classList.toggle("hide");
        password.value = "";
    });
});
