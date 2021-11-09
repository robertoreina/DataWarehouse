// region-cities section script

import { request } from "./modules/request.js";

// authentication token 
import loginToken from "./verify-autentication.js";

const btn_new_region = document.getElementById("btn_new_region");
const region_list = document.getElementById("region_list");
// const cnt_input_new_region = document.getElementById("cnt_input_new_region");

let edit_active = false;

// region add button
btn_new_region.addEventListener("click", () => {
    if (!edit_active) {
        edit_active = true;
        cnt_input_new_region.classList.toggle("hide");
    }
});


// render region List 
renderRegionCountryCityList()

// load users table  users from endpoint
async function renderRegionCountryCityList() {
    try {
        const endpoint = '/api/region'
        let response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${loginToken}`
            }
        });
        const region = await response.json();

        if (region.status != 200) {
            throw { error: error.message || "Internal server error" }
        }

        region_list.innerHTML = `<li id="cnt_input_new_region" class="hide">
                                     <div>
                                        <input id="input_add_region" type="text" placeholder="Ingrese una Region" autofocus>
                                        <div>
                                            <i id="btn_ok_add_region" class="fas fa-check tag-hover" data-text="Guardar"></i>
                                            <i id="btn_cancel_add_region" class="fas fa-times tag-hover" data-text="Cancelar"></i>
                                        </div>                                    
                                    </div>
                                </li>`;
        //accept add region
        let btn_ok_add_region = document.getElementById(`btn_ok_add_region`);
        btn_ok_add_region.addEventListener("click", () => {
            if (input_add_region.value.trim()  === '') {
                return;
            }
            let data = {
                name: input_add_region.value
            };
            let url = `/api/region`;
            createRegionCountryCity(url, data);
            input_add_region.value = "";
            edit_active = false;
            cnt_input_new_region.classList.add("hide");
        });

        //cancel add region
        let btn_cancel_add_region = document.getElementById(`btn_cancel_add_region`);
        let cnt_input_new_region = document.getElementById(`cnt_input_new_region`);
        btn_cancel_add_region.addEventListener("click", () => {
            edit_active = false;
            cnt_input_new_region.classList.add("hide");
        });

        console.log(region);
        region.data.forEach((region, index) => {
            let region_item = renderRegionCountryCity(region_list, region, "region");
            renderContainerNewCountryCity(region_item, region.id, 'region')

            region.country.forEach((country, index) => {
                let country_item = renderRegionCountryCity(region_item, country, "pais");
                renderContainerNewCountryCity(country_item, country.id, 'pais')

                country.cities.forEach((city, index) => {
                    renderRegionCountryCity(country_item, city, "ciudad");
                });
            });
        });

    } catch (error) {
        console.log(error.message);
    }
}

function renderRegionCountryCity(region_list, region, modo) {
    let placeholder;
    let newCountryCity;
    switch (modo) {
        case "region":
            placeholder = `Ingrese una ${modo}`;
            newCountryCity = 'Pais'
            break;
        case "pais":
            placeholder = `Ingrese un ${modo}`;
            newCountryCity = 'Ciudad'
            break;
        case "ciudad":
            placeholder = `Ingrese una ${modo}`;
            newCountryCity = ''
            break;
        default:
            placeholder = '';
            newCountryCity = ''
            break;
    }

    let region_li = document.createElement('li');
    region_li.innerHTML = `<div class="region-index" id="cnt_region_${region.id}_${modo}">
                                <div>
                                    <input id="region_input_${region.id}_${modo}" type="text" value="${region.name}" class="input-${modo}" placeholder="${placeholder}" readonly>
                                    <div id="cnt_btn_edit_${region.id}_${modo}" class="cnt-btn-edit-region hide">
                                        <i id="btn_accept_chg_${region.id}_${modo}"  class="fas fa-check tag-hover" data-text="Guardar"></i>
                                        <i id="btn_cancel_chg_${region.id}_${modo}"  class="fas fa-times tag-hover" data-text="Cancelar"></i>
                                    </div>
                                </div>
                                <div id="cnt_btn_option_${region.id}_${modo}" class="cnt-btn-region hide">
                                    <i id="btn_dlt_region_${region.id}_${modo}" class="fas fa-trash-alt tag-hover" data-text="Eliminar ${modo}""></i>
                                    <i id="btn_edt_region_${region.id}_${modo}" class="fas fa-pen tag-hover" data-text="Editar ${modo}"></i>
                                    <i id="btn_add_country_${region.id}_${modo}" class="fas fa-plus tag-hover" data-text="Agregar ${newCountryCity}">${newCountryCity}</i>
                                </div>
                            </div>`;

    let item_child = document.createElement('ul');
    region_li.appendChild(item_child);
    region_list.appendChild(region_li);

    let region_input = document.getElementById(`region_input_${region.id}_${modo}`);
    let cnt_region = document.getElementById(`cnt_region_${region.id}_${modo}`);
    // let cnt_btn_region = document.getElementsByClassName(`cnt-btn-region`);
    // let cnt_btn_edit_region = document.getElementsByClassName(`cnt-btn-edit-region`);
    let cnt_btn_option = document.getElementById(`cnt_btn_option_${region.id}_${modo}`);
    let cnt_btn_edit = document.getElementById(`cnt_btn_edit_${region.id}_${modo}`);

    // item region over
    cnt_region.addEventListener("mouseover", () => {
        if (!edit_active) {
            cnt_btn_option.classList.remove("hide");
        }
    });

    // item region over leave
    cnt_region.addEventListener("mouseleave", () => cnt_btn_option.classList.add("hide"));

    //region delete button
    let btn_delete_region = document.getElementById(`btn_dlt_region_${region.id}_${modo}`);
    btn_delete_region.addEventListener("click", () => {
        let url;
        switch (modo) {
            case 'region':
                url = `/api/region/${region.id}`
                break;
            case 'pais':
                url = `/api/country/${region.id}`
                break;
            case 'ciudad':
                url = `/api/city/${region.id}`
                break;
            default:
                break;
        }
        
        deleteRegionCountryCity(url)
    });

    //region edit button
    let btn_edit_region = document.getElementById(`btn_edt_region_${region.id}_${modo}`);
    btn_edit_region.addEventListener("click", () => {
        edit_active = true;
        cnt_btn_option.classList.add("hide")
        cnt_btn_edit.classList.remove("hide");
        region_input.removeAttribute("readonly");
        region_input.select()
    });

    //add country or city button
    let btn_add_country = document.getElementById(`btn_add_country_${region.id}_${modo}`);
    if (modo == 'ciudad') {
        btn_add_country.classList.add("hide");
    }

    btn_add_country.addEventListener("click", () => {
        console.log(`cnt_input_new_${modo}_${region.id}`);
        let cnt_input_new_country_city = document.getElementById(`cnt_input_new_${modo}_${region.id}`);
        let input_new_country_city = document.getElementById(`input_add_${modo}_${region.id}`);
        input_new_country_city.focus()


        if (!edit_active) {
            edit_active = true;
            cnt_input_new_country_city.classList.toggle("hide");
        }
    });

    //accept edit
    let btn_accept_change = document.getElementById(`btn_accept_chg_${region.id}_${modo}`);
    btn_accept_change.addEventListener("click", () => {

        if (region_input.value.trim() === '') {
            return;
        }

        if (modo == "region") {
            let data = {
                name: region_input.value
            }
            let url = `/api/region/${region.id}`;
            updateRegionCountryCity(url, data)
        }
        if (modo == "pais") {
            let data = {
                name: region_input.value,
                region_id: region.region_id
            }
            let url = `/api/country/${region.id}`;
            updateRegionCountryCity(url, data)
        }
        if (modo == "ciudad") {
            let data = {
                name: region_input.value,
                country_id: region.country_id
            }
            let url = `/api/city/${region.id}`;
            updateRegionCountryCity(url, data)
        }

        controlActionInputEdit();
    });

    //cancel edit 
    let btn_cancel_change = document.getElementById(`btn_cancel_chg_${region.id}_${modo}`);
    btn_cancel_change.addEventListener("click", () => {
        region_input.value = region.name;
        controlActionInputEdit();
    });

    const controlActionInputEdit = function () {
        edit_active = false;
        cnt_btn_option.classList.remove("hide")
        cnt_btn_edit.classList.add("hide");
        region_input.setAttribute("readonly", "true");
    };

    return item_child;
}


// render container for add new country and city
function renderContainerNewCountryCity(element, id, itemAdd) {
    element.innerHTML = `<li id="cnt_input_new_${itemAdd}_${id}" class="hide">
                            <div>
                                <input id="input_add_${itemAdd}_${id}" type="text" placeholder="Ingrese" autofocus>
                                <div>
                                    <i id="btn_ok_add_${itemAdd}_${id}" class="fas fa-check tag-hover" data-text="Guardar"></i>
                                    <i id="btn_cancel_add_${itemAdd}_${id}" class="fas fa-times tag-hover" data-text="Cancelar"></i>
                                </div>                                    
                            </div>
                        </li>`;

    let cnt_input_new_country_city = document.getElementById(`cnt_input_new_${itemAdd}_${id}`);

    //accept add region
    let btn_ok_add_country_city = document.getElementById(`btn_ok_add_${itemAdd}_${id}`);
    let input_new_country_city = document.getElementById(`input_add_${itemAdd}_${id}`);
    btn_ok_add_country_city.addEventListener("click", () => {
        if (input_new_country_city.value.trim()  === '') {
            return;
        }
        
        let data;
        let url;
        if (itemAdd == 'region') {
            data = {
                name: input_new_country_city.value,
                region_id: id
            };  
            url = `/api/country`;
        }
        if (itemAdd == 'pais') {
            data = {
                name: input_new_country_city.value,
                country_id: id
            };  
            url = `/api/city`;
        }

        createRegionCountryCity(url, data);
        input_new_country_city.value = "";
        edit_active = false;
        cnt_input_new_country_city.classList.add("hide");
    });

    //cancel add region
    let btn_cancel_add_country_city = document.getElementById(`btn_cancel_add_${itemAdd}_${id}`);
    btn_cancel_add_country_city.addEventListener("click", () => {
        edit_active = false;
        cnt_input_new_country_city.classList.add("hide");
    });
}


// send region post request to services
function createRegionCountryCity(url, data) {
    request(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${loginToken}`
        },
        body: data

    }).then(res => {
        renderRegionCountryCityList();
    }).catch((err) => {
        console.err(err);
        switch (err.status) {
            case 409:
                break;
            default:
                break;
        }
    });
};

// send user put request to services 
function updateRegionCountryCity(url, data) {
    request(url, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${loginToken}`
        },
        body: data
    }).then(res => {
        renderRegionCountryCityList()
    }).catch((err) => {
        console.log(err);
    });
};

// send user delete request to services
function deleteRegionCountryCity(url) {
    request(url, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${loginToken}`
        }
    }).then(res => {
        renderRegionCountryCityList()
    }).catch((err) => {
        console.log(err);
    });
};

 