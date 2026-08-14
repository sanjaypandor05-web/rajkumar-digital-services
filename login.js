/* =====================================================
   RAJKUMAR WEBSITE
   LOGIN SYSTEM
===================================================== */


/* =====================================================
   GOOGLE APPS SCRIPT URL
===================================================== */

const SPREADSHEET_ID = "1tnwWh_FFUiaF9__2FDbu_87NG0LjaQ26BOJx4sjOvc1";

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

/* =====================================================
   OPEN LOGIN
===================================================== */

function openLogin(type) {

  const box =
    document.getElementById(
      "loginFormBox"
    );

  const loginType =
    document.getElementById(
      "loginType"
    );

  const title =
    document.getElementById(
      "loginFormTitle"
    );

  const subtitle =
    document.getElementById(
      "loginFormSubtitle"
    );

  const icon =
    document.getElementById(
      "selectedLoginIcon"
    );

  const username =
    document.getElementById(
      "username"
    );


  loginType.value =
    type;


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


  box.classList.add(
    "active"
  );


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
    document.getElementById(
      "loginFormBox"
    );


  box.classList.remove(
    "active"
  );


  document
    .getElementById(
      "loginForm"
    )
    .reset();


  clearMessage();

}


/* =====================================================
   PASSWORD SHOW / HIDE
===================================================== */

function togglePassword() {

  const password =
    document.getElementById(
      "password"
    );

  const button =
    document.querySelector(
      ".show-password"
    );


  if (
    password.type === "password"
  ) {

    password.type =
      "text";

    button.textContent =
      "🙈";

  }

  else {

    password.type =
      "password";

    button.textContent =
      "👁";

  }

}


/* =====================================================
   HANDLE LOGIN
===================================================== */

async function handleLogin(event) {

  event.preventDefault();


  const type =
    document.getElementById(
      "loginType"
    ).value;


  const username =
    document.getElementById(
      "username"
    ).value.trim();


  const password =
    document.getElementById(
      "password"
    ).value;


  const button =
    document.getElementById(
      "submitLoginBtn"
    );


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


  /* ================= LOADING ================= */

  button.disabled =
    true;

  button.textContent =
    "LOGIN...";


  showMessage(
    "Checking login...",
    "loading"
  );


  try {

    const action =
      type === "retailer"
        ? "retailerLogin"
        : "adminLogin";


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
              action,

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
      "LOGIN RESPONSE:",
      result
    );


    /* ================= SUCCESS ================= */

    if (
      result.success
    ) {

      showMessage(
        "Login successful. Redirecting...",
        "success"
      );


      /* ================= RETAILER ================= */

      if (
        type === "retailer"
      ) {

        localStorage.setItem(
          "rajkumarRole",
          "retailer"
        );


        localStorage.setItem(
          "rajkumarRetailerId",
          result.retailerId
        );


        localStorage.setItem(
          "rajkumarRetailerName",
          result.retailerName
        );


        localStorage.setItem(
          "rajkumarRetailerMobile",
          result.mobile || ""
        );


        setTimeout(function() {

          window.location.href =
            "retailer-dashboard.html";

        }, 700);


        return;

      }


      /* ================= ADMIN ================= */

      if (
        type === "admin"
      ) {

        localStorage.setItem(
          "rajkumarRole",
          "admin"
        );


        localStorage.setItem(
          "rajkumarAdminId",
          result.adminId
        );


        localStorage.setItem(
          "rajkumarAdminName",
          result.adminName
        );


        setTimeout(function() {

          window.location.href =
            "admin-dashboard.html";

        }, 700);


        return;

      }

    }


    /* ================= FAILED ================= */

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

      "Server connection failed. Please check Apps Script Web App URL.",

      "error"

    );

  }


  finally {

    button.disabled =
      false;

    button.textContent =
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

  const box =
    document.getElementById(
      "loginMessage"
    );


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
    document.getElementById(
      "loginMessage"
    );


  box.textContent =
    "";

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
