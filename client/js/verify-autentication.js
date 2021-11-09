const pathname = window.location.pathname;
const loginToken = localStorage.getItem('dw-token');

if (loginToken ) {
    if (pathname === "/index.html") window.location.href = "contacts.html";

} else{
    if (pathname != "/index.html") window.location.href = "index.html";
}

export default loginToken;




