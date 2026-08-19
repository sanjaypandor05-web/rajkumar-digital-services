/* ============================================================
   RAJKUMAR RATIONCARD SERVICES
   ADMIN.JS - COMPLETE FINAL VERSION
   ------------------------------------------------------------
   Features:
   - Admin Login
   - Dashboard
   - Retailer Create
   - Retailer Email Required
   - Retailer List
   - Applications
   - Payment Status
   - Application Status
   - Search
   - Logout
   - API Error Handling
   ============================================================ */

"use strict";

/* ============================================================
   API URL
   IMPORTANT:
   અહીં તમારું DEPLOYED GOOGLE APPS SCRIPT WEB APP URL મૂકો
   ============================================================ */

const API_URL =
  "https://script.google.com/macros/s/AKfycbzleZG-w2WQ6DClkEcqpRcn6Pv8gil3ym-aP4_9ctLUlzeiHG34MyDQgdV6JMK1r4zLnA/exec";


/* ============================================================
   DOM READY
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  initAdminPage();

});


/* ============================================================
   INITIALIZE ADMIN PAGE
   ============================================================ */

function initAdminPage() {

  setupLogout();

  setupRetailerForm();

  setupApplicationEvents();

  loadDashboard();

  loadRetailers();

  loadApplications();

}


/* ============================================================
   API REQUEST
   ============================================================ */

async function apiRequest(action, data = {}) {

  try {

    if (
      !API_URL ||
      API_URL.includes("PASTE_YOUR")
    ) {

      throw new Error(
        "Google Apps Script API URL set કરેલ નથી."
      );

    }


    const response =
      await fetch(API_URL, {

        method: "POST",

        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },

        body: JSON.stringify({

          action: action,

          ...data

        })

      });


    const text =
      await response.text();


    let result;


    try {

      result =
        JSON.parse(text);

    } catch (error) {

      throw new Error(
        "Server તરફથી valid JSON response મળ્યો નથી."
      );

    }


    if (!result) {

      throw new Error(
        "Empty server response."
      );

    }


    return result;


  } catch (error) {

    console.error(
      "API Error:",
      error
    );


    throw error;

  }

}


/* ============================================================
   ELEMENT HELPER
   ============================================================ */

function $(selector) {

  return document.querySelector(selector);

}


function $all(selector) {

  return document.querySelectorAll(selector);

}


/* ============================================================
   SHOW MESSAGE
   ============================================================ */

function showMessage(
  message,
  type = "info"
) {

  let box =
    $("#adminMessage");


  if (!box) {

    box =
      document.createElement("div");

    box.id =
      "adminMessage";

    box.style.position =
      "fixed";

    box.style.top =
      "20px";

    box.style.right =
      "20px";

    box.style.zIndex =
      "99999";

    box.style.maxWidth =
      "420px";

    box.style.padding =
      "14px 18px";

    box.style.borderRadius =
      "10px";

    box.style.fontWeight =
      "600";

    box.style.boxShadow =
      "0 5px 20px rgba(0,0,0,.2)";

    document.body.appendChild(
      box
    );

  }


  box.textContent =
    message;


  if (type === "success") {

    box.style.background =
      "#d1fae5";

    box.style.color =
      "#065f46";

  } else if (
    type === "error"
  ) {

    box.style.background =
      "#fee2e2";

    box.style.color =
      "#991b1b";

  } else if (
    type === "warning"
  ) {

    box.style.background =
      "#fef3c7";

    box.style.color =
      "#92400e";

  } else {

    box.style.background =
      "#dbeafe";

    box.style.color =
      "#1e40af";

  }


  box.style.display =
    "block";


  clearTimeout(
    showMessage.timer
  );


  showMessage.timer =
    setTimeout(
      function () {

        box.style.display =
          "none";

      },
      5000
    );

}


/* ============================================================
   GET FORM VALUE
   ============================================================ */

