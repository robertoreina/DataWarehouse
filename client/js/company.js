// company section script

import { request } from "./modules/request.js";

// authentication token 
import loginToken from "./verify-autentication.js";

const btn_new_company = document.getElementById("btn_new_company");
const cnt_form_company = document.getElementById("cnt_form_company");
const form_company = document.getElementById("form_company");

const input_email = document.getElementById("input_email");
const input_name = document.getElementById("input_name");
const input_address = document.getElementById("input_address");
const input_phone = document.getElementById("input_phone");
const region_select = document.getElementById("region_select");
const country_select = document.getElementById("country_select");
const city_select = document.getElementById("city_select");

const msg_email_error = document.getElementById("msg_email_error");
const msg_name_error = document.getElementById("msg_name_error");
const msg_address_error = document.getElementById("msg_address_error");
const msg_phone_error = document.getElementById("msg_phone_error");
const msg_city_error = document.getElementById("msg_city_error");

const btn_save = document.getElementById("btn_save");
const btn_cancelar = document.getElementById("btn_cancelar");

let id_company_select;
let regionList;
let countryList;
let cityList;

const loggedUser = JSON.parse(localStorage.getItem('data-user'));



// company add button
btn_new_company.addEventListener("click", () => {
    form_company.reset();
    region_select.innerHTML = '';
    country_select.innerHTML = '';
    city_select.innerHTML = '';
    loadRegionList(0);
    document.querySelector("form h2").innerHTML = 'Agregar Compañia';
    cnt_form_company.classList.toggle("hide");
});

// cancel button in company creation or edition form 
btn_cancelar.addEventListener("click", () => {
    cnt_form_company.classList.toggle("hide");
});

// render users table 
renderCompanyTable()

// pre-load region/country/city list 
regionRequest();

