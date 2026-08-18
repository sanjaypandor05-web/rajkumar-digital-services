/* =====================================================
   RAJKUMAR RATIONCARD SERVICES
   ADMIN JAVASCRIPT
===================================================== */


/* =====================================================
   TEMPORARY ADMIN LOGIN
   Google Apps Script સાથે પછી secure login કરીશું
===================================================== */

const ADMIN_ID = "admin";
const ADMIN_PASSWORD = "1234";


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    setupAdminLogin();

    setupCreateRetailer();

    checkAdminSession();

});


/* =====================================================
   ADMIN LOGIN
===================================================== */

function setupAdminLogin() {

    const form =
        document.getElementById("adminLoginForm");


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const id =
                document
                .getElementById("adminId")
                .value
                .trim();


            const password =
                document
                .getElementById("adminPassword")
                .value;


            const message =
                document.getElementById(
                    "adminLoginMessage"
                );


            if (
                id === ADMIN_ID &&
                password === ADMIN_PASSWORD
            ) {

                sessionStorage.setItem(
                    "adminLoggedIn",
                    "true"
                );


                showAdminDashboard();


            } else {

                showAdminLoginMessage(
                    message,
                    "❌ Admin ID અથવા Password ખોટો છે."
                );

            }

        }
    );

}


/* =====================================================
   ADMIN DASHBOARD
===================================================== */

function showAdminDashboard() {

    const login =
        document.getElementById(
            "adminLoginSection"
        );


    const dashboard =
        document.getElementById(
            "adminDashboardSection"
        );


    if (login) {

        login.style.display =
            "none";

    }


    if (dashboard) {

        dashboard.style.display =
            "block";

    }


    loadDemoStatistics();

}


/* =====================================================
   CHECK ADMIN SESSION
===================================================== */

function checkAdminSession() {

    const loggedIn =
        sessionStorage.getItem(
            "adminLoggedIn"
        );


    if (loggedIn === "true") {

        showAdminDashboard();

    }

}


/* =====================================================
   ADMIN LOGOUT
===================================================== */

function adminLogout() {

    sessionStorage.removeItem(
        "adminLoggedIn"
    );


    location.reload();

}


/* =====================================================
   LOGIN MESSAGE
===================================================== */

function showAdminLoginMessage(
    element,
    message
) {

    if (!element) {
        return;
    }


    element.style.display =
        "block";


    element.style.background =
        "#ffebee";


    element.style.color =
        "#c62828";


    element.style.border =
        "1px solid #ffcdd2";


    element.innerHTML =
        message;

}


/* =====================================================
   ADMIN PANELS
===================================================== */