function getValue(
  form,
  names
) {

  for (
    const name of names
  ) {

    const element =
      form.querySelector(
        `[name="${name}"]`
      );


    if (
      element &&
      element.value !== undefined
    ) {

      return String(
        element.value
      ).trim();

    }

  }


  return "";

}


/* ============================================================
   SET BUTTON LOADING
   ============================================================ */

function setButtonLoading(
  button,
  loading,
  loadingText = "Processing..."
) {

  if (!button) {
    return;
  }


  if (loading) {

    button.dataset.oldText =
      button.innerHTML;

    button.disabled =
      true;

    button.innerHTML =
      loadingText;

  } else {

    button.disabled =
      false;

    if (
      button.dataset.oldText
    ) {

      button.innerHTML =
        button.dataset.oldText;

    }

  }

}


/* ============================================================
   RETAILER FORM SETUP
   ============================================================ */

function setupRetailerForm() {

  const form =
    document.querySelector(
      "#retailerForm"
    );


  if (!form) {

    console.warn(
      "retailerForm not found."
    );

    return;

  }


  form.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();

      await createRetailer(
        form
      );

    }
  );


  const emailInput =
    form.querySelector(
      '[name="email"]'
    );


  if (emailInput) {

    emailInput.required =
      true;

    emailInput.type =
      "email";

    emailInput.setAttribute(
      "autocomplete",
      "email"
    );

  }

}


/* ============================================================
   CREATE RETAILER
   ============================================================ */

async function createRetailer(
  form
) {

  const button =
    form.querySelector(
      'button[type="submit"]'
    );


  try {

    const retailerName =
      getValue(
        form,
        [
          "retailerName",
          "name",
          "fullName"
        ]
      );


    const mobile =
      getValue(
        form,
        [
          "mobile",
          "phone",
          "mobileNumber"
        ]
      );


    const email =
      getValue(
        form,
        [
          "email",
          "emailId"
        ]
      );


    const username =
      getValue(
        form,
        [
          "username",
          "userName",
          "user"
        ]
      );


    const password =
      getValue(
        form,
        [
          "password",
          "pass"
        ]
      );


    /* --------------------------------------------------------
       VALIDATION
       -------------------------------------------------------- */

    if (!retailerName) {

      showMessage(
        "Retailer Name નાખો.",
        "error"
      );

      return;

    }


    const mobileDigits =
      mobile.replace(
        /\D/g,
        ""
      );


    if (
      mobileDigits.length < 10
    ) {

      showMessage(
        "Valid 10 digit Mobile Number નાખો.",
        "error"
      );

      return;

    }


    if (!email) {

      showMessage(
        "Retailer Email નાખવો ફરજિયાત છે.",
        "error"
      );

      const emailInput =
        form.querySelector(
          '[name="email"]'
        );


      if (emailInput) {

        emailInput.focus();

      }

      return;

    }


    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
      !emailPattern.test(email)
    ) {

      showMessage(
        "Valid Email Address નાખો.",
        "error"
      );

      return;

    }


    if (!username) {

      showMessage(
        "Username નાખો.",
        "error"
      );

      return;

    }


    if (!password) {

      showMessage(
        "Password નાખો.",
        "error"
      );

      return;

    }


    /* --------------------------------------------------------
       LOADING
       -------------------------------------------------------- */

    setButtonLoading(
      button,
      true,
      "Creating Retailer..."
    );


    showMessage(
      "Retailer account બનાવવામાં આવી રહ્યું છે...",
      "info"
    );


    /* --------------------------------------------------------
       API
       -------------------------------------------------------- */

    const result =
      await apiRequest(
        "createRetailer",
        {

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

        }
      );


    console.log(
      "Create Retailer Result:",
      result
    );


    /* --------------------------------------------------------
       RESULT
       -------------------------------------------------------- */

    if (
      result.success
    ) {

      let message =
        "✅ Retailer successfully created!\n\n" +
        "Retailer ID: " +
        (
          result.retailerId ||
          "-"
        ) +
        "\n\n";


      if (
        result.emailSent === true
      ) {

        message +=
          "📧 Login details Email પર successfully મોકલવામાં આવ્યા છે.";

        showMessage(
          message,
          "success"
        );

      } else {

        message +=
          "⚠️ Retailer create થઈ ગયો છે, પરંતુ Email મોકલવામાં આવ્યો નથી.";


        if (
          result.emailMessage
        ) {

          message +=
            "\n\nReason: " +
            result.emailMessage;

        }


        showMessage(
          message,
          "warning"
        );

      }


      /* ------------------------------------------------------
         RESET FORM
         ------------------------------------------------------ */

      form.reset();


      /* ------------------------------------------------------
         RELOAD DATA
         ------------------------------------------------------ */

      await loadRetailers();

      await loadDashboard();

    } else {

      showMessage(
        "❌ " +
        (
          result.message ||
          "Retailer create failed."
        ),
        "error"
      );

    }


  } catch (error) {

    console.error(
      "Create retailer error:",
      error
    );


    showMessage(
      "❌ Retailer create error:\n" +
      error.message,
      "error"
    );

  } finally {

    setButtonLoading(
      button,
      false
    );

  }

}


