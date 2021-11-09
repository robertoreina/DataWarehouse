// contact section script

import { request } from "./modules/request.js";

// authentication token 
import loginToken from "./verify-autentication.js";

const btn_new_contact = document.getElementById("btn_new_contact");
const numberPage_Select = document.getElementById("numberPage_Select");
const totalRows = document.getElementById("totalRows");
const rowsPages = document.getElementById("rowsPages");
const selectedRows = document.getElementById("selectedRows");
const slide_left = document.getElementById("slide_left");

const inputSearch = document.getElementById("inputSearch");
const buttonSearch = document.getElementsByClassName("fa-search");


const cnt_form_contact = document.getElementById("cnt_form_contact");
const forms = document.querySelectorAll("form");

const input_email = document.getElementById("input_email");
const input_name = document.getElementById("input_name");
const input_lastName = document.getElementById("input_lastName");
const input_address = document.getElementById("input_address");
const input_job = document.getElementById("input_job");
const region_select = document.getElementById("region_select");
const interes_select = document.getElementById("interes_select");
const country_select = document.getElementById("country_select");
const city_select = document.getElementById("city_select");
const company_select = document.getElementById("company_select");
const contactChanel_select = document.getElementById("contactChanel_select");
const preference_select = document.getElementById("preference_select");

const msg_email_error = document.getElementById("msg_email_error");
const msg_name_error = document.getElementById("msg_name_error");
const msg_lastName_error = document.getElementById("msg_lastName_error");
const msg_job_error = document.getElementById("msg_job_error");
const msg_address_error = document.getElementById("msg_address_error");
const msg_company_error = document.getElementById("msg_company_error");
const msg_city_error = document.getElementById("msg_city_error");
const msg_region_error = document.getElementById("msg_region_error");
const msg_country_error = document.getElementById("msg_country_error");

const btn_save = document.getElementById("btn_save");
const btn_add_contactChanel = document.getElementById("btn_add_contactChanel");
const btn_delete_b = document.getElementById(`btn_delete_b`);

let controlEditChanel = [];
let contacts;
let selectedContact = [];
let id_contact_select;
let regionList = [];
let countryList = [];
let preferencesList = [];
let contactChanelList = [];
let companiesList = [];
let currentContactChannels = [];

let controlRowsFrom = 1;
let controlRowsTo = 1;
let rowsPagesControl = localStorage.getItem('rows-pages-control');
if (!rowsPagesControl) {
    localStorage.setItem("rows-pages-control", '10');
}

// contact add button
btn_new_contact.addEventListener("click", () => {
    btn_delete_b.classList.add("hide")
    btn_delete_b.disabled = true;
    btn_add_contactChanel.disabled = true;
    currentContactChannels = [];

    document.querySelectorAll("p.msg-error-input").forEach(msg =>{
        msg.innerHTML = ' '
    });

    forms.forEach(form => {
        form.reset();
    });
    region_select.innerHTML = '';
    country_select.innerHTML = '';
    city_select.innerHTML = '';
    loadRegionList(0);
    loadCompanyList(0);
    loadOptionInSelect(contactChanelList, contactChanel_select, 0, 'el canal de contacto');
    loadOptionInSelect(preferencesList, preference_select, 0, 'la preferencia');
    document.querySelector("div.container-form h2").innerHTML = 'Nuevo Contacto';


    renderContacChanelList([]);
    cnt_form_contact.classList.toggle("hide");
    // console.log(document.getElementsByTagName("form")[0]);
});

// render users table 
contactGetRequest();

// load region/country/city list 
listsLoad(`/api/region`, (list) => regionList = list);

// load contact list 
listsLoad(`/api/company`, (list) => companiesList = list);

// Load preferences list 
listsLoad(`/api/preference`, (list) => preferencesList = list);

// Load  contact chanel list
listsLoad(`/api/contact-chanel`, (list) => contactChanelList = list);