function showAdminPanel(panelId) {

    const panels =
        document.querySelectorAll(
            ".admin-panel"
        );


    panels.forEach(
        function (panel) {

            panel.classList.add(
                "admin-hidden"
            );

        }
    );


    const selected =
        document.getElementById(
            panelId
        );


    if (selected) {

        selected.classList.remove(
            "admin-hidden"
        );


        selected.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/* =====================================================
   CREATE RETAILER
===================================================== */

function setupCreateRetailer() {

    const form =
        document.getElementById(
            "createRetailerForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document
                .getElementById(
                    "newRetailerName"
                )
                .value
                .trim();


            const mobile =
                document
                .getElementById(
                    "newRetailerMobile"
                )
                .value
                .trim();


            const retailerId =
                document
                .getElementById(
                    "newRetailerId"
                )
                .value
                .trim();


            const password =
                document
                .getElementById(
                    "newRetailerPassword"
                )
                .value;


            const message =
                document.getElementById(
                    "retailerCreateMessage"
                );


            if (
                name === "" ||
                mobile === "" ||
                retailerId === "" ||
                password === ""
            ) {

                showRetailerMessage(
                    message,
                    "⚠️ બધી જરૂરી માહિતી ભરો.",
                    false
                );

                return;

            }


            if (
                !/^[0-9]{10}$/.test(
                    mobile
                )
            ) {

                showRetailerMessage(
                    message,
                    "⚠️ Mobile Number 10 digit હોવો જોઈએ.",
                    false
                );

                return;

            }


            /*
             * હાલ DEMO MODE
             *
             * પછી આ data Google Sheetમાં
             * Code.gs દ્વારા save થશે.
             */


            const retailer = {

                name: name,

                mobile: mobile,

                retailerId: retailerId,

                password: password,

                createdAt:
                    new Date().toISOString()

            };


            console.log(
                "New Retailer:",
                retailer
            );


            showRetailerMessage(
                message,
                "✅ Retailer તૈયાર થયો.<br>" +
                "Retailer ID: <strong>" +
                escapeAdminHtml(retailerId) +
                "</strong>",
                true
            );


            form.reset();

        }
    );

}


/* =====================================================
   RETAILER MESSAGE
===================================================== */

function showRetailerMessage(
    element,
    message,
    success
) {

    if (!element) {
        return;
    }


    element.style.padding =
        "12px";


    element.style.borderRadius =
        "10px";


    if (success) {

        element.style.background =
            "#e8f5e9";

        element.style.color =
            "#2e7d32";

        element.style.border =
            "1px solid #c8e6c9";

    } else {

        element.style.background =
            "#ffebee";

        element.style.color =
            "#c62828";

        element.style.border =
            "1px solid #ffcdd2";

    }


    element.innerHTML =
        message;

}


/* =====================================================
   DEMO STATISTICS
===================================================== */

function loadDemoStatistics() {

    setNumber(
        "totalApplications",
        0
    );


    setNumber(
        "pendingApplications",
        0
    );


    setNumber(
        "paidApplications",
        0
    );


    setNumber(
        "processingApplications",
        0
    );


    setNumber(
        "completedApplications",
        0
    );

}


/* =====================================================
   SET NUMBER
===================================================== */

function setNumber(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (element) {

        element.textContent =
            value;

    }

}


/* =====================================================
   APPLICATION SEARCH
===================================================== */

function searchApplications() {

    const search =
        document
        .getElementById(
            "applicationSearch"
        )
        .value
        .trim();


    const status =
        document
        .getElementById(
            "applicationStatusFilter"
        )
        .value;


    console.log(
        "Application Search:",
        search,
        status
    );


    /*
     * Google Sheet connection પછી:
     *
     * Search → Code.gs
     * Code.gs → Applications Sheet
     * Result → Table
     *
     * અહીં actual data આવશે.
     */


    const table =
        document.getElementById(
            "applicationsTableBody"
        );


    if (!table) {
        return;
    }


    table.innerHTML = `

        <tr>

            <td colspan="8"
                style="
                text-align:center;
                padding:30px;
                color:#777;
                ">

                🔎 Search result
                Google Sheet connection
                પછી અહીં દેખાશે.

            </td>

        </tr>

    `;

}


/* =====================================================
   PAYMENT STATUS UPDATE
===================================================== */

function updatePaymentStatus() {

    const applicationId =
        document
        .getElementById(
            "paymentApplicationId"
        )
        .value
        .trim();


    const status =
        document
        .getElementById(
            "paymentStatusSelect"
        )
        .value;


    const message =
        document.getElementById(
            "paymentMessage"
        );


    if (applicationId === "") {

        showPaymentMessage(
            message,
            "⚠️ Application ID નાખો.",
            false
        );

        return;

    }


    if (status === "") {

        showPaymentMessage(
            message,
            "⚠️ Payment Status પસંદ કરો.",
            false
        );

        return;

    }


    /*
     * પછી Code.gs દ્વારા
     * Google Sheetમાં update થશે.
     */


    console.log(
        "Payment Update:",
        applicationId,
        status
    );


    showPaymentMessage(
        message,
        "✅ Payment Status update request તૈયાર છે.<br>" +
        "Google Sheet connection પછી actual status update થશે.",
        true
    );

}


/* =====================================================
   PAYMENT MESSAGE
===================================================== */

function showPaymentMessage(
    element,
    message,
    success
) {

    if (!element) {
        return;
    }


    element.style.display =
        "block";


    element.style.padding =
        "12px";


    element.style.borderRadius =
        "10px";


    if (success) {

        element.style.background =
            "#e8f5e9";

        element.style.color =
            "#2e7d32";

    } else {

        element.style.background =
            "#ffebee";

        element.style.color =
            "#c62828";

    }


    element.innerHTML =
        message;

}


/* =====================================================
   HTML SECURITY
===================================================== */

function escapeAdminHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   CONSOLE
===================================================== */

console.log(
    "RAJKUMAR RATIONCARD SERVICES Admin loaded."
);