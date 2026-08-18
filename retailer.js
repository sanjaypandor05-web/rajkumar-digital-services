/* =====================================================
   RAJKUMAR RATIONCARD SERVICES
   FINAL RETAILER JAVASCRIPT
   LOGIN + PROTECTION + LOGOUT
===================================================== */

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbx_Jlr04g2fJl76vXnuq2-jS4P3PPrb-p3RkrE-YZ4MMeHgygQQSutjR05xvKTC9yhu/exec";


/* =====================================================
   START
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /*
     * FIRST: Hide dashboard immediately.
     * Then check valid session.
     */
    hideDashboard();

    protectRetailerPage();

    setupRetailerLogin();
    setupLogout();
    setupServiceAmount();
    setupApplicationForm();

});


/* =====================================================
   HIDE DASHBOARD
===================================================== */

function hideDashboard() {

    const loginSection =
        document.getElementById("loginSection");

    const dashboardSection =
        document.getElementById("dashboardSection");


    if (loginSection) {
        loginSection.style.display = "block";
    }

    if (dashboardSection) {
        dashboardSection.style.display = "none";
    }

}


/* =====================================================
   CHECK LOGIN SESSION
===================================================== */

function isRetailerLoggedIn() {

    const loggedIn =
        sessionStorage.getItem("retailerLoggedIn");

    const retailerId =
        sessionStorage.getItem("retailerId");


    return (
        loggedIn === "true" &&
        retailerId &&
        retailerId.trim() !== ""
    );

}


/* =====================================================
   PAGE PROTECTION
===================================================== */

function protectRetailerPage() {

    if (isRetailerLoggedIn()) {

        showDashboard();

    } else {

        forceLogin();

    }

}


/* =====================================================
   FORCE LOGIN
===================================================== */

function forceLogin() {

    hideDashboard();

    clearOldPermanentLogin();

}


/* =====================================================
   SHOW DASHBOARD
===================================================== */

function showDashboard() {

    if (!isRetailerLoggedIn()) {

        forceLogin();

        return;

    }


    const loginSection =
        document.getElementById("loginSection");

    const dashboardSection =
        document.getElementById("dashboardSection");


    if (loginSection) {

        loginSection.style.display = "none";

    }


    if (dashboardSection) {

        dashboardSection.style.display = "block";

    }


    const retailerName =
        sessionStorage.getItem("retailerName") ||
        "Retailer";


    const retailerId =
        sessionStorage.getItem("retailerId") ||
        "";


    const nameElement =
        document.getElementById("loggedRetailerName");


    if (nameElement) {

        nameElement.textContent =
            retailerName;

    }


    const idElement =
        document.getElementById("loggedRetailerId");


    if (idElement) {

        idElement.textContent =
            "Retailer ID: " + retailerId;

    }

}


/* =====================================================
   RETAILER LOGIN
===================================================== */

