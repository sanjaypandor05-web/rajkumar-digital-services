/* =====================================================
   RAJKUMAR WEBSITE
   LOGIN SYSTEM
   NEW LOGIN BACKEND
===================================================== */


/* =====================================================
   GOOGLE APPS SCRIPT LOGIN URL
===================================================== */

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx58Oqv9XwQiT--JZ9mnJASOSGsl0yPI3qDWlRZgoS3APcNlCy593wzaKkVzD1ZOSsD6Q/exec";


/* =====================================================
   OPEN LOGIN
===================================================== */

function openLogin(type) {

  const box =
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


  if (!box || !loginType || !title || !subtitle || !icon || !username) {
    console.error("Login HTML elements not found.");
    return;
  }


  loginType.value = type;


  /* ================= RETAILER ================= */

  if (type === "retailer") {

    icon.textContent = "👤";

    title.textContent =
      "RETAILER LOGIN";

    subtitle.textContent =
      "Enter Retailer ID / Username and Password";

    username.placeholder =
      "Enter Retailer ID / Username";

  }


  /* ================= ADMIN ================= */

  if (type === "admin") {

    icon.textContent = "👑";

    title.textContent =
      "ADMIN LOGIN";

    subtitle.textContent =
      "Enter Admin Username and Password";

    username.placeholder =
      "Enter Admin Username";

  }


  box.classList.add("active");


  setTimeout(function() {

    username.focus();

  }, 200);


  clearMessage();

}


/* =====================================================
   CLOSE LOGIN
===================================================== */

function closeLogin() {

  const box =
    document.getElementById("loginFormBox");

  if (box) {

    box.classList.remove("active");

  }


  const form =
    document.getElementById("loginForm");

  if (form) {

    form.reset();

  }


  clearMessage();

}


/* =====================================================
   PASSWORD SHOW / HIDE
===================================================== */

function togglePassword() {

  const password =
    document.getElementById("password");

  const button =
    document.querySelector(".show-password");


  if (!password || !button) {
    return;
  }


  if (password.type === "password") {

    password.type = "text";

    button.textContent = "🙈";

  }

  else {

    password.type = "password";

    button.textContent = "👁";

  }

}


/* =====================================================
   HANDLE LOGIN
===================================================== */

async function handleLogin(event) {

  event.preventDefault();


  const type =
    document.getElementById("loginType").value;


  const username =
    document
      .getElementById("username")
      .value
      .trim();


  const password =
    document.getElementById("password").value;


  const button =
    document.getElementById("submitLoginBtn");


  /* ===================================================
     VALIDATION
  =================================================== */

  if (!type) {

    showMessage(
      "Please select login type.",
      "error"
    );

    return;

  }


  if (!username) {

    showMessage(
      "Please enter username.",
      "error"
    );

    return;

  }


  if (!password) {

    showMessage(
      "Please enter password.",
      "error"
    );

    return;

  }


  /* ===================================================
     LOADING
  =================================================== */

  button.disabled = true;

  button.textContent = "LOGIN...";


  showMessage(
    "Checking login...",
    "loading"
  );


  try {


    /* =================================================
       SELECT ACTION
    ================================================= */

    const action =
      type === "retailer"
        ? "retailerLogin"
        : "adminLogin";


    /* =================================================
       SEND REQUEST
    ================================================= */

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


    /* =================================================
       RESPONSE CHECK
    ================================================= */

    if (!response.ok) {

      throw new Error(
        "HTTP Error: " +
        response.status
      );

    }


    const result =
      await response.json();


    console.log(
      "LOGIN RESPONSE:",
      result
    );


    /* =================================================
       SUCCESS
    ================================================= */

    if (result.success === true) {

      showMessage(
        "Login successful. Redirecting...",
        "success"
      );


      /* ===============================================
         RETAILER
      =============================================== */

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


        localStorage.setItem(
          "rajkumarRetailerUsername",
          result.username || username
        );


        setTimeout(function() {

          window.location.href =
            "retailer-dashboard.html";

        }, 700);


        return;

      }


      /* ===============================================
         ADMIN
      =============================================== */

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


        setTimeout(function() {

          window.location.href =
            "admin-dashboard.html";

        }, 700);


        return;

      }

    }


    /* =================================================
       LOGIN FAILED
    ================================================= */

    showMessage(

      result.message ||
      "Invalid login details.",

      "error"

    );


  }

  catch (error) {

    console.error(
      "LOGIN ERROR:",
      error
    );


    showMessage(

      "Server connection failed. Please check Login Backend URL.",

      "error"

    );

  }


  finally {

    button.disabled = false;

    button.textContent = "LOGIN";

  }

}


/* =====================================================
   SHOW MESSAGE
===================================================== */

function showMessage(
  message,
  type
) {

  const box =
    document.getElementById("loginMessage");


  if (!box) {
    return;
  }


  box.textContent =
    message;


  box.className =
    "login-message " +
    type;

}


/* =====================================================
   CLEAR MESSAGE
===================================================== */

function clearMessage() {

  const box =
    document.getElementById("loginMessage");


  if (!box) {
    return;
  }


  box.textContent = "";

  box.className =
    "login-message";

}


/* =====================================================
   CLOSE WITH ESC
===================================================== */

document.addEventListener(
  "keydown",
  function(event) {

    if (
      event.key === "Escape"
    ) {

      closeLogin();

    }

  }
);


/* =====================================================
   PREVENT OLD LOGIN SESSION
===================================================== */

window.addEventListener(
  "pageshow",
  function() {

    const type =
      document.getElementById(
        "loginType"
      );


    if (type) {

      type.value = "";

    }

  }
);
