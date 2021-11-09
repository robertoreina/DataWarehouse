
// Sign Out
const btnSignOut = document.getElementById("btnSignOut");

btnSignOut.addEventListener("click", () =>{
    localStorage.removeItem('dw-token');
    localStorage.removeItem('data-user');
    window.location.href = "index.html"
});
