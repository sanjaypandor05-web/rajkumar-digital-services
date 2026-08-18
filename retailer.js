/* =========================================================
   RAJKUMAR RATIONCARD SERVICES
   FINAL RETAILER JS
   LOGIN REQUIRED
========================================================= */

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbzVyarGuWcFfauDBpPmD4d6xUak9MmINfcUGAbz1JrxA6s-n3nQOBUQszQxFQKsz25Iow/exec";


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /*
     * FIRST CHECK LOGIN
     * Direct page open = LOGIN ONLY
     */
    enforceRetailerLogin();

    setupRetailerLogin();
    setupServiceAmount();
    setupApplicationForm();
    setupLogout();

});


/* =========================================================
   SECURITY GUARD
========================================================= */

function enforceRetailerLogin() {

    const loggedIn =
        sessionStorage.getItem("retailerLoggedIn");

    const retailerId =
        sessionStorage.getItem("retailerId");

    const loginSection =
        document.getElementById("loginSection");

    const dashboardSection =
        document.getElementById("dashboardSection");


    /*
     * NO VALID SESSION
     */

    if (
        loggedIn !== "true" ||
        !retailerId
    ) {

        /*
         * Always hide dashboard
         */

        if (dashboardSection) {
            dashboardSection.style.display = "none";
        }

        /*
         * Show login
         */

        if (loginSection) {
            loginSection.style.display = "block";
        }

        /*
         * Clear old retailer data
         */

        clearRetailerSession();

        return false;
    }


    /*
     * VALID SESSION
     */

    if (loginSection) {
        loginSection.style.display = "none";
    }

    if (dashboardSection) {
        dashboardSection.style.display = "block";
    }

    showRetailerInfo(retailerId);

    return true;
}


/* =========================================================
   CLEAR SESSION
========================================================= */

function clearRetailerSession() {

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
        "retailerMobile"
    );

}


/* =========================================================
   LOGIN
========================================================= */

function setupRetailerLogin() {

    const form =
        document.getElementById(
            "retailerLoginForm"
        );

    if (!form) return;


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const username =
                document.getElementById(
                    "retailerId"
                ).value.trim();


            const password =
                document.getElementById(
                    "retailerPassword"
                ).value;


            if (!username || !password) {

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

                button.textContent =
                    "LOGIN...";

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
                                        username,

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
                    "RETAILER LOGIN RESULT:",
                    result
                );


                if (
                    result &&
                    result.success === true
                ) {

                    const retailerId =
                        String(
                            result.retailerId ||
                            username
                        ).trim();


                    const retailerName =
                        result.retailerName ||
                        "Retailer";


                    const retailerMobile =
                        result.mobile ||
                        "";


                    /*
                     * SAVE ONLY AFTER
                     * SUCCESSFUL LOGIN
                     */

                    sessionStorage.setItem(
                        "retailerLoggedIn",
                        "true"
                    );

                    sessionStorage.setItem(
                        "retailerId",
                        retailerId
                    );

                    sessionStorage.setItem(
                        "retailerName",
                        retailerName
                    );

                    sessionStorage.setItem(
                        "retailerMobile",
                        retailerMobile
                    );


                    localStorage.setItem(
                        "rajkumarRole",
                        "retailer"
                    );

                    localStorage.setItem(
                        "rajkumarRetailerId",
                        retailerId
                    );

                    localStorage.setItem(
                        "rajkumarRetailerName",
                        retailerName
                    );

                    localStorage.setItem(
                        "rajkumarRetailerMobile",
                        retailerMobile
                    );


                    showLoginMessage(
                        "✅ Login Successful.",
                        "success"
                    );


                    /*
                     * OPEN DASHBOARD
                     * ON SAME PAGE
                     */

                    setTimeout(
                        function () {

                            enforceRetailerLogin();

                        },
                        300
                    );


                    return;
                }


                /*
                 * INVALID LOGIN
                 */

                clearRetailerSession();


                showLoginMessage(
                    "❌ " +
                    (
                        result &&
                        result.message
                            ? result.message
                            : "Invalid Retailer ID or Password."
                    ),
                    "error"
                );


            }
            catch (error) {

                console.error(
                    "RETAILER LOGIN ERROR:",
                    error
                );


                clearRetailerSession();


                showLoginMessage(
                    "❌ Server connection failed. Apps Script URL અથવા deployment ચેક કરો.",
                    "error"
                );

            }
            finally {

                if (button) {

                    button.disabled =
                        false;

                    button.textContent =
                        "LOGIN";

                }

            }

        }
    );

}


