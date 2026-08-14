/* =====================================================
   RAJKUMAR WEBSITE
   HOME PAGE JAVASCRIPT
===================================================== */


/* ================= MOBILE MENU ================= */

function toggleMenu() {

    const navbar = document.querySelector(".navbar");

    if (!navbar) {
        return;
    }

    navbar.classList.toggle("active");
}


/* ================= CLOSE MOBILE MENU ================= */

document.querySelectorAll(".navbar a").forEach(function(link) {

    link.addEventListener("click", function() {

        const navbar = document.querySelector(".navbar");

        if (navbar) {
            navbar.classList.remove("active");
        }

    });

});


/* ================= PAGE LOAD ================= */

document.addEventListener("DOMContentLoaded", function() {

    console.log("Rajkumar Website Home Page Loaded Successfully.");

});