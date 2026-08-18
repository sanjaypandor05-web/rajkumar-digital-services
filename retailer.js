/* =====================================================
   RAJKUMAR RATIONCARD SERVICES
   RETAILER LOGIN
   FINAL WORKING VERSION
===================================================== */

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbzVyarGuWcFfauDBpPmD4d6xUak9MmINfcUGAbz1JrxA6s-n3nQOBUQszQxFQKsz25Iow/exec";


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    setupRetailerLogin();

    disableBrowserAutocomplete();

});


/* =====================================================
   DISABLE AUTOFILL
===================================================== */

function disableBrowserAutocomplete() {

    const form =
        document.getElementById("retailerLoginForm");

    if (form) {
        form.setAttribute("autocomplete", "off");
    }

    const username =
        document.getElementById("retailerId");

    const password =
        document.getElementById("retailerPassword");

    if (username) {
        username.setAttribute("autocomplete", "off");
        username.setAttribute("autocapitalize", "none");
        username.setAttribute("spellcheck", "false");
    }

    if (password) {
        password.setAttribute("autocomplete", "new-password");
    }

}


/* =====================================================
   RETAILER LOGIN
===================================================== */

function setupRetailerLogin() {

    const loginForm =
        document.getElementById("retailerLoginForm");

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

            const button =
                document.getElementById(
                    "retailerLoginButton"
                );

            if (!retailerId || !password) {

                showLoginMessage(
                    "⚠️ Retailer ID અને Password દાખલ કરો.",
                    "error"
                );

                return;
            }

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
                   SUCCESS
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
                            ""
                        ).trim();

                    const mobile =
                        String(
                            result.mobile ||
                            ""
                        ).trim();

                    const username =
                        String(
                            result.username ||
                            retailerId
                        ).trim();


                    /* =================================
                       SESSION STORAGE
                    ================================= */

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
                        "retailerMobile",
                        mobile
                    );

                    sessionStorage.setItem(
                        "retailerUsername",
                        username
                    );


                    /* =================================
                       LOCAL STORAGE
                    ================================= */

                    localStorage.setItem(
                        "rajkumarRole",
                        "retailer"
                    );

                    localStorage.setItem(
                        "rajkumarRetailerId",
                        id
                    );

                    localStorage.setItem(
                        "rajkumarRetailerName",
                        name
                    );

                    localStorage.setItem(
                        "rajkumarRetailerMobile",
                        mobile
                    );

                    localStorage.setItem(
                        "rajkumarRetailerUsername",
                        username
                    );


                    /* =================================
                       OLD COMPATIBILITY KEYS
                    ================================= */

                    localStorage.setItem(
                        "retailerId",
                        id
                    );

                    localStorage.setItem(
                        "retailerName",
                        name
                    );

                    localStorage.setItem(
                        "retailerMobile",
                        mobile
                    );

                    localStorage.setItem(
                        "retailerUsername",
                        username
                    );


                    showLoginMessage(
                        "✅ Login Successful. Dashboard ખૂલી રહ્યું છે...",
                        "success"
                    );


                    setTimeout(
                        function () {

                            window.location.replace(
                                "retailer-dashboard.html"
                            );

                        },
                        500
                    );

                    return;
                }


                /* =====================================
                   LOGIN FAILED
                ===================================== */

                showLoginMessage(
                    result &&
                    result.message
                        ? "❌ " +
                          result.message
                        : "❌ Retailer ID અથવા Password ખોટો છે.",
                    "error"
                );

            }
            catch (error) {

                console.error(
                    "RETAILER LOGIN ERROR:",
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
