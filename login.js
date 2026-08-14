/* =====================================================
   RAJKUMAR LOGIN SYSTEM
   ADMIN + RETAILER LOGIN
===================================================== */


/* =====================================================
   GOOGLE APPS SCRIPT URL
   ADMIN LOGIN ALREADY WORKING - DO NOT CHANGE
===================================================== */
const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbw1mKC92_EjWJS_x2o8LMqiL9sssMbFh089IhMujZLd6_9VuujoVckjoMS8fbajVn-uQQ/exec";
/* =====================================================
   ELEMENTS
===================================================== */

const loginFormBox =
    document.getElementById("loginFormBox");

const loginType =
    document.getElementById("loginType");

const loginFormTitle =
    document.getElementById("loginFormTitle");

const loginFormSubtitle =
    document.getElementById("loginFormSubtitle");

const selectedLoginIcon =
    document.getElementById("selectedLoginIcon");

const username =
    document.getElementById("username");

const password =
    document.getElementById("password");

const loginMessage =
    document.getElementById("loginMessage");

const submitLoginBtn =
    document.getElementById("submitLoginBtn");


/* =====================================================
   RETAILER LOGIN BUTTON
===================================================== */

document
    .getElementById("retailerLoginBtn")
    .addEventListener("click", function () {

        openLogin("retailer");

    });


/* =====================================================
   ADMIN LOGIN BUTTON
===================================================== */

document
    .getElementById("adminLoginBtn")
    .addEventListener("click", function () {

        openLogin("admin");

    });


/* =====================================================
   OPEN LOGIN
===================================================== */

function openLogin(type) {

    loginType.value = type;

    clearMessage();

    password.value = "";

    username.value = "";


    /* ================= ADMIN ================= */

    if (type === "admin") {

        selectedLoginIcon.textContent =
            "👑";

        loginFormTitle.textContent =
            "ADMIN LOGIN";

        loginFormSubtitle.textContent =
            "Enter Admin Username and Password";

        username.placeholder =
            "Enter Admin Username";

    }


    /* ================= RETAILER ================= */

    if (type === "retailer") {

        selectedLoginIcon.textContent =
            "👤";

        loginFormTitle.textContent =
            "RETAILER LOGIN";

        loginFormSubtitle.textContent =
            "Enter Retailer ID / Username and Password";

        username.placeholder =
            "Enter Retailer ID / Username";

    }


    loginFormBox.classList.add(
        "active"
    );


    setTimeout(function () {

        username.focus();

    }, 200);

}


/* =====================================================
   CLOSE LOGIN
===================================================== */

document
    .getElementById("closeLoginBtn")
    .addEventListener("click", function () {

        loginFormBox.classList.remove(
            "active"
        );

        document
            .getElementById("loginForm")
            .reset();

        loginType.value = "";

        clearMessage();

    });


/* =====================================================
   PASSWORD SHOW / HIDE
===================================================== */

document
    .getElementById("showPasswordBtn")
    .addEventListener("click", function () {

        if (
            password.type === "password"
        ) {

            password.type = "text";

            this.textContent =
                "🙈";

        }
        else {

            password.type =
                "password";

            this.textContent =
                "👁";

        }

    });


/* =====================================================
   LOGIN FORM
===================================================== */

document
    .getElementById("loginForm")
    .addEventListener(
        "submit",
        handleLogin
    );


/* =====================================================
   HANDLE LOGIN
===================================================== */

async function handleLogin(event) {

    event.preventDefault();


    const type =
        loginType.value;


    const user =
        username.value.trim();


    const pass =
        password.value;


    /* ================= VALIDATION ================= */

    if (!type) {

        showMessage(
            "Please select Admin or Retailer Login.",
            "error"
        );

        return;

    }


    if (!user) {

        showMessage(
            "Please enter username / Retailer ID.",
            "error"
        );

        return;

    }


    if (!pass) {

        showMessage(
            "Please enter password.",
            "error"
        );

        return;

    }


    submitLoginBtn.disabled =
        true;


    submitLoginBtn.textContent =
        "LOGIN...";


    showMessage(
        "Checking login...",
        "loading"
    );


    try {

        /* ================= ACTION ================= */

        const action =
            type === "admin"
                ? "adminLogin"
                : "retailerLogin";


        /* ================= API ================= */

        const response =
            await fetch(
                SCRIPT_URL,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify({

                            action:
                                action,

                            username:
                                user,

                            password:
                                pass

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
            "LOGIN RESULT:",
            result
        );


        /* =================================================
           LOGIN SUCCESS
        ================================================= */

        if (
            result &&
            result.success === true
        ) {

            showMessage(
                "Login successful. Please wait...",
                "success"
            );


            /* =============================================
               ADMIN
            ============================================= */

            if (
                type === "admin"
            ) {

                localStorage.setItem(
                    "rajkumarRole",
                    "admin"
                );


                localStorage.setItem(
                    "rajkumarAdminId",
                    result.adminId || ""
                );


                localStorage.setItem(
                    "rajkumarAdminName",
                    result.adminName ||
                    "Administrator"
                );


                setTimeout(
                    function () {

                        window.location.href =
                            "admin-dashboard.html";

                    },
                    500
                );


                return;

            }


            /* =============================================
               RETAILER
            ============================================= */

            if (
                type === "retailer"
            ) {

                const retailerId =
                    result.retailerId || "";


                const retailerName =
                    result.retailerName || "";


                const retailerMobile =
                    result.mobile || "";


                const retailerUsername =
                    result.username ||
                    user;


                /* =========================================
                   NEW STANDARD KEYS
                ========================================= */

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


                /* =========================================
                   COMPATIBILITY KEYS
                   retailer-dashboard.js માટે
                ========================================= */

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


                console.log(
                    "Retailer Login Saved:",
                    {
                        retailerId:
                            retailerId,

                        retailerName:
                            retailerName,

                        retailerMobile:
                            retailerMobile,

                        retailerUsername:
                            retailerUsername
                    }
                );


                setTimeout(
                    function () {

                        window.location.href =
                            "retailer-dashboard.html";

                    },
                    500
                );


                return;

            }

        }


        /* =================================================
           LOGIN FAILED
        ================================================= */

        showMessage(
            result &&
            result.message
                ? result.message
                : "Invalid username or password.",
            "error"
        );

    }
    catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        showMessage(
            "Server connection failed. Please check Apps Script URL.",
            "error"
        );

    }
    finally {

        submitLoginBtn.disabled =
            false;

        submitLoginBtn.textContent =
            "LOGIN";

    }

}


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(
    message,
    type
) {

    loginMessage.textContent =
        message;


    loginMessage.className =
        "login-message " +
        type;

}


/* =====================================================
   CLEAR MESSAGE
===================================================== */

function clearMessage() {

    loginMessage.textContent =
        "";


    loginMessage.className =
        "login-message";

}


/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            loginFormBox.classList.remove(
                "active"
            );

        }

    }
);