function setupRetailerLogin() {

    const form =
        document.getElementById("retailerLoginForm");


    if (!form) {
        return;
    }


    form.addEventListener("submit", async function (event) {

        event.preventDefault();


        const retailerId =
            document
                .getElementById("retailerId")
                .value
                .trim();


        const password =
            document
                .getElementById("retailerPassword")
                .value;


        if (!retailerId || !password) {

            showLoginMessage(
                "⚠️ Retailer ID અને Password દાખલ કરો.",
                "error"
            );

            return;

        }


        const button =
            document.getElementById(
                "retailerLoginButton"
            );


        if (button) {

            button.disabled = true;
            button.textContent = "LOGIN...";

        }


        showLoginMessage(
            "🔄 Login ચેક થઈ રહ્યું છે...",
            "loading"
        );


        try {

            const response =
                await fetch(
                    SCRIPT_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "text/plain;charset=utf-8"
                        },

                        body: JSON.stringify({

                            action:
                                "retailerLogin",

                            username:
                                retailerId,

                            password:
                                password

                        })
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "HTTP Error " +
                    response.status
                );

            }


            const result =
                await response.json();


            console.log(
                "RETAILER LOGIN RESULT:",
                result
            );


            /* =====================================
               LOGIN SUCCESS
            ===================================== */

            if (
                result &&
                result.success === true
            ) {

                const id =
                    String(
                        result.retailerId ||
                        retailerId
                    ).trim();


                const name =
                    String(
                        result.retailerName ||
                        id
                    ).trim();


                const username =
                    String(
                        result.username ||
                        retailerId
                    ).trim();


                /*
                 * Remove any old session
                 */

                sessionStorage.clear();


                /*
                 * Create fresh SESSION ONLY.
                 * No localStorage login.
                 */

                sessionStorage.setItem(
                    "retailerLoggedIn",
                    "true"
                );

                sessionStorage.setItem(
                    "retailerId",
                    id
                );

                sessionStorage.setItem(
                    "retailerName",
                    name
                );

                sessionStorage.setItem(
                    "retailerUsername",
                    username
                );


                /*
                 * Remove old localStorage login.
                 */

                clearOldPermanentLogin();


                showLoginMessage(
                    "✅ Login Successful.",
                    "success"
                );


                /*
                 * Open dashboard.
                 */

                setTimeout(function () {

                    showDashboard();

                }, 300);


                return;

            }


            /* =====================================
               LOGIN FAILED
            ===================================== */

            showLoginMessage(

                result &&
                result.message

                    ? "❌ " + result.message

                    : "❌ Invalid Retailer ID અથવા Password.",

                "error"

            );

        }
        catch (error) {

            console.error(
                "RETAILER LOGIN ERROR:",
                error
            );


            showLoginMessage(
                "❌ Server connection failed. Apps Script URL અથવા deployment ચેક કરો.",
                "error"
            );

        }
        finally {

            if (button) {

                button.disabled = false;
                button.textContent = "LOGIN";

            }

        }

    });

}


/* =====================================================
   LOGOUT SETUP
===================================================== */

function setupLogout() {

    const button =
        document.getElementById(
            "logoutButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            retailerLogout();

        }
    );

}


/* =====================================================
   FINAL LOGOUT
===================================================== */

function retailerLogout() {

    /*
     * Remove ALL session data.
     */

    sessionStorage.clear();


    /*
     * Remove old localStorage login.
     */

    clearOldPermanentLogin();


    /*
     * Immediately hide dashboard.
     */

    hideDashboard();


    /*
     * Clear form.
     */

    const loginForm =
        document.getElementById(
            "retailerLoginForm"
        );


    if (loginForm) {

        loginForm.reset();

    }


    /*
     * Show logout message.
     */

    showLoginMessage(
        "✅ Logout successful. ફરીથી Login કરો.",
        "success"
    );


    /*
     * Replace URL so Back does not restore
     * dashboard page.
     */

    setTimeout(function () {

        window.location.replace(
            "retailer.html?logout=" +
            Date.now()
        );

    }, 300);

}


/* =====================================================
   CLEAR OLD LOGIN DATA
===================================================== */

function clearOldPermanentLogin() {

    const keys = [

        "rajkumarRole",

        "rajkumarRetailerId",

        "rajkumarRetailerName",

        "rajkumarRetailerMobile",

        "rajkumarRetailerUsername",

        "retailerId",

        "retailerName",

        "retailerMobile",

        "retailerUsername",

        "retailerLoggedIn"

    ];


    keys.forEach(function (key) {

        try {

            localStorage.removeItem(key);

        }
        catch (error) {

            console.warn(
                "Storage cleanup error:",
                error
            );

        }

    });

}


/* =====================================================
   LOGIN MESSAGE
===================================================== */

function showLoginMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "loginMessage"
        );


    if (!element) {
        return;
    }


    element.style.display = "block";

    element.innerHTML = message;

    element.style.padding = "12px";

    element.style.marginTop = "15px";

    element.style.borderRadius = "10px";


    if (type === "success") {

        element.style.background =
            "#e8f5e9";

        element.style.color =
            "#2e7d32";

        element.style.border =
            "1px solid #c8e6c9";

    }
    else if (type === "loading") {

        element.style.background =
            "#e3f2fd";

        element.style.color =
            "#1565c0";

        element.style.border =
            "1px solid #bbdefb";

    }
    else {

        element.style.background =
            "#ffebee";

        element.style.color =
            "#c62828";

        element.style.border =
            "1px solid #ffcdd2";

    }

}


