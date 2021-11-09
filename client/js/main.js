// main script
const {is_admin} = JSON.parse(localStorage.getItem('data-user'));


// verify user admin role
const userLinkNav = document.getElementById("userLinkNav");

userLinkNav.classList.add("hide");
if (is_admin) {
    userLinkNav.classList.remove("hide");
}    


