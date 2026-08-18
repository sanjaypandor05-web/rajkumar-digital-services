/* =====================================================
   RAJKUMAR RATIONCARD SERVICES
   RETAILER.JS - FINAL LOGIN PROTECTION
===================================================== */

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbzVyarGuWcFfauDBpPmD4d6xUak9MmINfcUGAbz1JrxA6s-n3nQOBUQszQxFQKsz25Iow/exec";


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* FIRST: protect page */
    checkRetailerSession();

    setupRetailerLogin();
    setupServiceAmount();
    setupApplicationForm();

});


/* =====================================================
   SESSION CHECK
===================================================== */

function checkRetailerSession() {

    const loggedIn =
        sessionStorage.getItem("retailerLoggedIn");

    const retailerId =
        sessionStorage.getItem("retailerId");

    const retailerName =
        sessionStorage.getItem("retailerName");

    if (
        loggedIn === "true" &&
        retailerId
    ) {

        showDashboard(
            retailerId,
            retailerName || retailerId
        );

    } else {

        showLogin();

        /* Clear old localStorage login */
        clearOldRetailerStorage();

    }

}


/* =====================================================
   SHOW LOGIN
===================================================== */

function showLogin() {

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
   SHOW DASHBOARD
===================================================== */

function showDashboard(
    retailerId,
    retailerName
) {

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

    const nameElement =
        document.getElementById(
            "loggedRetailerName"
        );

    if (nameElement) {

        nameElement.textContent =
            retailerName || retailerId;

    }

}


/* =====================================================
   LOGIN
===================================================== */

function setupRetailerLogin() {

    const loginForm =
        document.getElementById(
            "retailerLoginForm"
        );

    if (!loginForm) {
        return;
    }

    loginForm.addEventListener(
        "submit",
        async function (event) {

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

            if (
                !retailerId ||
                !password
            ) {

                showLoginMessage(
                    "⚠️ Retailer ID અને Password દાખલ કરો.",
                    "error"
                );

                return;
            }

            const button =
                loginForm.querySelector(
                    "button[type='submit']"
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

                            body:
                                JSON.stringify({

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
                        "HTTP " +
                        response.status
                    );

                }

                const result =
                    await response.json();

                console.log(
                    "RETAILER LOGIN:",
                    result
                );


                if (
                    result &&
                    result.success === true
                ) {

                    const id =
                        result.retailerId ||
                        retailerId;

                    const name =
                        result.retailerName ||
                        id;


                    /* =================================
                       IMPORTANT:
                       ONLY SESSION STORAGE
                    ================================= */

                    sessionStorage.clear();

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
                        result.username ||
                        retailerId
                    );


                    /* Remove old permanent login */
                    clearOldRetailerStorage();


                    showLoginMessage(
                        "✅ Login Successful. Dashboard ખૂલી રહ્યું છે...",
                        "success"
                    );


                    setTimeout(
                        function () {

                            window.location.replace(
                                "retailer.html"
                            );

                        },
                        500
                    );

                    return;

                }


                showLoginMessage(
                    result &&
                    result.message
                        ? "❌ " +
                          result.message
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

        }
    );

}


/* =====================================================
   LOGOUT - FINAL
===================================================== */

function retailerLogout() {

    /* Remove ALL retailer session data */

    sessionStorage.removeItem(
        "retailerLoggedIn"
    );

    sessionStorage.removeItem(
        "retailerId"
    );

    sessionStorage.removeItem(
        "retailerName"
    );

    sessionStorage.removeItem(
        "retailerUsername"
    );

    sessionStorage.removeItem(
        "retailerMobile"
    );

    sessionStorage.clear();


    /* Remove old localStorage data */

    clearOldRetailerStorage();


    /* Prevent browser from restoring page */

    window.location.replace(
        "retailer.html"
    );

}


/* =====================================================
   CLEAR OLD LOCAL STORAGE
===================================================== */

function clearOldRetailerStorage() {

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

    keys.forEach(
        function (key) {

            localStorage.removeItem(key);

        }
    );

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


function updateServiceAmount() {

    const select =
        document.getElementById(
            "serviceSelect"
        );

    const amount =
        document.getElementById(
            "serviceAmount"
        );

    const paymentAmount =
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

    const servicePrice =
        Number(
            option &&
            option.dataset.amount
                ? option.dataset.amount
                : 0
        );


    if (amount) {

        amount.textContent =
            servicePrice;

    }

    if (paymentAmount) {

        paymentAmount.textContent =
            servicePrice;

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


            /* Login protection again */

            if (
                sessionStorage.getItem(
                    "retailerLoggedIn"
                ) !== "true"
            ) {

                window.location.replace(
                    "retailer.html"
                );

                return;

            }


            const select =
                document.getElementById(
                    "serviceSelect"
                );

            const message =
                document.getElementById(
                    "applicationMessage"
                );


            if (
                !select ||
                !select.value
            ) {

                showApplicationMessage(
                    message,
                    "⚠️ પહેલા Service પસંદ કરો.",
                    "error"
                );

                return;

            }


            const option =
                select.options[
                    select.selectedIndex
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
                "Application ID: " +
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

        checkRetailerSession();

    }
);


/* =====================================================
   TAB VISIBILITY PROTECTION
===================================================== */

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            !document.hidden
        ) {

            checkRetailerSession();

        }

    }
);