// get contact service
async function contactGetRequest() {
    try {
        const endpoint = '/api/contact'
        let response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${loginToken}`
            }
        });
        contacts = await response.json();

        if (contacts.status != 200) {
            throw { error: error.message || "Internal server error" }
        }

        totalRows.innerHTML = contacts.control.total_count;
        renderContacTable(0, contacts.control.total_count < rowsPagesControl ? contacts.control.total_count : rowsPagesControl);

    } catch (error) {
        console.log(error.message);
    }
}

// get contact search service
async function searchGetRequest(search) {
    try {
        const endpoint = `/api/contact/search?q=${search}`
        let response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${loginToken}`
            }
        });
        contacts = await response.json();

        if (contacts.status != 200) {
            throw { error: error.message || "Internal server error" }
        }

        totalRows.innerHTML = contacts.control.total_count;

        renderContacTable(0, contacts.control.total_count < rowsPagesControl ? contacts.control.total_count : rowsPagesControl);

    } catch (error) {
        console.log(error.message);
    }
}

// render contact table
function renderContacTable(indexFrom, indexTo) {

    controlRowsFrom = parseInt(indexFrom) + 1;
    controlRowsTo = indexTo;

    rowsPages.innerHTML = `${controlRowsFrom}-${controlRowsTo}`
    const tableContact = document.getElementsByTagName("table")[0];

    tableContact.innerHTML = `<tr>
                                    <th hidden>id</th>
                                    <th><input type="checkbox" name="contact_selector" id="contactSelectorAll"></th>
                                    <th>Contacto <img class="icon-sort hide" src="./assets/sort-svgrepo-com.svg"/> </th>
                                    <th>Pais/Region <img class="icon-sort hide" src="./assets/sort-svgrepo-com.svg"/></th>
                                    <th>Compañía <img class="icon-sort hide" src="./assets/sort-svgrepo-com.svg"/></th>
                                    <th>Cargo <img class="icon-sort hide" src="./assets/sort-svgrepo-com.svg"/></th>
                                    <th>Interés <img class="icon-sort hide" src="./assets/sort-svgrepo-com.svg"/></th>
                                    <th>Acción</th>
                                </tr>`;

    const contactSelectorAll = document.getElementById("contactSelectorAll");
    if (selectedContact.length > 0) {
        contactSelectorAll.indeterminate = true;
    }

    contactSelectorAll.addEventListener("click", () => {
        let checkboxElement = document.querySelectorAll("tr td input");

        if (contactSelectorAll.checked) {
            checkboxElement.forEach(checkbox => {
                checkbox.checked = true;
                checkbox.parentNode.parentNode.classList.add("rows-selected-background");
            })

            selectedContact = []
            contacts.data.forEach((contact) => {
                selectedContact.push(contact.id);
            });
        } else {
            checkboxElement.forEach(checkbox => {
                checkbox.checked = false;
                checkbox.parentNode.parentNode.classList.remove("rows-selected-background");

            })
            selectedContact = []
        }
        renderSelectedTag();

    });

    for (let index = indexFrom; index < indexTo; index++) {
        const contact = contacts.data[index];

        let row = document.createElement('tr');

        //set class interes
        let interes_class;

        switch (contact.interes) {
            case 25:
                interes_class = 'interes-lightBlue';
                break;
            case 50:
                interes_class = 'interes-yellow';
                break;
            case 75:
                interes_class = 'interes-orange';
                break;
            case 100:
                interes_class = 'interes-red';
                break;

            default:
                interes_class = '';
                break;
        }

        row.innerHTML = `<td hidden></td>
                                <td><input type="checkbox" name="contact_selector" id="contactSelector${contact.id}"></td>
                                <td class="contact-column"><img src="./assets/user-2.png" alt="user avatar"> <div class="group-text-contact"><p>${contact.first_name} ${contact.last_name}</p><p class="secondary-text">${contact.email}</p></div></td>
                                <td><p>${contact.cities.countries.name}</p><p class="secondary-text">${contact.cities.countries.regions.name}</p></td>
                                <td>${contact.companies.name}</td>
                                <td>${contact.job}</td>
                                <td>${contact.interes}% <div class="back-interes-bar ${interes_class}"> </div></td>
                                <td>
                                <i id="btnMoreOption" class="fas fa-ellipsis-h"></i>
                                <div class="box-more-action">
                                    <i id="btn_delete_contact${contact.id}" class="fas fa-trash-alt tag-hover" data-text="Eliminar Contacto"></i>
                                    <i id="btn_edit_contact${contact.id}" class="fas fa-pen tag-hover" data-text="Editar Contacto"></i>
                                </td>`;
        tableContact.appendChild(row);

        //Contact Check 
        let contactCheck = document.getElementById(`contactSelector${contact.id}`)
        if (selectedContact.indexOf(contact.id) >= 0) {
            contactCheck.checked = true
            row.classList.add("rows-selected-background");
        }

        contactCheck.addEventListener("click", () => {
            if (contactCheck.checked == true && selectedContact.indexOf(contact.id) < 0) {
                contactSelectorAll.indeterminate = true;
                selectedContact.push(contact.id);
            }

            if (contactCheck.checked == false) {
                selectedContact.splice(selectedContact.indexOf(contact.id), 1);
            }
            contactCheck.parentNode.parentNode.classList.toggle("rows-selected-background");
            renderSelectedTag();
        });

        //contact delete button
        let btn_delete_contact = document.getElementById(`btn_delete_contact${contact.id}`);
        btn_delete_contact.addEventListener("click", () => showDeleteContactConfirmation(contact.id));

        //contact edit button
        let btn_edit_contact = document.getElementById(`btn_edit_contact${contact.id}`);
        btn_edit_contact.addEventListener("click", () => showEditForm(contact));
    };
}
function renderSelectedTag() {
    if (selectedContact.length == 0) {
        contactSelectorAll.indeterminate = false;
        selectedRows.parentNode.classList.add("hide");
    } else {
        selectedRows.innerHTML = `${selectedContact.length} Selecionados`
        selectedRows.parentNode.classList.remove("hide");
    }
}