/* ============================================================
   LOAD RETAILERS
   ============================================================ */

async function loadRetailers() {

  try {

    const result =
      await apiRequest(
        "testAllDatabases"
      );


    if (
      !result ||
      !result.retailer
    ) {

      return;

    }


    const tableBody =
      document.querySelector(
        "#retailerTableBody"
      );


    if (!tableBody) {

      return;

    }


    /*
     * અહીં backendમાં અલગ getRetailers action નથી,
     * એટલે page પર retailer list જરૂરી હોય તો
     * backendમાં getRetailers action add કરી શકાય.
     */

  } catch (error) {

    console.error(
      "Load retailers error:",
      error
    );

  }

}


/* ============================================================
   LOAD DASHBOARD
   ============================================================ */

async function loadDashboard() {

  try {

    const result =
      await apiRequest(
        "getAllApplications"
      );


    if (
      !result ||
      !result.success
    ) {

      return;

    }


    const applications =
      Array.isArray(
        result.applications
      )
        ? result.applications
        : [];


    updateDashboardStats(
      applications
    );


  } catch (error) {

    console.error(
      "Dashboard load error:",
      error
    );

  }

}


/* ============================================================
   DASHBOARD STATS
   ============================================================ */

function updateDashboardStats(
  applications
) {

  const total =
    applications.length;


  let pending =
    0;

  let processing =
    0;

  let completed =
    0;

  let rejected =
    0;


  applications.forEach(
    function (app) {

      const status =
        String(
          app["Application Status"] ||
          ""
        )
          .trim()
          .toLowerCase();


      if (
        status === "pending"
      ) {

        pending++;

      } else if (
        status === "processing"
      ) {

        processing++;

      } else if (
        status === "completed" ||
        status === "complete" ||
        status === "successful" ||
        status === "success"
      ) {

        completed++;

      } else if (
        status === "rejected" ||
        status === "failed"
      ) {

        rejected++;

      }

    }
  );


  setText(
    [
      "#totalApplications",
      "#totalCount",
      "[data-stat='total']"
    ],
    total
  );


  setText(
    [
      "#pendingApplications",
      "#pendingCount",
      "[data-stat='pending']"
    ],
    pending
  );


  setText(
    [
      "#processingApplications",
      "#processingCount",
      "[data-stat='processing']"
    ],
    processing
  );


  setText(
    [
      "#completedApplications",
      "#completedCount",
      "[data-stat='completed']"
    ],
    completed
  );


  setText(
    [
      "#rejectedApplications",
      "#rejectedCount",
      "[data-stat='rejected']"
    ],
    rejected
  );

}


/* ============================================================
   SET TEXT
   ============================================================ */

