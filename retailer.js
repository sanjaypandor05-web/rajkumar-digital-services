/* =====================================================
   RAJKUMAR RATIONCARD SERVICES
   RETAILER.JS - FINAL VERSION
===================================================== */

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbzVyarGuWcFfauDBpPmD4d6xUak9MmINfcUGAbz1JrxA6s-n3nQOBUQszQxFQKsz25Iow/exec";


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    setupRetailerLogin();

    setupServiceAmount();

    setupApplicationForm();

    checkRetailerSession();

});


/* =====================================================
   RETAILER LOGIN
===================================================== */

function setupRetailerLogin() {

    const form =
        document.getElementById("retailerLoginForm");

    if (!form) return;

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        const username =
            document.getElementById("retailerId")?.value.trim();

        const password =
            document.getElementById("retailerPassword")?.value || "";

        if (!username || !password) {

            showLoginMessage(
                "⚠️ Retailer ID અને Password દાખલ કરો.",
                "error"
            );

            return;
        }

        const button =
            form.querySelector("button[type='submit']");

        if (button) {

            button.disabled = true;
            button.textContent = "LOGIN...";

        }

        showLoginMessage(
            "🔄 Login ચેક થઈ રહ્યું છે...",
            "loading"
        );

        try {

            const response = await fetch(
                SCRIPT_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body: JSON.stringify({

                        action: "retailerLogin",

                        username: username,

                        password: password

                    })
                }
            );

            if (!response.ok) {

                throw new Error(
                    "HTTP " + response.status
                );

            }

            const result =
                await response.json();

            console.log(
                "Retailer Login:",
                result
            );

            if (
                result &&
                result.success === true
            ) {

                const retailerId =
                    result.retailerId || username;

                const retailerName =
                    result.retailerName || "Retailer";

                const retailerMobile =
                    result.mobile || "";

                const retailerUsername =
                    result.username || username;


                /* =====================================
                   CLEAR OLD SESSION FIRST
                ===================================== */

                clearRetailerSession();


                /* =====================================
                   SAVE NEW SESSION
                ===================================== */

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

                localStorage.setItem(
                    "rajkumarRetailerUsername",
                    retailerUsername
                );


                /* Compatibility */

                localStorage.setItem(
                    "retailerId",
                    retailerId
                );

                localStorage.setItem(
                    "retailerName",
                    retailerName
                );

                localStorage.setItem(
                    "retailerMobile",
                    retailerMobile
                );

                localStorage.setItem(
                    "retailerUsername",
                    retailerUsername
                );


                /* Session */

                sessionStorage.setItem(
                    "retailerLoggedIn",
                    "true"
                );

                sessionStorage.setItem(
                    "retailerId",
                    retailerId
                );


                showLoginMessage(
                    "✅ Login Successful. Dashboard ખૂલી રહ્યું છે...",
                    "success"
                );


                setTimeout(function () {

                    window.location.replace(
                        "retailer.html"
                    );

                }, 500);

                return;

            }


            showLoginMessage(
                "❌ " +
                (
                    result?.message ||
                    "Invalid Retailer ID અથવા Password."
                ),
                "error"
            );

        }
        catch (error) {

            console.error(
                "Retailer Login Error:",
                error
            );

            showLoginMessage(
                "❌ Server connection failed. Apps Script URL ચેક કરો.",
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
   CHECK RETAILER SESSION
===================================================== */

function checkRetailerSession() {

    const loggedIn =
        sessionStorage.getItem(
            "retailerLoggedIn"
        );

    const retailerId =
        sessionStorage.getItem(
            "retailerId"
        );

    const role =
        localStorage.getItem(
            "rajkumarRole"
        );


    if (
        loggedIn === "true" &&
        retailerId &&
        role === "retailer"
    ) {

        showDashboard(
            retailerId
        );

    }
    else {

        showLogin();

    }

}


/* =====================================================
   SHOW DASHBOARD
===================================================== */

function showDashboard(retailerId) {

    const loginSection =
        document.getElementById(
            "loginSection"
        );

    const dashboardSection =
        document.getElementById(
            "dashboardSection"
        );


    if (loginSection) {

        loginSection.style.display =
            "none";

    }


    if (dashboardSection) {

        dashboardSection.style.display =
            "block";

    }


    const nameElement =
        document.getElementById(
            "loggedRetailerName"
        );


    if (nameElement) {

        nameElement.textContent =
            localStorage.getItem(
                "rajkumarRetailerName"
            ) ||
            retailerId ||
            "Retailer";

    }

}


/* =====================================================
   SHOW LOGIN
===================================================== */

function showLogin() {

    const loginSection =
        document.getElementById(
            "loginSection"
        );

    const dashboardSection =
        document.getElementById(
            "dashboardSection"
        );


    if (loginSection) {

        loginSection.style.display =
            "block";

    }


    if (dashboardSection) {

        dashboardSection.style.display =
            "none";

    }

}


/* =====================================================
   FINAL LOGOUT
===================================================== */

function retailerLogout() {

    console.log(
        "Retailer logout started..."
    );


    /* Clear ALL retailer session data */

    clearRetailerSession();


    /* Show login immediately */

    showLogin();


    /* Go to login page */

    setTimeout(function () {

        window.location.replace(
            "retailer.html"
        );

    }, 100);

}


/* =====================================================
   CLEAR RETAILER SESSION
===================================================== */

function clearRetailerSession() {

    /* SESSION STORAGE */

    sessionStorage.removeItem(
        "retailerLoggedIn"
    );

    sessionStorage.removeItem(
        "retailerId"
    );


    /* LOCAL STORAGE - MAIN */

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

    localStorage.removeItem(
        "rajkumarRetailerUsername"
    );


    /* LOCAL STORAGE - COMPATIBILITY */

    localStorage.removeItem(
        "retailerId"
    );

    localStorage.removeItem(
        "retailerName"
    );

    localStorage.removeItem(
        "retailerMobile"
    );

    localStorage.removeItem(
        "retailerUsername"
    );


    console.log(
        "Retailer session cleared."
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


/* =====================================================
   SERVICE AMOUNT
===================================================== */

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

    const amountElement =
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
            option?.dataset?.amount || 0
        );


    if (amountElement) {

        amountElement.textContent =
            amount;

    }


    if (paymentAmount) {

        paymentAmount.textContent =
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

    if (!form) return;


    form.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();

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
                    option?.dataset?.amount || 0
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


/* =====================================================
   PREVENT BACK BUTTON AFTER LOGOUT
===================================================== */

window.addEventListener(
    "pageshow",
    function () {

        const loggedIn =
            sessionStorage.getItem(
                "retailerLoggedIn"
            );

        const retailerId =
            sessionStorage.getItem(
                "retailerId"
            );

        const role =
            localStorage.getItem(
                "rajkumarRole"
            );


        if (
            loggedIn !== "true" ||
            !retailerId ||
            role !== "retailer"
        ) {

            showLogin();

        }

    }
);