//control table paged
numberPage_Select.addEventListener("change", (event) => {
    localStorage.setItem("rows-pages-control", event.target.value);
    rowsPagesControl = event.target.value;
    renderContacTable(0, contacts.control.total_count < rowsPagesControl ? contacts.control.total_count : rowsPagesControl);
});

slide_right.addEventListener("click", () => {
    if (controlRowsTo >= contacts.control.total_count) {
        return;
    }
    controlRowsFrom = controlRowsTo;
    controlRowsTo = parseInt(controlRowsTo) + parseInt(rowsPagesControl)
    console.log('controlRowsTo ' + controlRowsTo)

    renderContacTable(controlRowsFrom, contacts.control.total_count < controlRowsTo ? contacts.control.total_count : controlRowsTo);

});

slide_left.addEventListener("click", () => {
    if (controlRowsFrom <= 1) {
        return;
    }
    controlRowsFrom = (parseInt(controlRowsFrom) - (parseInt(rowsPagesControl) + 1));
    controlRowsTo = parseInt(controlRowsFrom) + parseInt(rowsPagesControl);

    console.log('controlRowsFrom ' + controlRowsFrom, 'controlRowsTo ' + controlRowsTo);
    renderContacTable(controlRowsFrom, contacts.control.total_count < controlRowsTo ? contacts.control.total_count : controlRowsTo);
});


// Contact Search
buttonSearch[0].addEventListener("click", () => {
    searchGetRequest(inputSearch.value)
    inputSearch.value = '';
});

inputSearch.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
        searchGetRequest(inputSearch.value)
        inputSearch.value = '';
    }
});


// button delete selected contacts
let button_delete_select = document.querySelectorAll(".tag-check-container button");

button_delete_select[0].addEventListener("click", () => {
    Promise.all(
        selectedContact.map((id) => {
            return deleteContact(id)
        }
        )).then(res => {
            selectedContact = [];
            renderSelectedTag()
            contactGetRequest();
        });
});

/**
 * Show Edit Form contact
 * @param {contact} contact object
 */
