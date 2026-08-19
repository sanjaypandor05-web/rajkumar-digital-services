/************************************************************
 * RAJKUMAR RATIONCARD SERVICES
 * RETAILER LOGIN
 *
 * IMPORTANT
 * ----------------------------------------------------------
 * Retailer Create is NOT available here.
 * Retailer accounts are created only from Admin Panel.
 ************************************************************/


// ==========================================================
// GOOGLE APPS SCRIPT API URL
// ==========================================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbzleZG-w2WQ6DClkEcqpRcn6Pv8gil3ym-aP4_9ctLUlzeiHG34MyDQgdV6JMK1r4zLnA/exec";


// ==========================================================
// PAGE ELEMENTS
// ==========================================================

const loginForm =
  document.getElementById("retailerLoginForm");

const usernameInput =
  document.getElementById("username");

const passwordInput =
  document.getElementById("password");

const loginBtn =
  document.getElementById("loginBtn");

const messageBox =
  document.getElementById("message");

const togglePassword =
  document.getElementById("togglePassword");


// ==========================================================
// SHOW MESSAGE
// ==========================================================

function showMessage(message, type = "error") {

  if (!messageBox) {
    alert(message);
    return;
  }

  messageBox.textContent = message;

  messageBox.className =
    "message " + type;

}


// ==========================================================
// CLEAR MESSAGE
// ==========================================================

function clearMessage() {

  if (!messageBox) {
    return;
  }

  messageBox.textContent = "";

  messageBox.className =
    "message";

}


// ==========================================================
// PASSWORD SHOW / HIDE
// ==========================================================

if (togglePassword) {

  togglePassword.addEventListener(
    "click",
    function () {

      if (
        passwordInput.type === "password"
      ) {

        passwordInput.type =
          "text";

        togglePassword.textContent =
          "🙈";

      } else {

        passwordInput.type =
          "password";

        togglePassword.textContent =
          "👁";

      }

    }
  );

}


// ==========================================================
// LOGIN
// ==========================================================

if (loginForm) {

  loginForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();

      clearMessage();


      const username =
        usernameInput.value.trim();

      const password =
        passwordInput.value;


      if (!username) {

        showMessage(
          "Please enter Retailer ID or Username."
        );

        usernameInput.focus();

        return;

      }


      if (!password) {

        showMessage(
          "Please enter your password."
        );

        passwordInput.focus();

        return;

      }


      if (
        !API_URL ||
        API_URL.includes(
          "YOUR_GOOGLE_APPS_SCRIPT"
        )
      ) {

        showMessage(
          "Google Apps Script API URL is not configured."
        );

        return;

      }


      loginBtn.disabled =
        true;

      loginBtn.textContent =
        "LOGINNING...";


      try {

        const response =
          await fetch(
            API_URL,
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
                    "retailerLogin",

                  username:
                    username,

                  password:
                    password

                })

            }
          );


        const result =
          await response.json();


        console.log(
          "Retailer Login Response:",
          result
        );


        if (
          result &&
          result.success === true
        ) {

          // ------------------------------------------------
          // SAVE RETAILER LOGIN SESSION
          // ------------------------------------------------

          const retailerData = {

            role:
              "retailer",

            retailerId:
              result.retailerId || "",

            retailerName:
              result.retailerName || "",

            mobile:
              result.mobile || "",

            email:
              result.email || "",

            username:
              result.username || username,

            status:
              result.status || "Active",

            loginTime:
              new Date().toISOString()

          };


          localStorage.setItem(
            "retailerSession",
            JSON.stringify(
              retailerData
            )
          );


          localStorage.setItem(
            "retailerId",
            result.retailerId || ""
          );


          localStorage.setItem(
            "retailerName",
            result.retailerName || ""
          );


          localStorage.setItem(
            "retailerUsername",
            result.username || username
          );


          showMessage(
            "Retailer Login Successful. Redirecting...",
            "success"
          );


          // ------------------------------------------------
          // REDIRECT
          // ------------------------------------------------

          setTimeout(
            function () {

              window.location.href =
                "retailer-dashboard.html";

            },
            700
          );


          return;

        }


        showMessage(
          result && result.message
            ? result.message
            : "Invalid Retailer ID / Username or Password."
        );


      } catch (error) {

        console.error(
          "Retailer Login Error:",
          error
        );


        showMessage(
          "Login failed. Please check your internet connection and API URL."
        );


      } finally {

        loginBtn.disabled =
          false;

        loginBtn.textContent =
          "LOGIN";

      }

    }
  );

}


// ==========================================================
// ENTER KEY SUPPORT
// ==========================================================

if (passwordInput) {

  passwordInput.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Enter"
      ) {

        if (loginForm) {

          loginForm.requestSubmit();

        }

      }

    }
  );

}


// ==========================================================
// PREVENT BROWSER AUTO LOGIN
// ==========================================================

window.addEventListener(
  "load",
  function () {

    try {

      usernameInput.value = "";
      passwordInput.value = "";

    } catch (error) {

    }

  }
);
