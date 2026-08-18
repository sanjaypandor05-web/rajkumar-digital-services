/* =====================================================
   RAJKUMAR WEBSITE
   LOGIN SYSTEM
   ADMIN + RETAILER
===================================================== */

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbw5yfGMA2be2xYiGXltpyg5xmgF7qyveUenGJtlDttmIVym9Ndo_gYgAXmyarJ7WwBZLg/exec";


let selectedLoginType = "";


/* ================= OPEN LOGIN ================= */

function openLogin(type) {

    selectedLoginType = type;

    const loginBox =
        document.getElementById("loginFormBox");

    const loginType =
        document.getElementById("loginType");

    const title =
        document.getElementById("loginFormTitle");

    const subtitle =
        document.getElementById("loginFormSubtitle");

    const icon =
        document.getElementById("selectedLoginIcon");

    const username =
        document.getElementById("username");

    const message =
        document.getElementById("loginMessage");

    message.textContent = "";
    message.className = "login-message";

    loginType.value = type;

    if (type === "retailer") {

        icon.textContent = "👤";

        title.textContent = "RETAILER LOGIN";

        subtitle.textContent =
            "Enter your Retailer ID / Username and Password";

        username.placeholder =
            "Enter Retailer ID / Username";

    }

    else if (type === "admin") {

        icon.textContent = "👑";

        title.textContent = "ADMIN LOGIN";

        subtitle.textContent =
            "Enter your Admin Username and Password";

        username.placeholder =
            "Enter Admin Username";

    }

    loginBox.style.display = "block";

    loginBox.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    setTimeout(function () {
        username.focus();
    }, 300);
}


/* ================= CLOSE LOGIN ================= */

function closeLogin() {

    const loginBox =
        document.getElementById("loginFormBox");

    const form =
        document.getElementById("loginForm");

    const message =
        document.getElementById("loginMessage");

    loginBox.style.display = "none";

    form.reset();

    message.textContent = "";

    message.className = "login-message";

    selectedLoginType = "";
}


/* ================= PASSWORD SHOW/HIDE ================= */

function togglePassword() {

    const password =
        document.getElementById("password");

    const button =
        document.querySelector(".show-password");

    if (password.type === "password") {

        password.type = "text";

        button.textContent = "🙈";

    } else {

        password.type = "password";

        button.textContent = "👁";

    }
}


/* ================= LOGIN ================= */

async function handleLogin(event) {

    event.preventDefault();

    const username =
        document
            .getElementById("username")
            .value
            .trim();

    const password =
        document
            .getElementById("password")
            .value;

    const button =
        document.getElementById("submitLoginBtn");

    if (!selectedLoginType) {

        showMessage(
            "Please select Retailer or Admin Login.",
            "error"
        );

        return;
    }

    if (!username || !password) {

        showMessage(
            "Please enter Username and Password.",
            "error"
        );

        return;
    }

    button.disabled = true;

    button.textContent = "CHECKING...";

    showMessage(
        "Checking login...",
        "loading"
    );

    try {

        const action =
            selectedLoginType === "admin"
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

                        username: username,

                        password: password

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


        /* ================= SUCCESS ================= */

        if (
            result &&
            result.success === true
        ) {

            showMessage(
                "Login successful. Please wait...",
                "success"
            );


            /* ================= ADMIN ================= */

            if (
                selectedLoginType === "admin"
            ) {

                localStorage.setItem(
                    "rajkumarRole",
                    "admin"
                );

                localStorage.setItem(
                    "rajkumarAdminId",
                    result.adminId || "admin"
                );

                localStorage.setItem(
                    "rajkumarAdminName",
                    result.adminName ||
                    "Administrator"
                );


                setTimeout(function () {

                    window.location.href =
                        "admin.html";

                }, 500);


                return;
            }


            /* ================= RETAILER ================= */

            if (
                selectedLoginType === "retailer"
            ) {

                const retailerId =
                    result.retailerId || "";

                const retailerName =
                    result.retailerName || "";

                const retailerMobile =
                    result.retailerMobile ||
                    result.mobile ||
                    "";

                const retailerUsername =
                    result.username ||
                    username;


                /* NEW KEYS */

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


                /* COMPATIBILITY KEYS */

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
                    "Retailer Login:",
                    {
                        retailerId,
                        retailerName,
                        retailerMobile,
                        retailerUsername
                    }
                );


                setTimeout(function () {

                    window.location.href =
                        "retailer.html";

                }, 500);


                return;
            }

        }


        /* ================= FAILED ================= */

        showMessage(
            result && result.message
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
            "Server connection failed. Please check Apps Script deployment.",
            "error"
        );

    }

    finally {

        button.disabled = false;

        button.textContent = "LOGIN";

    }
}


/* ================= MESSAGE ================= */

function showMessage(
    text,
    type
) {

    const message =
        document.getElementById("loginMessage");

    message.textContent = text;

    message.className =
        "login-message " + type;
}


/* ================= ESC KEY ================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeLogin();

        }

    }
);