function showEditForm(contact) {
    forms.forEach(form => {
        form.reset();
    });
    
    btn_delete_b.classList.remove("hide")
    btn_delete_b.disabled = false;
    btn_add_contactChanel.disabled = true;
    id_contact_select = contact.id;

    document.querySelector("div.container-form h2").innerHTML = 'Editar Contacto';
    document.querySelectorAll(".msg-error-input").forEach(msg_input => {
        msg_input.innerHTML = "";
    });

    input_email.value = contact.email;
    input_name.value = contact.first_name;
    input_lastName.value = contact.last_name;
    input_job.value = contact.job;
    input_address.value = contact.address;
    loadRegionList(contact.cities.countries.regions.id);
    loadCountryList(contact.cities.countries.regions.id, contact.cities.countries.id);
    loadCityList(contact.cities.countries.id, contact.cities.id)
    loadOptionInSelect(companiesList, company_select, contact.companies.id, 'la compañía');
    loadOptionInSelect(preferencesList, preference_select, 0, 'la preferencia');

    const contactChanelMissing = contactChanelList.filter(mapElement => {
        return !contact.contact_has_chanels.some(element => element.contact_chanel_id === mapElement.id);
    });

    loadOptionInSelect(contactChanelMissing, contactChanel_select, 0, 'el canal de contacto');

    currentContactChannels = contact.contact_has_chanels;
    renderContacChanelList(contact.contact_has_chanels);

    interes_select.value = contact.interes;
    cnt_form_contact.classList.toggle("hide");
};


//render form contact chanel
function renderContacChanelList(list) {

    const ul = document.querySelector(".form-secundary ul");
    for (let index = 0; index < ul.childNodes.length; index++) {
        const element = ul.childNodes[index];
        if (index > 1 && element != null) {
            ul.removeChild(element);
            index -= 1;
        }
    }

    controlEditChanel = [];

    list.forEach(element => {
        let li = document.createElement('li');
        li.innerHTML = `<li>       
                            <div class="box-input">
                                <select class="standar-input" id="contactChanel_select" name="contactChanelSelect" disabled>
                                    <option value="${element.contact_chanel_id}" selected>${element.contact_chanels.name}</option>
                                </select>
                                <p id="msg_contactChanel_error" class="msg-error-input"></p>
                            </div>
                            <div class="box-input">
                                <input class="standar-input" type="tel" name="inputUserName" id="input_userName${element.contact_chanel_id}" maxlength="250" value="${element.user_account}" disabled>
                                <p id="msg_userName_error" class="msg-error-input"></p>
                            </div>
                            <div class="box-input">
                                <select class="standar-input" id="select_preference${element.contact_chanel_id}" name="prefencesSelect" disabled>
                                //    <option value="${element.preference_id}" selected>${element.preferences.name}</option>
                                </select>
                                <p id="msg_preferences_error" class="msg-error-input"></p>
                            </div>
                            <button id="btn_edt_chanel${element.contact_chanel_id}" class="seconday-button hide"><i class="fas fa-pen"></i>   Editar canal</button>
                            <button id="btn_dlt_chanel${element.contact_chanel_id}" class="seconday-button"><i class="fas fa-trash-alt"></i>   Eliminar canal</button>
                        </li>`;

        ul.appendChild(li);

        const userName = document.getElementById(`input_userName${element.contact_chanel_id}`)
        const preference = document.getElementById(`select_preference${element.contact_chanel_id}`)
        loadOptionInSelect(preferencesList, preference, element.preference_id, 'la preferencia');

        // button operation delete contact chanel
        document.getElementById(`btn_dlt_chanel${element.contact_chanel_id}`).addEventListener("click", (event)=>{
            event.preventDefault();
            currentContactChannels.splice(currentContactChannels.findIndex(chanel => chanel.contact_chanel_id === element.contact_chanel_id), 1);

            renderContacChanelList(currentContactChannels);
            const option = document.createElement("option");
            option.value = element.contact_chanel_id;
            option.text = element.contact_chanels.name;
            selectNewContactChanel[0].add(option);
        });

        // button operation edit contact chanel
        document.getElementById(`btn_edt_chanel${element.contact_chanel_id}`).addEventListener("click", (event)=>{
            event.preventDefault();
            if (!controlEditChanel.includes(element.contact_chanel_id)) {
                controlEditChanel.push(element.contact_chanel_id);
                preference.disabled = false;
                userName.disabled = false;
                return;
            }
            controlEditChanel.splice(controlEditChanel.indexOf(element.contact_chanel_id), 1);
            preference.disabled = true;
            userName.disabled = true;

            currentContactChannels.splice(currentContactChannels.findIndex(chanel => chanel.contact_chanel_id === element.contact_chanel_id), 1);

            // renderContacChanelList(currentContactChannels);
            // const option = document.createElement("option");
            // option.value = element.contact_chanel_id;
            // option.text = element.contact_chanels.name;
            // selectNewContactChanel[0].add(option);
        });
    });
}