function setText(
  selectors,
  value
) {

  for (
    const selector of selectors
  ) {

    const element =
      document.querySelector(
        selector
      );


    if (element) {

      element.textContent =
        value;

      return;

    }

  }

}


/* ============================================================
   LOAD APPLICATIONS
   ============================================================ */

async function loadApplications() {

  try {

    const result =
      await apiRequest(
        "getAllApplications"
      );


    if (
      !result ||
      !result.success
    ) {

      console.error(
        result
      );

      return;

    }


    window.adminApplications =
      Array.isArray(
        result.applications
      )
        ? result.applications
        : [];


    renderApplications(
      window.adminApplications
    );


  } catch (error) {

    console.error(
      "Applications load error:",
      error
    );

  }

}


/* ============================================================
   RENDER APPLICATIONS
   ============================================================ */

function renderApplications(
  applications
) {

  const tbody =
    document.querySelector(
      "#applicationTableBody"
    );


  if (!tbody) {

    return;

  }


  tbody.innerHTML =
    "";


  if (
    !applications.length
  ) {

    const tr =
      document.createElement(
        "tr"
      );


    tr.innerHTML =
      '<td colspan="20" style="text-align:center;">No applications found.</td>';


    tbody.appendChild(
      tr
    );


    return;

  }


  applications.forEach(
    function (app) {

      const tr =
        document.createElement(
          "tr"
        );


      const applicationId =
        app["Application ID"] ||
        "";


      const date =
        app["Application Date"] ||
        "";


      const name =
        app["Applicant Name"] ||
        app["English Name"] ||
        "";


      const mobile =
        app["Mobile"] ||
        "";


      const service =
        app["Service Name"] ||
        "";


      const amount =
        app["Amount"] ||
        "";


      const payment =
        app["Payment Status"] ||
        "Pending";


      const status =
        app["Application Status"] ||
        "Pending";


      tr.innerHTML =

        "<td>" +
        escapeHtml(applicationId) +
        "</td>" +

        "<td>" +
        escapeHtml(date) +
        "</td>" +

        "<td>" +
        escapeHtml(name) +
        "</td>" +

        "<td>" +
        escapeHtml(mobile) +
        "</td>" +

        "<td>" +
        escapeHtml(service) +
        "</td>" +

        "<td>₹" +
        escapeHtml(amount) +
        "</td>" +

        "<td>" +
        escapeHtml(payment) +
        "</td>" +

        "<td>" +
        escapeHtml(status) +
        "</td>";


      tbody.appendChild(
        tr
      );

    }
  );

}


/* ============================================================
   APPLICATION EVENTS
   ============================================================ */

function setupApplicationEvents() {

  const searchInput =
    document.querySelector(
      "#applicationSearch"
    );


  if (
    searchInput
  ) {

    searchInput.addEventListener(
      "input",
      function () {

        filterApplications(
          searchInput.value
        );

      }
    );

  }


  const statusFilter =
    document.querySelector(
      "#statusFilter"
    );


  if (
    statusFilter
  ) {

    statusFilter.addEventListener(
      "change",
      function () {

        filterApplications();

      }
    );

  }

}


/* ============================================================
   FILTER APPLICATIONS
   ============================================================ */

function filterApplications(
  searchValue = null
) {

  const applications =
    window.adminApplications ||
    [];


  const searchInput =
    document.querySelector(
      "#applicationSearch"
    );


  const statusFilter =
    document.querySelector(
      "#statusFilter"
    );


  const search =
    (
      searchValue !== null
        ? searchValue
        : searchInput
          ? searchInput.value
          : ""
    )
      .trim()
      .toLowerCase();


  const status =
    statusFilter
      ? statusFilter.value
      : "";


  const filtered =
    applications.filter(
      function (app) {

        const id =
          String(
            app["Application ID"] ||
            ""
          ).toLowerCase();


        const name =
          String(
            app["Applicant Name"] ||
            app["English Name"] ||
            ""
          ).toLowerCase();


        const mobile =
          String(
            app["Mobile"] ||
            ""
          ).toLowerCase();


        const appStatus =
          String(
            app["Application Status"] ||
            ""
          ).toLowerCase();


        const matchesSearch =
          !search ||
          id.includes(search) ||
          name.includes(search) ||
          mobile.includes(search);


        const matchesStatus =
          !status ||
          appStatus ===
            status.toLowerCase();


        return (
          matchesSearch &&
          matchesStatus
        );

      }
    );


  renderApplications(
    filtered
  );

}