// load company table  companies from endpoint
async function renderCompanyTable() {
    try {
        const endpoint = '/api/company'
        let response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${loginToken}`
            }
        });
        const company = await response.json();

        if (company.status != 200) {
            throw { error: error.message || "Internal server error" }
        }

        let tableCompany = document.getElementsByTagName("table")[0];

        tableCompany.innerHTML = `<tr>
                                    <th hidden>id</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Pais</th>
                                    <th>Direccion</th>
                                    <th>Telefono</th>
                                    <th>Accion</th>
                                 </tr>`;

        company.data.forEach(company => {
            let row = document.createElement('tr');
            row.innerHTML = `<td hidden>${company.id}</td>
                             <td>${company.name}</td>
                             <td>${company.email}</td>
                             <td>${company.cities.countries.name}</td>
                             <td>${company.address}</td>
                             <td>${company.phone}</td>
                             <td>
                                <i id="btnMoreOption" class="fas fa-ellipsis-h"></i>
                                <div class="box-more-action">
                                    <i id="btn_delete_company${company.id}" class="fas fa-trash-alt tag-hover" data-text="Eliminar Compañía"></i>
                                    <i id="btn_edit_company${company.id}" class="fas fa-pen tag-hover" data-text="Editar Compañía"></i>
                                </div>
                            </td>`;
            tableCompany.appendChild(row);

            //company delete button
            let btn_delete_company = document.getElementById(`btn_delete_company${company.id}`);
            btn_delete_company.addEventListener("click", () => showDeleteCompanyConfirmation(company.id));

            //company edit button
            let btn_edit_company = document.getElementById(`btn_edit_company${company.id}`);
            btn_edit_company.addEventListener("click", () => showEditForm(company));
        });

    } catch (error) {
        console.log(error.message);
    }
}

/**
 * Show Edit Form Company
 * @param {company} company object
 */
function showEditForm(company) {
    form_company.reset();
    id_company_select = company.id;
    document.querySelector("form h2").innerHTML = 'Editar Compañia';
    document.querySelectorAll(".msg-error-input").forEach(msg_input => {
        msg_input.innerHTML = "";
    });
    input_email.value = company.email;
    input_name.value = company.name;
    input_address.value = company.address;
    input_phone.value = company.phone;
    loadRegionList(company.cities.countries.regions.id);
    loadCountryList(company.cities.countries.regions.id, company.cities.countries.id);
    loadCityList(company.cities.countries.id, company.cities.id)
   
    cnt_form_company.classList.toggle("hide");
};

function renderSelectOption(elementSelect, id, name, selected) {
    let option = document.createElement("option")
    option.setAttribute("value", id);
    option.innerHTML = name;

    if (selected == id) {
        option.setAttribute("selected", selected);
    }

    elementSelect.appendChild(option);
}

// send region get request to services
function regionRequest() {
    request(`/api/region`, {
        method: 'get',
        headers: {
            Authorization: `Bearer ${loginToken}`
        }
    }).then(res => {
        regionList = res.data;
    }).catch((err) => {
        console.log(err);
    });
};


region_select.addEventListener("change", (event) => {
    loadCountryList(event.target.value, 0)
});

country_select.addEventListener("change", (event) => {
    loadCityList(event.target.value, 0)
});

function loadCountryList(regionId, countrySelected) {
    country_select.innerHTML = '';
    city_select.innerHTML = '';


    if (regionId == 0) {
        regionSelect = {};
        return;
    }
    let regionSelect = regionList.find(region => region.id == regionId);
    renderSelectOption(country_select, 0, 'Seleccione un Pais');
    countryList = regionSelect.country;
    countryList.forEach(country => {
        renderSelectOption(country_select, country.id, country.name, countrySelected);
    });
}

function loadRegionList(regionSelected) {
    region_select.innerHTML = "";
    renderSelectOption(region_select, 0, 'Seleccione una Region');
    regionList.forEach(region => {
        renderSelectOption(region_select, region.id, region.name, regionSelected);
    });
}

function loadCityList(countryId, citySelected) {
    let countrySelect = countryList.find(country => country.id == countryId);
    city_select.innerHTML = '';
    renderSelectOption(city_select, 0, 'Seleccione una Ciudad');
    countrySelect.cities.forEach(city => {
        renderSelectOption(city_select, city.id, city.name, citySelected);
    });
}


function showDeleteCompanyConfirmation(company_id) {
    document.getElementById("modal_delete_company").classList.toggle("hide");
    id_company_select = company_id;
};

//button cancel company delet
document.getElementById("btn_cancel_dlt").addEventListener("click", () => {
    document.getElementById("modal_delete_company").classList.toggle("hide");
});


//confirm button delete  company 
document.getElementById("btn_delete").addEventListener("click", () => {
    deleteCompany();
});

// add  and edit new company
btn_save.addEventListener("click", () => {
    let addCompany = document.querySelector("form h2").innerHTML === 'Agregar Compañia' ? true : false;

    if (validateFormCompany()) return;


    let data = {
        email: input_email.value,
        name: input_name.value,
        address: input_address.value,
        phone: input_phone.value,
        city_id: city_select.value
        // updater_userid: loggedUser.id
    };

    if (addCompany) {
        createCompany(data);
    } else {
        editCompany(data)
    };

});

/**
 * 
 * @returns true if error
 */
function validateFormCompany() {
    let error = false;

    // email
    if (input_email.value.trim() === "") {
        msg_email_error.innerHTML = "Este campo es obligatorio"
        error = true;
    }

    // Nombre
    if (input_name.value.trim() === "") {
        msg_name_error.innerHTML = "Este campo es obligatorio"
        error = true;
    }

    //Address
    if (input_address.value.trim() === "") {
        msg_address_error.innerHTML = "Este campo es obligatorio"
        error = true;
    }

    // Telefono
    if (input_phone.value.trim() === "") {
        msg_phone_error.innerHTML = "Este campo es obligatorio"
        error = true;
    }

    // ciudad
    if (!city_select.value || city_select.value == '0') {
        msg_city_error.innerHTML = "Este campo es obligatorio"
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

input_address.addEventListener("input", () => {
    msg_address_error.innerHTML = "";
});

input_phone.addEventListener("input", () => {
    msg_phone_error.innerHTML = "";
});

city_select.addEventListener("change", () => {
    msg_city_error.innerHTML = "";
});

// send company delete request to services
function deleteCompany() {
    request(`/api/company/${id_company_select}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${loginToken}`
        }
    }).then(res => {
        document.getElementById("modal_delete_company").classList.toggle("hide");
        renderCompanyTable()
    }).catch((err) => {
        console.log(err);
    });
};

// send company post request to services
function createCompany(data) {

    request(`/api/company`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${loginToken}`
        },
        body: data
    }).then(res => {
        cnt_form_company.classList.toggle("hide");
        renderCompanyTable()
    }).catch((err) => {
        console.log(err);

        // switch (err.status) {
        //     case 409:
        //         msg_email_error.innerHTML = "Email ya se encuentra registrado ";
        //         break;
        //     default:
        //         break;
        // }
    });
};

// send company put request to services 
function editCompany(data) {
    request(`/api/company/${id_company_select}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${loginToken}`
        },
        body: data
    }).then(res => {
        cnt_form_company.classList.toggle("hide");
        renderCompanyTable()
    }).catch((err) => {
        console.log(err);
    });
};