// button operation add contact channel
btn_add_contactChanel.addEventListener("click", (event) => {
    event.preventDefault();

    currentContactChannels.push(
        {
            contact_chanel_id: selectNewContactChanel[0].value,
            user_account: inputUserAccount.value,
            preference_id: selectNewContactChanel[1].value,
            contact_chanels:{
                name: selectNewContactChanel[0].options[selectNewContactChanel[0].selectedIndex].innerText
            },
            preferences:{
                name: selectNewContactChanel[1].options[selectNewContactChanel[1].selectedIndex].innerText
            }
        });

        selectNewContactChanel[0].remove(selectNewContactChanel[0].selectedIndex)
        selectNewContactChanel[1].selectedIndex = 0;

        inputUserAccount.value = "";
        btn_add_contactChanel.disabled = true;

        renderContacChanelList(currentContactChannels);
});

// controls status of add channel contact button
const inputUserAccount = document.querySelector(".new-contact-chanel div input");
inputUserAccount.addEventListener("input", (event) => {
    btn_add_contactChanel.disabled = false;

    const select = document.querySelectorAll(".new-contact-chanel div select")
    if (event.target.value.trim() == '' || select[0].value === '0' || select[1].value === '0') {
        btn_add_contactChanel.disabled = true;
    }
});

const selectNewContactChanel = document.querySelectorAll(".new-contact-chanel div select");
selectNewContactChanel.forEach(select => {
    select.addEventListener("change", (event) => {
        btn_add_contactChanel.disabled = false;

        if (inputUserAccount.value.trim() == '' || selectNewContactChanel[0].value == "0" || selectNewContactChanel[1].value == "0") {
            btn_add_contactChanel.disabled = true
        }
    });
});

// render options on select elements
function renderSelectOption(elementSelect, id, name, selected) {
    let option = document.createElement("option")
    option.setAttribute("value", id);
    option.innerHTML = name;

    if (selected == id) {
        option.setAttribute("selected", selected);
    }

    elementSelect.appendChild(option);
}