/* =========================================================
   LOGIN MESSAGE
========================================================= */

function showLoginMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "loginMessage"
        );


    if (!element) return;


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


/* =========================================================
   SHOW RETAILER INFO
========================================================= */

function showRetailerInfo(
    retailerId
) {

    const name =
        sessionStorage.getItem(
            "retailerName"
        ) ||
        "Retailer";


    const nameElement =
        document.getElementById(
            "loggedRetailerName"
        );


    if (nameElement) {

        nameElement.textContent =
            name;

    }


    const idElement =
        document.getElementById(
            "loggedRetailerId"
        );


    if (idElement) {

        idElement.textContent =
            "Retailer ID: " +
            retailerId;

    }

}


/* =========================================================
   LOGOUT
========================================================= */

function setupLogout() {

    const button =
        document.getElementById(
            "logoutButton"
        );


    if (!button) return;


    button.addEventListener(
        "click",
        retailerLogout
    );

}


function retailerLogout() {

    /*
     * CLEAR EVERYTHING
     */

    clearRetailerSession();


    localStorage.removeItem(
        "rajkumarRole"
    );

    localStorage.removeItem(
        "rajkumarRetailerId"
    );

    localStorage.removeItem(
        "rajkumarRetailerName"
    );

    localStorage.removeItem(
        "rajkumarRetailerMobile"
    );


    /*
     * FORCE LOGIN PAGE
     */

    window.location.replace(
        "retailer.html"
    );

}


/* =========================================================
   SERVICE AMOUNT
========================================================= */

function setupServiceAmount() {

    const select =
        document.getElementById(
            "serviceSelect"
        );


    if (!select) return;


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


    const serviceAmount =
        document.getElementById(
            "serviceAmount"
        );


    const paymentAmount =
        document.getElementById(
            "paymentAmount"
        );


    if (!select) return;


    const option =
        select.options[
            select.selectedIndex
        ];


    const amount =
        Number(
            option &&
            option.dataset.amount
                ? option.dataset.amount
                : 0
        );


    if (serviceAmount) {

        serviceAmount.textContent =
            amount;

    }


    if (paymentAmount) {

        paymentAmount.textContent =
            amount;

    }

}


/* =========================================================
   APPLICATION FORM
========================================================= */

function setupApplicationForm() {

    const form =
        document.getElementById(
            "applicationForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /*
             * LOGIN CHECK
             */

            if (!enforceRetailerLogin()) {

                showApplicationMessage(
                    "❌ Please login first.",
                    "error"
                );

                return;

            }


            const service =
                document.getElementById(
                    "serviceSelect"
                );


            if (
                !service ||
                !service.value
            ) {

                showApplicationMessage(
                    "⚠️ પહેલા Service પસંદ કરો.",
                    "error"
                );

                return;

            }


            if (!form.checkValidity()) {

                form.reportValidity();

                return;

            }


            showApplicationMessage(
                "ℹ️ Application form ready છે.",
                "success"
            );

        }
    );

}


/* =========================================================
   APPLICATION MESSAGE
========================================================= */

function showApplicationMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "applicationMessage"
        );


    if (!element) return;


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


/* =========================================================
   BROWSER BACK / PAGE SHOW PROTECTION
========================================================= */

window.addEventListener(
    "pageshow",
    function () {

        enforceRetailerLogin();

    }
);


/* =========================================================
   TAB VISIBILITY PROTECTION
========================================================= */

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            !document.hidden
        ) {

            enforceRetailerLogin();

        }

    }
);
