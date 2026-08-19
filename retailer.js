/************************************************************
 * RAJKUMAR RATIONCARD SERVICES
 * RETAILER CREATE - FINAL JS
 *
 * Works with Code.gs:
 * createRetailer
 * sendRetailerEmail
 ************************************************************/


// ==========================================================
// GOOGLE APPS SCRIPT WEB APP URL
// ==========================================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbzAQQPhHzepS9LyOASh1KpyFaXh9QPzbP7qV7bO-1urDyeKFpcnEEWhAL7MjnsW9BSaxA/exec";


// ==========================================================
// ELEMENTS
// ==========================================================

const form =
  document.getElementById("retailerForm");

const retailerNameInput =
  document.getElementById("retailerName");

const mobileInput =
  document.getElementById("mobile");

const emailInput =
  document.getElementById("email");

const usernameInput =
  document.getElementById("username");

const passwordInput =
  document.getElementById("password");

const emailError =
  document.getElementById("emailError");

const createBtn =
  document.getElementById("createBtn");

const messageBox =
  document.getElementById("message");


// ==========================================================
// CLEAN
// ==========================================================

function clean(value) {

  return String(
    value || ""
  ).trim();

}


// ==========================================================
// EMAIL VALIDATION
// ==========================================================

function isValidEmail(email) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(
      clean(email)
    );

}


// ==========================================================
// SHOW MESSAGE
// ==========================================================

function showMessage(
  message,
  type
) {

  messageBox.textContent =
    message;

  messageBox.className =
    "message " + type;

}


// ==========================================================
// CLEAR MESSAGE
// ==========================================================

function clearMessage() {

  messageBox.textContent = "";

  messageBox.className =
    "message";

}


// ==========================================================
// EMAIL ERROR
// ==========================================================

function setEmailError(
  show,
  text
) {

  if (show) {

    emailInput.classList.add(
      "email-error"
    );

    emailError.textContent =
      text ||
      "Email address ફરજિયાત છે.";

    emailError.classList.add(
      "show"
    );

  } else {

    emailInput.classList.remove(
      "email-error"
    );

    emailError.classList.remove(
      "show"
    );

  }

}


// ==========================================================
// EMAIL LIVE VALIDATION
// ==========================================================

emailInput.addEventListener(
  "input",
  function() {

    const email =
      clean(
        emailInput.value
      );

    if (!email) {

      setEmailError(
        true,
        "Email address ફરજિયાત છે."
      );

      return;

    }

    if (!isValidEmail(email)) {

      setEmailError(
        true,
        "સાચું Email Address દાખલ કરો."
      );

      return;

    }

    setEmailError(
      false
    );

  }
);


// ==========================================================
// MOBILE ONLY NUMBERS
// ==========================================================

mobileInput.addEventListener(
  "input",
  function() {

    mobileInput.value =
      mobileInput.value
        .replace(
          /\D/g,
          ""
        )
        .slice(
          0,
          10
        );

  }
);


// ==========================================================
// API REQUEST
// ==========================================================

async function apiRequest(
  payload
) {

  const response =
    await fetch(
      API_URL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "text/plain;charset=utf-8"
        },

        body:
          JSON.stringify(
            payload
          )
      }
    );


  if (!response.ok) {

    throw new Error(
      "Server error: HTTP " +
      response.status
    );

  }


  const text =
    await response.text();


  let result;


  try {

    result =
      JSON.parse(
        text
      );

  } catch (error) {

    throw new Error(
      "Invalid server response."
    );

  }


  return result;

}


// ==========================================================
// FORM SUBMIT
// ==========================================================