// send  get request to services
function listsLoad(url, callback) {
    request(url, {
        method: 'get',
        headers: {
            Authorization: `Bearer ${loginToken}`
        }
    }).then(res => {
        callback(res.data);
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
function loadCompanyList(companySelected) {
    company_select.innerHTML = "";
    renderSelectOption(company_select, 0, 'Seleccione una compañía');
    companiesList.forEach(company => {
        renderSelectOption(company_select, company.id, company.name, companySelected);
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

function loadOptionInSelect(list, selectElement, optionSelected, tag) {
    selectElement.innerHTML = "";
    renderSelectOption(selectElement, 0, `Seleccione ${tag}`);
    list.forEach(element => {
        renderSelectOption(selectElement, element.id, element.name, optionSelected);
    });
};


function showDeleteContactConfirmation(contact_id) {
    document.getElementById("modal_delete_contact").classList.toggle("hide");
    id_contact_select = contact_id;
};

//button cancel contact delet
document.getElementById("btn_cancel_dlt").addEventListener("click", () => {
    document.getElementById("modal_delete_contact").classList.toggle("hide");
});


//confirm button delete  contact 
document.getElementById("btn_delete").addEventListener("click", () => {
    cnt_form_contact.classList.add("hide");
    deleteContact(id_contact_select)
        .then(res => {
            document.getElementById("modal_delete_contact").classList.toggle("hide");
            contactGetRequest();
        })
});

// close button form edit-add contact
let buttonClose = document.querySelector(".box-form-a i");
buttonClose.addEventListener("click", () => {
    cnt_form_contact.classList.toggle("hide");
});

// add  and edit new contact
btn_save.addEventListener("click", () => {
    let addContact = document.querySelector(".box-form-a h2").innerHTML === 'Nuevo Contacto' ? true : false;

    if (validateFormContact()) return;

    let data = {
        first_name: input_name.value,
        last_name: input_lastName.value,
        job: input_job.value,
        company_id: company_select.value,
        email: input_email.value,
        city_id: city_select.value,
        address: input_address.value,
        interes: interes_select.value,
        contact_chanels: currentContactChannels
    };

    if (addContact) {
        createContact(data);
    } else {
        editContact(data)
    };
});

/**
 * 
 * @returns true if error
 */
function validateFormContact() {
    let error = false;

    // email
    if (input_email.value.trim() === "") {
        msg_email_error.innerHTML = "Este campo es obligatorio"
        error = true;
    }

    // name
    if (input_name.value.trim() === "") {
        msg_name_error.innerHTML = "Este campo es obligatorio"
        error = true;
    }

    // last name
    if (input_lastName.value.trim() === "") {
        msg_name_error.innerHTML = "Este campo es obligatorio"
        error = true;
    }

    // company
    if (!company_select.value || company_select.value == '0') {
        msg_company_error.innerHTML = "Este campo es obligatorio"
        error = true;
    }    

    //Address
    if (input_address.value.trim() === "") {
        msg_address_error.innerHTML = "Este campo es obligatorio"
        error = true;
    }

    // job
    if (input_job.value.trim() === "") {
        msg_job_error.innerHTML = "Este campo es obligatorio"
        error = true;
    }

    // ciudad
    if (!city_select.value || city_select.value == '0') {
        msg_city_error.innerHTML = "Este campo es obligatorio"
        error = true;
    }

    // country
    if (!region_select.value || region_select.value == '0') {
        msg_region_error.innerHTML = "Este campo es obligatorio"
        error = true;
    }

    // region
    if (!country_select.value || country_select.value == '0') {
        msg_country_error.innerHTML = "Este campo es obligatorio"
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

input_lastName.addEventListener("input", () => {
    msg_lastName_error.innerHTML = "";
});

input_job.addEventListener("input", () => {
    msg_job_error.innerHTML = "";
});

input_address.addEventListener("input", () => {
    msg_address_error.innerHTML = "";
});

company_select.addEventListener("change", () => {
    msg_company_error.innerHTML = "";
});

city_select.addEventListener("change", () => {
    msg_city_error.innerHTML = "";
});
region_select.addEventListener("change", () => {
    msg_region_error.innerHTML = "";
});

country_select.addEventListener("change", () => {
    msg_country_error.innerHTML = "";
});

//contact delete button
btn_delete_b.addEventListener("click", () => {
    // cnt_form_contact.classList.toggle("hide");
    showDeleteContactConfirmation(id_contact_select)
});


// send company delete request to services
function deleteContact(id) {
    return new Promise((resolved, reject) => {

        request(`/api/contact/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${loginToken}`
            }
        }).then(res => {
            resolved(res);
        }).catch((err) => {
            console.log(err);
            reject(err);
        });
    }
    )
};

// send company post request to services
function createContact(data) {

    request(`/api/contact`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${loginToken}`
        },
        body: data
    }).then(res => {
        location.reload();
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
function editContact(data) {
    request(`/api/contact/${id_contact_select}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${loginToken}`
        },
        body: data
    }).then(res => {
        location.reload();
    }).catch((err) => {
        console.log(err);
    });
};