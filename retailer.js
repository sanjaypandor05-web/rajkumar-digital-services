/************************************************************
 * RAJKUMAR RATIONCARD SERVICES
 * RETAILER PORTAL JS
 *
 * Works with the provided Code.gs
 * WhatsApp COMPLETELY REMOVED
 * Retailer account details are sent by EMAIL
 ************************************************************/


// ==========================================================
// GOOGLE APPS SCRIPT API URL
// ==========================================================

const API_URL =
  "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";


// ==========================================================
// PAGE LOAD
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {

  checkRetailerSession();

  const loginForm =
    document.getElementById("loginForm");

  if (loginForm) {

    loginForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        retailerLogin();

      }
    );

  }

});


// ==========================================================
// API REQUEST
// ==========================================================

async function apiRequest(data) {

  if (
    !API_URL ||
    API_URL.includes(
      "PASTE_YOUR_GOOGLE_APPS_SCRIPT"
    )
  ) {

    throw new Error(
      "Google Apps Script API URL set કરેલ નથી."
    );

  }


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
          JSON.stringify(data)
      }
    );


  if (!response.ok) {

    throw new Error(
      "Server Error: " +
      response.status
    );

  }


  const result =
    await response.json();


  return result;

}


// ==========================================================
// RETAILER LOGIN
// ==========================================================

async function retailerLogin() {

  const username =
    document
      .getElementById("loginUsername")
      .value
      .trim();


  const password =
    document
      .getElementById("loginPassword")
      .value
      .trim();


  if (!username || !password) {

    showLoginMessage(
      "Retailer ID / Username અને Password બંને નાખો.",
      "error"
    );

    return;

  }


  const loginBtn =
    document.getElementById("loginBtn");


  loginBtn.disabled = true;

  loginBtn.textContent =
    "LOGIN થઈ રહ્યું છે...";


  try {

    const result =
      await apiRequest({

        action:
          "retailerLogin",

        username:
          username,

        password:
          password

      });


    if (!result.success) {

      showLoginMessage(
        result.message ||
          "Invalid login.",
        "error"
      );

      return;

    }


    // ------------------------------------------------------
    // SAVE SESSION
    // ------------------------------------------------------

    const retailerSession = {

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
        result.username || "",

      status:
        result.status || "Active"

    };


    sessionStorage.setItem(
      "retailerSession",
      JSON.stringify(
        retailerSession
      )
    );


    showDashboard(
      retailerSession
    );


    loadRetailerApplications();


  } catch (error) {

    console.error(error);

    showLoginMessage(
      error.message ||
        "Login failed.",
      "error"
    );


  } finally {

    loginBtn.disabled = false;

    loginBtn.textContent =
      "LOGIN";

  }

}


// ==========================================================
// CHECK SESSION
// ==========================================================

function checkRetailerSession() {

  try {

    const saved =
      sessionStorage.getItem(
        "retailerSession"
      );


    if (!saved) {

      return;

    }


    const session =
      JSON.parse(saved);


    if (
      !session ||
      session.role !==
        "retailer"
    ) {

      return;

    }


    showDashboard(
      session
    );


    loadRetailerApplications();


  } catch (error) {

    console.error(
      "Session error:",
      error
    );

    sessionStorage.removeItem(
      "retailerSession"
    );

  }

}


// ==========================================================
// SHOW DASHBOARD
// ==========================================================

function showDashboard(session) {

  document
    .getElementById(
      "loginSection"
    )
    .classList
    .add("hidden");


  document
    .getElementById(
      "dashboardSection"
    )
    .classList
    .remove("hidden");


  document
    .getElementById(
      "logoutBtn"
    )
    .style
    .display =
      "block";


  document
    .getElementById(
      "showRetailerId"
    )
    .textContent =
      session.retailerId || "-";


  document
    .getElementById(
      "showRetailerName"
    )
    .textContent =
      session.retailerName || "-";


  document
    .getElementById(
      "showMobile"
    )
    .textContent =
      session.mobile || "-";


  document
    .getElementById(
      "showEmail"
    )
    .textContent =
      session.email || "-";

}


// ==========================================================
// LOGOUT
// ==========================================================

function logoutRetailer() {

  sessionStorage.removeItem(
    "retailerSession"
  );


  document
    .getElementById(
      "dashboardSection"
    )
    .classList
    .add("hidden");


  document
    .getElementById(
      "loginSection"
    )
    .classList
    .remove("hidden");


  document
    .getElementById(
      "logoutBtn"
    )
    .style
    .display =
      "none";


  document
    .getElementById(
      "loginPassword"
    )
    .value = "";


  document
    .getElementById(
      "loginUsername"
    )
    .value = "";


  showLoginMessage(
    "",
    ""
  );

}


// ==========================================================
// LOAD RETAILER APPLICATIONS
// ==========================================================