form.addEventListener(
  "submit",
  async function(event) {

    event.preventDefault();

    clearMessage();


    // ------------------------------------------------------
    // GET VALUES
    // ------------------------------------------------------

    const retailerName =
      clean(
        retailerNameInput.value
      );


    const mobile =
      clean(
        mobileInput.value
      );


    const email =
      clean(
        emailInput.value
      );


    const username =
      clean(
        usernameInput.value
      );


    const password =
      clean(
        passwordInput.value
      );


    // ------------------------------------------------------
    // RETAILER NAME
    // ------------------------------------------------------

    if (!retailerName) {

      showMessage(
        "Retailer Name દાખલ કરો.",
        "error"
      );

      retailerNameInput.focus();

      return;

    }


    // ------------------------------------------------------
    // MOBILE
    // ------------------------------------------------------

    if (
      mobile.length !== 10
    ) {

      showMessage(
        "10 અંકનો Mobile Number દાખલ કરો.",
        "error"
      );

      mobileInput.focus();

      return;

    }


    // ------------------------------------------------------
    // EMAIL REQUIRED
    // ------------------------------------------------------

    if (!email) {

      setEmailError(
        true,
        "Email address ફરજિયાત છે."
      );

      showMessage(
        "Retailer Email Address નાખવું ફરજિયાત છે.",
        "error"
      );

      emailInput.focus();

      return;

    }


    // ------------------------------------------------------
    // EMAIL FORMAT
    // ------------------------------------------------------

    if (!isValidEmail(email)) {

      setEmailError(
        true,
        "સાચું Email Address દાખલ કરો."
      );

      showMessage(
        "સાચું Email Address દાખલ કરો.",
        "error"
      );

      emailInput.focus();

      return;

    }


    setEmailError(
      false
    );


    // ------------------------------------------------------
    // USERNAME
    // ------------------------------------------------------

    if (!username) {

      showMessage(
        "Username દાખલ કરો.",
        "error"
      );

      usernameInput.focus();

      return;

    }


    // ------------------------------------------------------
    // PASSWORD
    // ------------------------------------------------------

    if (!password) {

      showMessage(
        "Password દાખલ કરો.",
        "error"
      );

      passwordInput.focus();

      return;

    }


    // ------------------------------------------------------
    // API URL CHECK
    // ------------------------------------------------------

    if (
      !API_URL ||
      API_URL.indexOf(
        "PASTE_YOUR"
      ) >= 0
    ) {

      showMessage(
        "Google Apps Script API URL retailer.js માં નાખો.",
        "error"
      );

      return;

    }


    // ------------------------------------------------------
    // DISABLE BUTTON
    // ------------------------------------------------------

    createBtn.disabled =
      true;

    createBtn.textContent =
      "⏳ Creating Retailer...";


    try {

      // ----------------------------------------------------
      // CREATE RETAILER
      // ----------------------------------------------------

      const result =
        await apiRequest({

          action:
            "createRetailer",

          retailerName:
            retailerName,

          mobile:
            mobile,

          email:
            email,

          username:
            username,

          password:
            password

        });


      // ----------------------------------------------------
      // SUCCESS
      // ----------------------------------------------------

      if (
        result &&
        result.success
      ) {

        const retailerId =
          clean(
            result.retailerId
          );


        const emailSent =
          result.emailSent === true;


        if (emailSent) {

          showMessage(

            "✅ Retailer successfully created!\n\n" +

            "Retailer ID: " +
            retailerId +
            "\n\n" +

            "📧 Login details successfully Email પર મોકલવામાં આવ્યા છે.\n\n" +

            "Email: " +
            email +
            "\n\n" +

            "Retailer ID, Username અને Password email માં ચેક કરો.",

            "success"

          );

        } else {

          showMessage(

            "✅ Retailer successfully created!\n\n" +

            "Retailer ID: " +
            retailerId +
            "\n\n" +

            "⚠️ Retailer create થઈ ગયો છે, પરંતુ Email મોકલવામાં આવ્યો નથી.\n\n" +

            "Reason: " +
            clean(
              result.emailMessage ||
              "Unknown email error."
            ),

            "error"

          );

        }


        // Clear form after successful creation

        form.reset();

        setEmailError(
          false
        );


      } else {

        showMessage(

          "❌ Retailer create થઈ શક્યો નથી.\n\n" +

          clean(
            result &&
            result.message
              ? result.message
              : "Unknown error."
          ),

          "error"

        );

      }


    } catch (error) {

      console.error(
        "Retailer Create Error:",
        error
      );


      showMessage(

        "❌ Server / API Error.\n\n" +

        clean(
          error.message
        ),

        "error"

      );


    } finally {

      createBtn.disabled =
        false;

      createBtn.textContent =
        "➕ CREATE RETAILER";

    }

  }
);