/* =====================================================
   SERVICE AMOUNT
===================================================== */

function setupServiceAmount() {

    const select =
        document.getElementById(
            "serviceSelect"
        );


    if (!select) {
        return;
    }


    select.addEventListener(
        "change",
        updateServiceAmount
    );


    updateServiceAmount();

}


/* =====================================================
   UPDATE SERVICE AMOUNT
===================================================== */

function updateServiceAmount() {

    const select =
        document.getElementById(
            "serviceSelect"
        );


    const amountElement =
        document.getElementById(
            "serviceAmount"
        );


    const paymentElement =
        document.getElementById(
            "paymentAmount"
        );


    if (!select) {
        return;
    }


    const option =
        select.options[
            select.selectedIndex
        ];


    let amount = 0;


    if (
        option &&
        option.dataset &&
        option.dataset.amount
    ) {

        amount =
            Number(
                option.dataset.amount
            );

    }


    if (amountElement) {

        amountElement.textContent =
            amount;

    }


    if (paymentElement) {

        paymentElement.textContent =
            amount;

    }

}


/* =====================================================
   APPLICATION FORM
===================================================== */

function setupApplicationForm() {

    const form =
        document.getElementById(
            "applicationForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /*
             * Login protection
             */

            if (!isRetailerLoggedIn()) {

                forceLogin();

                showLoginMessage(
                    "❌ પહેલા Retailer Login કરો.",
                    "error"
                );

                return;

            }


            const service =
                document.getElementById(
                    "serviceSelect"
                );


            const message =
                document.getElementById(
                    "applicationMessage"
                );


            if (
                !service ||
                !service.value
            ) {

                showApplicationMessage(
                    message,
                    "⚠️ પહેલા Service પસંદ કરો.",
                    "error"
                );

                return;

            }


            const option =
                service.options[
                    service.selectedIndex
                ];


            const amount =
                Number(
                    option.dataset.amount || 0
                );


            if (amount <= 0) {

                showApplicationMessage(
                    message,
                    "⚠️ Service amount મળ્યો નથી.",
                    "error"
                );

                return;

            }


            const applicationId =
                generateApplicationId();


            showApplicationMessage(
                message,
                "✅ Application ID: " +
                applicationId,
                "success"
            );

        }
    );

}


/* =====================================================
   APPLICATION ID
===================================================== */

function generateApplicationId() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            now.getDate()
        ).padStart(2, "0");


    const random =
        Math.floor(
            10000 +
            Math.random() * 90000
        );


    return (
        "RKS-" +
        year +
        month +
        day +
        "-" +
        random
    );

}


/* =====================================================
   APPLICATION MESSAGE
===================================================== */

function showApplicationMessage(
    element,
    message,
    type
) {

    if (!element) {
        return;
    }


    element.style.display =
        "block";


    element.innerHTML =
        message;


    element.style.padding =
        "12px";


    element.style.marginTop =
        "15px";


    element.style.borderRadius =
        "10px";


    if (type === "success") {

        element.style.background =
            "#e8f5e9";

        element.style.color =
            "#2e7d32";

        element.style.border =
            "1px solid #c8e6c9";

    }
    else {

        element.style.background =
            "#ffebee";

        element.style.color =
            "#c62828";

        element.style.border =
            "1px solid #ffcdd2";

    }

}


/* =====================================================
   BROWSER BACK/FORWARD PROTECTION
===================================================== */

window.addEventListener(
    "pageshow",
    function () {

        /*
         * Always check session again.
         */

        protectRetailerPage();

    }
);


/* =====================================================
   PAGE VISIBILITY PROTECTION
===================================================== */

document.addEventListener(
    "visibilitychange",
    function () {

        if (!document.hidden) {

            protectRetailerPage();

        }

    }
);


/* =====================================================
   BEFORE UNLOAD
===================================================== */

window.addEventListener(
    "beforeunload",
    function () {

        /*
         * Do NOT clear valid session here.
         * This allows refresh while logged in.
         */

    }
);