async function loadRetailerApplications() {

  const session =
    getRetailerSession();


  if (!session) {

    return;

  }


  const loading =
    document.getElementById(
      "applicationsLoading"
    );


  const noApplications =
    document.getElementById(
      "noApplications"
    );


  const table =
    document.getElementById(
      "applicationsTable"
    );


  const tbody =
    document.getElementById(
      "applicationsBody"
    );


  loading.classList.remove(
    "hidden"
  );


  noApplications.classList.add(
    "hidden"
  );


  table.classList.remove(
    "hidden"
  );


  tbody.innerHTML = "";


  try {

    const result =
      await apiRequest({

        action:
          "getRetailerApplications",

        retailerId:
          session.retailerId

      });


    if (!result.success) {

      throw new Error(
        result.message ||
          "Applications load failed."
      );

    }


    const applications =
      result.applications || [];


    loading.classList.add(
      "hidden"
    );


    if (
      applications.length === 0
    ) {

      noApplications.classList.remove(
        "hidden"
      );

      table.classList.add(
        "hidden"
      );

      return;

    }


    table.classList.remove(
      "hidden"
    );


    applications
      .forEach(
        function(application) {

          const tr =
            document.createElement(
              "tr"
            );


          const applicationId =
            getValue(
              application,
              "Application ID"
            );


          const date =
            getValue(
              application,
              "Application Date"
            );


          const applicant =
            getValue(
              application,
              "Applicant Name"
            ) ||
            getValue(
              application,
              "English Name"
            );


          const service =
            getValue(
              application,
              "Service Name"
            );


          const amount =
            getValue(
              application,
              "Amount"
            );


          const paymentStatus =
            getValue(
              application,
              "Payment Status"
            );


          const applicationStatus =
            getValue(
              application,
              "Application Status"
            );


          tr.innerHTML = `

            <td>
              <strong>
                ${escapeHtml(applicationId)}
              </strong>
            </td>

            <td>
              ${escapeHtml(date)}
            </td>

            <td>
              ${escapeHtml(applicant)}
            </td>

            <td>
              ${escapeHtml(service)}
            </td>

            <td>
              ₹${escapeHtml(amount)}
            </td>

            <td>
              ${statusBadge(paymentStatus)}
            </td>

            <td>
              ${statusBadge(applicationStatus)}
            </td>

          `;


          tbody.appendChild(
            tr
          );

        }
      );


  } catch (error) {

    console.error(error);

    loading.classList.add(
      "hidden"
    );


    showDashboardMessage(
      error.message ||
        "Applications load failed.",
      "error"
    );

  }

}


// ==========================================================
// GET SESSION
// ==========================================================

function getRetailerSession() {

  try {

    const saved =
      sessionStorage.getItem(
        "retailerSession"
      );


    if (!saved) {

      return null;

    }


    const session =
      JSON.parse(saved);


    if (
      !session ||
      !session.retailerId
    ) {

      return null;

    }


    return session;

  } catch (error) {

    return null;

  }

}


// ==========================================================
// GET OBJECT VALUE
// ==========================================================

function getValue(
  object,
  key
) {

  if (!object) {

    return "";

  }


  return (
    object[key] !== undefined &&
    object[key] !== null
  )
    ? String(object[key])
    : "";

}


// ==========================================================
// STATUS BADGE
// ==========================================================

function statusBadge(status) {

  const value =
    String(
      status || "-"
    );


  const lower =
    value.toLowerCase();


  let className =
    "pending";


  if (
    lower.includes("complete") ||
    lower.includes("success") ||
    lower.includes("paid") ||
    lower === "verified"
  ) {

    className =
      "completed";

  } else if (
    lower.includes("reject") ||
    lower.includes("fail")
  ) {

    className =
      "rejected";

  } else if (
    lower.includes("process")
  ) {

    className =
      "processing";

  }


  return `
    <span class="status ${className}">
      ${escapeHtml(value)}
    </span>
  `;

}


// ==========================================================
// HTML ESCAPE
// ==========================================================

function escapeHtml(value) {

  return String(
    value === undefined ||
    value === null
      ? ""
      : value
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


// ==========================================================
// LOGIN MESSAGE
// ==========================================================

function showLoginMessage(
  message,
  type
) {

  const box =
    document.getElementById(
      "loginMessage"
    );


  box.textContent =
    message || "";


  box.className =
    "message";


  if (message && type) {

    box.classList.add(
      type
    );

  }

}


// ==========================================================
// DASHBOARD MESSAGE
// ==========================================================

function showDashboardMessage(
  message,
  type
) {

  const box =
    document.getElementById(
      "dashboardMessage"
    );


  box.textContent =
    message || "";


  box.className =
    "message";


  if (message && type) {

    box.classList.add(
      type
    );

  }

}
