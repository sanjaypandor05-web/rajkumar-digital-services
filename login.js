/* =====================================================
   RAJKUMAR LOGIN SYSTEM
===================================================== */

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbxcvT9nvNFEnK6dYVoUakpVOQ_9RW2zFnfPmwp0rgcY7e69vKYiRTerE-NcUwuJV7yQjQ/exec";


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
   RETAILER BUTTON
===================================================== */

document
    .getElementById("retailerLoginBtn")
    .addEventListener("click", function () {

        openLogin("retailer");

    });


/* =====================================================
   ADMIN BUTTON
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


    if (type === "admin") {

        selectedLoginIcon.textContent = "👑";

        loginFormTitle.textContent =
            "ADMIN LOGIN";

        loginFormSubtitle.textContent =
            "Enter Admin Username and Password";

        username.placeholder =
            "Enter Admin Username";

    }


    if (type === "retailer") {

        selectedLoginIcon.textContent = "👤";

        loginFormTitle.textContent =
            "RETAILER LOGIN";

        loginFormSubtitle.textContent =
            "Enter Retailer ID / Username and Password";

        username.placeholder =
            "Enter Retailer ID / Username";

    }


    loginFormBox.classList.add("active");

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

        loginFormBox.classList.remove("active");

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

        if (password.type === "password") {

            password.type = "text";

            this.textContent = "🙈";

        } else {

            password.type = "password";

            this.textContent = "👁";

        }

    });


/* =====================================================
   LOGIN
===================================================== */

document
    .getElementById("loginForm")
    .addEventListener("submit", handleLogin);


async function handleLogin(event) {

    event.preventDefault();


    const type =
        loginType.value;

    const user =
        username.value.trim();

    const pass =
        password.value;


    if (!type) {

        showMessage(
            "Please select Admin or Retailer Login.",
            "error"
        );

        return;
    }


    if (!user) {

        showMessage(
            "Please enter username.",
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


    submitLoginBtn.disabled = true;

    submitLoginBtn.textContent = "LOGIN...";


    showMessage(
        "Checking login...",
        "loading"
    );


    try {

        const action =
            type === "admin"
                ? "adminLogin"
                : "retailerLogin";


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

                        action: action,

                        username: user,

                        password: pass

                    })

                }
            );


        const result =
            await response.json();


        console.log(
            "LOGIN RESULT:",
            result
        );


        if (result.success) {

            showMessage(
                "Login successful. Please wait...",
                "success"
            );


            /* ================= ADMIN ================= */

            if (type === "admin") {

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
                    result.adminName || "Administrator"
                );


                setTimeout(function () {

                    window.location.href =
                        "admin-dashboard.html";

                }, 500);


                return;
            }


            /* ================= RETAILER ================= */

            if (type === "retailer") {

                localStorage.setItem(
                    "rajkumarRole",
                    "retailer"
                );

                localStorage.setItem(
                    "rajkumarRetailerId",
                    result.retailerId || ""
                );

                localStorage.setItem(
                    "rajkumarRetailerName",
                    result.retailerName || ""
                );

                localStorage.setItem(
                    "rajkumarRetailerMobile",
                    result.mobile || ""
                );


                setTimeout(function () {

                    window.location.href =
                        "retailer-dashboard.html";

                }, 500);


                return;
            }

        }


        showMessage(
            result.message ||
            "Invalid username or password.",
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

        submitLoginBtn.disabled = false;

        submitLoginBtn.textContent = "LOGIN";

    }

}


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(message, type) {

    loginMessage.textContent =
        message;

    loginMessage.className =
        "login-message " + type;

}


function clearMessage() {

    loginMessage.textContent = "";

    loginMessage.className =
        "login-message";

}


/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            loginFormBox.classList.remove(
                "active"
            );

        }

    }
);