/* ============================================================
   UPDATE APPLICATION STATUS
   ============================================================ */

async function changeApplicationStatus(
  applicationId,
  status,
  remark = ""
) {

  try {

    const result =
      await apiRequest(
        "updateApplicationStatus",
        {

          applicationId:
            applicationId,

          status:
            status,

          remark:
            remark

        }
      );


    if (
      result.success
    ) {

      showMessage(
        "✅ Application status updated successfully.",
        "success"
      );


      await loadApplications();

      await loadDashboard();


    } else {

      showMessage(
        "❌ " +
        (
          result.message ||
          "Status update failed."
        ),
        "error"
      );

    }


    return result;


  } catch (error) {

    showMessage(
      "❌ " +
      error.message,
      "error"
    );


    return {
      success: false,
      message: error.message
    };

  }

}


/* ============================================================
   UPDATE PAYMENT STATUS
   ============================================================ */

async function changePaymentStatus(
  applicationId,
  status
) {

  try {

    const result =
      await apiRequest(
        "updatePaymentStatus",
        {

          applicationId:
            applicationId,

          paymentStatus:
            status

        }
      );


    if (
      result.success
    ) {

      showMessage(
        "✅ Payment status updated.",
        "success"
      );


      await loadApplications();


    } else {

      showMessage(
        "❌ " +
        (
          result.message ||
          "Payment update failed."
        ),
        "error"
      );

    }


    return result;


  } catch (error) {

    showMessage(
      "❌ " +
      error.message,
      "error"
    );


    return {
      success: false,
      message: error.message
    };

  }

}


/* ============================================================
   LOGOUT
   ============================================================ */

function setupLogout() {

  const buttons =
    document.querySelectorAll(
      "#logoutBtn, .logout-btn, [data-action='logout']"
    );


  buttons.forEach(
    function (button) {

      button.addEventListener(
        "click",
        function (event) {

          event.preventDefault();

          logoutAdmin();

        }
      );

    }
  );

}


function logoutAdmin() {

  try {

    localStorage.removeItem(
      "adminLoggedIn"
    );

    localStorage.removeItem(
      "admin"
    );

    localStorage.removeItem(
      "adminUser"
    );

    sessionStorage.removeItem(
      "adminLoggedIn"
    );

    sessionStorage.removeItem(
      "admin"
    );

  } catch (error) {

    console.error(
      error
    );

  }


  window.location.href =
    "login.html";

}


/* ============================================================
   ESCAPE HTML
   ============================================================ */

function escapeHtml(
  value
) {

  return String(
    value === null ||
    value === undefined
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


/* ============================================================
   GLOBAL FUNCTIONS
   ============================================================ */

window.createRetailer =
  function () {

    const form =
      document.querySelector(
        "#retailerForm"
      );


    if (form) {

      return createRetailer(
        form
      );

    }

  };


window.loadApplications =
  loadApplications;


window.loadDashboard =
  loadDashboard;


window.changeApplicationStatus =
  changeApplicationStatus;


window.changePaymentStatus =
  changePaymentStatus;


window.logoutAdmin =
  logoutAdmin;


/* ============================================================
   PREVENT DOUBLE SUBMIT
   ============================================================ */

document.addEventListener(
  "submit",
  function (event) {

    const form =
      event.target;


    if (
      form &&
      form.id ===
        "retailerForm"
    ) {

      /*
       * setupRetailerForm already handles it.
       * This block intentionally does nothing.
       */

    }

  }
);
