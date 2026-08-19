/* ============================================================
   RAJKUMAR RATIONCARD SERVICES
   ADMIN.JS - COMPLETE FINAL
   ------------------------------------------------------------
   FIXED:
   ✅ Admin Login
   ✅ Admin Session
   ✅ Dashboard
   ✅ Create Retailer
   ✅ Retailer Email Required
   ✅ Email result display
   ✅ Applications
   ✅ Search
   ✅ Payment Status
   ✅ Application Status
   ✅ Logout
   ============================================================ */

"use strict";

/* ============================================================
   GOOGLE APPS SCRIPT WEB APP URL
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
   INITIALIZE
   ============================================================ */

function initAdminPage() {

  setupAdminLogin();

  setupLogout();

  setupRetailerForm();

  setupApplicationEvents();

  checkAdminSession();

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

    const response = await fetch(API_URL, {

      method: "POST",

      headers: {
        "Content-Type":
          "text/plain;charset=utf-8"
      },

      body: JSON.stringify({

        action: action,

        ...data

      })

    });


    const text =
      await response.text();


    console.log(
      "API Response:",
      action,
      text
    );


    let result;


    try {

      result =
        JSON.parse(text);

    } catch (e) {

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
      action,
      error
    );

    throw error;

  }

}


/* ============================================================
   ELEMENT HELPERS
   ============================================================ */

function $(selector) {

  return document.querySelector(selector);

}


function $all(selector) {

  return document.querySelectorAll(selector);

}


/* ============================================================
   MESSAGE
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
      "999999";

    box.style.maxWidth =
      "450px";

    box.style.whiteSpace =
      "pre-line";

    box.style.padding =
      "14px 18px";

    box.style.borderRadius =
      "10px";

    box.style.fontWeight =
      "700";

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

  }

  else if (type === "error") {

    box.style.background =
      "#fee2e2";

    box.style.color =
      "#991b1b";

  }

  else if (type === "warning") {

    box.style.background =
      "#fef3c7";

    box.style.color =
      "#92400e";

  }

  else {

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
      6000
    );

}


/* ============================================================
   ADMIN LOGIN
   ============================================================ */

function setupAdminLogin() {

  const form =
    $("#adminLoginForm");


  if (!form) {

    console.warn(
      "adminLoginForm not found."
    );

    return;

  }


  form.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();

      await adminLogin();

    }
  );

}


/* ============================================================
   ADMIN LOGIN FUNCTION
   ============================================================ */

async function adminLogin() {

  const usernameInput =
    $("#adminId");

  const passwordInput =
    $("#adminPassword");

  const button =
    $("#adminLoginButton");

  const message =
    $("#adminLoginMessage");


  const username =
    usernameInput
      ? usernameInput.value.trim()
      : "";


  const password =
    passwordInput
      ? passwordInput.value.trim()
      : "";


  if (!username) {

    showLoginMessage(
      "Admin ID નાખો.",
      "error"
    );

    if (usernameInput)
      usernameInput.focus();

    return;

  }


  if (!password) {

    showLoginMessage(
      "Password નાખો.",
      "error"
    );

    if (passwordInput)
      passwordInput.focus();

    return;

  }


  if (button) {

    button.disabled =
      true;

    button.innerHTML =
      "⏳ Login Checking...";

  }


  showLoginMessage(
    "Admin login checking...",
    "info"
  );


  try {

    /*
     * IMPORTANT:
     * Code.gs માં action = adminLogin હોવું જોઈએ.
     */

    const result =
      await apiRequest(
        "adminLogin",
        {

          username:
            username,

          password:
            password,

          adminId:
            username,

          adminUsername:
            username

        }
      );


    console.log(
      "ADMIN LOGIN RESULT:",
      result
    );


    if (
      result &&
      result.success === true
    ) {

      /* =========================================
         SAVE ADMIN SESSION
         ========================================= */

      try {

        localStorage.setItem(
          "adminLoggedIn",
          "true"
        );

        localStorage.setItem(
          "adminUser",
          username
        );

        localStorage.setItem(
          "admin",
          JSON.stringify(
            result.admin ||
            {
              username: username
            }
          )
        );

        sessionStorage.setItem(
          "adminLoggedIn",
          "true"
        );

      } catch (storageError) {

        console.warn(
          "Storage error:",
          storageError
        );

      }


      showLoginMessage(
        "✅ Admin Login Successful",
        "success"
      );


      setTimeout(
        function () {

          showAdminDashboard();

        },
        300
      );


    } else {

      showLoginMessage(

        "❌ " +
        (
          result &&
          (
            result.message ||
            result.error
          )
        ?
            (
              result.message ||
              result.error
            )
        :
            "Wrong Admin ID અથવા Password."
        ),

        "error"

      );

    }


  } catch (error) {

    console.error(
      "Admin login error:",
      error
    );


    showLoginMessage(

      "❌ Login Error:\n" +
      error.message,

      "error"

    );

  } finally {

    if (button) {

      button.disabled =
        false;

      button.innerHTML =
        "🔐 Login";

    }

  }

}


/* ============================================================
   LOGIN MESSAGE
   ============================================================ */

function showLoginMessage(
  message,
  type
) {

  const box =
    $("#adminLoginMessage");


  if (!box) {

    showMessage(
      message,
      type
    );

    return;

  }


  box.textContent =
    message;


  box.style.display =
    "block";


  box.className =
    "admin-login-message";


  if (type === "success") {

    box.classList.add(
      "message-success"
    );

  }

  else if (type === "error") {

    box.classList.add(
      "message-error"
    );

  }

  else {

    box.style.background =
      "#e3f2fd";

    box.style.color =
      "#0d47a1";

  }

}


/* ============================================================
   SESSION CHECK
   ============================================================ */

function checkAdminSession() {

  let loggedIn = false;


  try {

    loggedIn =
      localStorage.getItem(
        "adminLoggedIn"
      ) === "true";


    if (!loggedIn) {

      loggedIn =
        sessionStorage.getItem(
          "adminLoggedIn"
        ) === "true";

    }

  } catch (error) {

    console.error(
      error
    );

  }


  if (loggedIn) {

    showAdminDashboard();

  } else {

    showAdminLogin();

  }

}


/* ============================================================
   SHOW LOGIN
   ============================================================ */

function showAdminLogin() {

  const login =
    $("#adminLoginSection");

  const dashboard =
    $("#adminDashboardSection");


  if (login) {

    login.style.display =
      "block";

  }


  if (dashboard) {

    dashboard.classList.add(
      "admin-hidden"
    );

    dashboard.style.display =
      "none";

  }

}


/* ============================================================
   SHOW DASHBOARD
   ============================================================ */

async function showAdminDashboard() {

  const login =
    $("#adminLoginSection");

  const dashboard =
    $("#adminDashboardSection");


  if (login) {

    login.style.display =
      "none";

  }


  if (dashboard) {

    dashboard.classList.remove(
      "admin-hidden"
    );

    dashboard.style.display =
      "block";

  }


  /*
   * હવે login થયા પછી જ data load થશે.
   */

  await loadDashboard();

  await loadApplications();

}


/* ============================================================
   RETAILER FORM SETUP
   ============================================================ */

function setupRetailerForm() {

  /*
   * HTML માં actual ID:
   * createRetailerForm
   *
   * જૂના code માં retailerForm હતું.
   */

  const form =
    document.querySelector(
      "#createRetailerForm"
    );


  if (!form) {

    console.warn(
      "createRetailerForm not found."
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
      '[name="retailer_email"]'
    );


  if (emailInput) {

    emailInput.required =
      true;

    emailInput.type =
      "email";

    emailInput.setAttribute(
      "autocomplete",
      "off"
    );

  }


  /*
   * Mobile number only digits
   */

  const mobileInput =
    form.querySelector(
      '[name="retailer_mobile"]'
    );


  if (mobileInput) {

    mobileInput.addEventListener(
      "input",
      function () {

        mobileInput.value =
          mobileInput.value
            .replace(/\D/g, "")
            .slice(0, 10);

      }
    );

  }

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
   BUTTON LOADING
   ============================================================ */

function setButtonLoading(
  button,
  loading,
  loadingText = "Processing..."
) {

  if (!button)
    return;


  if (loading) {

    button.dataset.oldText =
      button.innerHTML;

    button.disabled =
      true;

    button.innerHTML =
      loadingText;

  }

  else {

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

    /*
     * HTML field names પ્રમાણે values.
     */

    const retailerName =
      getValue(
        form,
        [
          "retailer_name",
          "retailerName",
          "name",
          "fullName"
        ]
      );


    const mobile =
      getValue(
        form,
        [
          "retailer_mobile",
          "mobile",
          "phone",
          "mobileNumber"
        ]
      );


    const email =
      getValue(
        form,
        [
          "retailer_email",
          "email",
          "emailId"
        ]
      );


    const retailerId =
      getValue(
        form,
        [
          "retailer_id",
          "retailerId"
        ]
      );


    const username =
      getValue(
        form,
        [
          "retailer_username",
          "username",
          "userName",
          "user"
        ]
      );


    const password =
      getValue(
        form,
        [
          "retailer_password",
          "password",
          "pass"
        ]
      );


    /* ========================================================
       VALIDATION
       ======================================================== */

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
      mobileDigits.length !== 10
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
          '[name="retailer_email"]'
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


    /* ========================================================
       LOADING
       ======================================================== */

    setButtonLoading(
      button,
      true,
      "⏳ Creating Retailer..."
    );


    showMessage(
      "Retailer account બનાવવામાં આવી રહ્યું છે...",
      "info"
    );


    /* ========================================================
       SEND TO CODE.GS
       ======================================================== */

    const result =
      await apiRequest(
        "createRetailer",
        {

          retailerName:
            retailerName,

          name:
            retailerName,

          mobile:
            mobileDigits,

          email:
            email,

          username:
            username,

          password:
            password,

          retailerId:
            retailerId

        }
      );


    console.log(
      "CREATE RETAILER RESULT:",
      result
    );


    /* ========================================================
       SUCCESS
       ======================================================== */

    if (
      result &&
      result.success === true
    ) {

      let message =
        "✅ Retailer successfully created!\n\n";


      message +=
        "Retailer ID: " +
        (
          result.retailerId ||
          retailerId ||
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

      }

      else {

        message +=
          "⚠️ Retailer create થઈ ગયો છે, પરંતુ Email મોકલવામાં આવ્યો નથી.";


        if (
          result.emailMessage
        ) {

          message +=
            "\n\nReason: " +
            result.emailMessage;

        }


        if (
          result.emailError
        ) {

          message +=
            "\n\nEmail Error: " +
            result.emailError;

        }


        showMessage(
          message,
          "warning"
        );

      }


      /*
       * RESET
       */

      form.reset();


      /*
       * Retailer ID ફરીથી blank
       */

      const idInput =
        $("#newRetailerId");


      if (idInput) {

        idInput.value =
          "";

      }


      /*
       * Refresh dashboard
       */

      await loadDashboard();

      await loadApplications();


    }

    else {

      showMessage(

        "❌ " +
        (
          result &&
          (
            result.message ||
            result.error
          )
        ?
          (
            result.message ||
            result.error
          )
        :
          "Retailer create failed."
        ),

        "error"

      );

    }


  }

  catch (error) {

    console.error(
      "Create retailer error:",
      error
    );


    showMessage(
      "❌ Retailer create error:\n" +
      error.message,
      "error"
    );

  }

  finally {

    setButtonLoading(
      button,
      false
    );

  }

}


/* ============================================================
   ADMIN PANEL
   ============================================================ */

function showAdminPanel(
  panelId
) {

  const panels =
    document.querySelectorAll(
      ".admin-panel"
    );


  panels.forEach(
    function (panel) {

      panel.classList.add(
        "admin-hidden"
      );

    }
  );


  const panel =
    document.getElementById(
      panelId
    );


  if (panel) {

    panel.classList.remove(
      "admin-hidden"
    );

    panel.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }

}


window.showAdminPanel =
  showAdminPanel;


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
        ?
          result.applications
        :
          [];


    updateDashboardStats(
      applications
    );


  }

  catch (error) {

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


  let pending = 0;

  let processing = 0;

  let completed = 0;

  let paid = 0;


  applications.forEach(
    function (app) {

      const status =
        String(
          app["Application Status"] ||
          app["Status"] ||
          ""
        )
          .trim()
          .toLowerCase();


      const payment =
        String(
          app["Payment Status"] ||
          ""
        )
          .trim()
          .toLowerCase();


      if (
        status === "pending" ||
        status === "submitted"
      ) {

        pending++;

      }


      if (
        status === "processing"
      ) {

        processing++;

      }


      if (
        status === "completed" ||
        status === "complete" ||
        status === "successful" ||
        status === "success"
      ) {

        completed++;

      }


      if (
        payment === "payment received" ||
        payment === "payment verified" ||
        payment === "paid" ||
        payment === "success"
      ) {

        paid++;

      }

    }
  );


  setText(
    [
      "#totalApplications",
      "#totalCount"
    ],
    total
  );


  setText(
    [
      "#pendingApplications",
      "#pendingCount"
    ],
    pending
  );


  setText(
    [
      "#paidApplications",
      "#paidCount"
    ],
    paid
  );


  setText(
    [
      "#processingApplications",
      "#processingCount"
    ],
    processing
  );


  setText(
    [
      "#completedApplications",
      "#completedCount"
    ],
    completed
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
        "Applications result:",
        result
      );

      return;

    }


    window.adminApplications =
      Array.isArray(
        result.applications
      )
        ?
          result.applications
        :
          [];


    renderApplications(
      window.adminApplications
    );


  }

  catch (error) {

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

  /*
   * HTML ID:
   * applicationsTableBody
   */

  const tbody =
    $("#applicationsTableBody");


  if (!tbody) {

    console.warn(
      "applicationsTableBody not found."
    );

    return;

  }


  tbody.innerHTML =
    "";


  if (
    !applications ||
    !applications.length
  ) {

    tbody.innerHTML =

      `<tr>
        <td
          colspan="9"
          style="
            text-align:center;
            padding:30px;
            color:#777;
          "
        >
          No applications found.
        </td>
      </tr>`;

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
        app["ApplicationID"] ||
        "";


      const retailer =
        app["Retailer Name"] ||
        app["Retailer"] ||
        app["Retailer ID"] ||
        "";


      const name =
        app["Applicant Name"] ||
        app["English Name"] ||
        app["Final Name"] ||
        "";


      const mobile =
        app["Mobile"] ||
        "";


      const service =
        app["Service"] ||
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
        app["Status"] ||
        "Pending";


      tr.innerHTML =

        "<td>" +
        escapeHtml(applicationId) +
        "</td>" +

        "<td>" +
        escapeHtml(retailer) +
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
        "</td>" +

        "<td>" +

        `<button
          type="button"
          class="action-button view-button"
          onclick="viewApplication('${escapeJs(applicationId)}')"
        >
          👁 View
        </button>` +

        "</td>";


      tbody.appendChild(
        tr
      );

    }
  );

}


/* ============================================================
   APPLICATION SEARCH
   ============================================================ */

function setupApplicationEvents() {

  const searchInput =
    $("#applicationSearch");


  if (searchInput) {

    searchInput.addEventListener(
      "input",
      function () {

        searchApplications();

      }
    );

  }


  /*
   * તમારા HTML માં ID:
   * applicationStatusFilter
   */

  const statusFilter =
    $("#applicationStatusFilter");


  if (statusFilter) {

    statusFilter.addEventListener(
      "change",
      function () {

        searchApplications();

      }
    );

  }

}


/* ============================================================
   SEARCH APPLICATIONS
   ============================================================ */

function searchApplications() {

  const applications =
    window.adminApplications ||
    [];


  const searchInput =
    $("#applicationSearch");


  const statusFilter =
    $("#applicationStatusFilter");


  const search =
    searchInput
      ?
        searchInput.value
          .trim()
          .toLowerCase()
      :
        "";


  const status =
    statusFilter
      ?
        statusFilter.value
          .trim()
          .toLowerCase()
      :
        "";


  const filtered =
    applications.filter(
      function (app) {

        const id =
          String(
            app["Application ID"] ||
            ""
          )
            .toLowerCase();


        const retailer =
          String(
            app["Retailer Name"] ||
            app["Retailer"] ||
            app["Retailer ID"] ||
            ""
          )
            .toLowerCase();


        const name =
          String(
            app["Applicant Name"] ||
            app["English Name"] ||
            ""
          )
            .toLowerCase();


        const mobile =
          String(
            app["Mobile"] ||
            ""
          )
            .toLowerCase();


        const appStatus =
          String(
            app["Application Status"] ||
            app["Status"] ||
            ""
          )
            .toLowerCase();


        const matchesSearch =
          !search ||
          id.includes(search) ||
          retailer.includes(search) ||
          name.includes(search) ||
          mobile.includes(search);


        const matchesStatus =
          !status ||
          appStatus === status;


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


window.searchApplications =
  searchApplications;


/* ============================================================
   VIEW APPLICATION
   ============================================================ */

function viewApplication(
  applicationId
) {

  const applications =
    window.adminApplications ||
    [];


  const app =
    applications.find(
      function (item) {

        return String(
          item["Application ID"] ||
          ""
        ) ===
        String(
          applicationId
        );

      }
    );


  if (!app) {

    showMessage(
      "Application મળતી નથી.",
      "error"
    );

    return;

  }


  const modal =
    $("#applicationModal");


  const details =
    $("#applicationDetails");


  if (!modal || !details) {

    return;

  }


  const rows = [];


  Object.keys(app).forEach(
    function (key) {

      rows.push(

        `<div class="detail-box">

          <strong>
            ${escapeHtml(key)}
          </strong>

          <span>
            ${escapeHtml(app[key])}
          </span>

        </div>`

      );

    }
  );


  details.innerHTML =

    `<div class="detail-grid">
      ${rows.join("")}
    </div>`;


  modal.classList.add(
    "show"
  );

}


window.viewApplication =
  viewApplication;


/* ============================================================
   CLOSE MODAL
   ============================================================ */

function closeApplicationModal() {

  const modal =
    $("#applicationModal");


  if (modal) {

    modal.classList.remove(
      "show"
    );

  }

}


window.closeApplicationModal =
  closeApplicationModal;


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
      result &&
      result.success
    ) {

      showMessage(
        "✅ Application status updated successfully.",
        "success"
      );


      await loadApplications();

      await loadDashboard();

    }

    else {

      showMessage(

        "❌ " +
        (
          result &&
          result.message
        ?
          result.message
        :
          "Status update failed."
        ),

        "error"

      );

    }


    return result;


  }

  catch (error) {

    showMessage(
      "❌ " +
      error.message,
      "error"
    );


    return {

      success:
        false,

      message:
        error.message

    };

  }

}


window.changeApplicationStatus =
  changeApplicationStatus;


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
      result &&
      result.success
    ) {

      showMessage(
        "✅ Payment status updated.",
        "success"
      );


      await loadApplications();

      await loadDashboard();

    }

    else {

      showMessage(

        "❌ " +
        (
          result &&
          result.message
        ?
          result.message
        :
          "Payment update failed."
        ),

        "error"

      );

    }


    return result;


  }

  catch (error) {

    showMessage(
      "❌ " +
      error.message,
      "error"
    );


    return {

      success:
        false,

      message:
        error.message

    };

  }

}


window.changePaymentStatus =
  changePaymentStatus;


/* ============================================================
   PAYMENT BUTTON FROM HTML
   ============================================================ */

async function updatePaymentStatus() {

  const applicationId =
    $("#paymentApplicationId")
      ?
        $("#paymentApplicationId")
          .value
          .trim()
      :
        "";


  const status =
    $("#paymentStatusSelect")
      ?
        $("#paymentStatusSelect")
          .value
      :
        "";


  if (!applicationId) {

    showMessage(
      "Application ID નાખો.",
      "error"
    );

    return;

  }


  if (!status) {

    showMessage(
      "Payment Status પસંદ કરો.",
      "error"
    );

    return;

  }


  const result =
    await changePaymentStatus(
      applicationId,
      status
    );


  const message =
    $("#paymentMessage");


  if (
    message &&
    result
  ) {

    message.style.display =
      "block";

    message.textContent =
      result.success
        ?
          "✅ Payment status updated."
        :
          (
            result.message ||
            "Update failed."
          );

  }

}


window.updatePaymentStatus =
  updatePaymentStatus;


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

          adminLogout();

        }
      );

    }
  );

}


/* ============================================================
   ADMIN LOGOUT
   ============================================================ */

function adminLogout() {

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

  }

  catch (error) {

    console.error(
      error
    );

  }


  showAdminLogin();


  const username =
    $("#adminId");

  const password =
    $("#adminPassword");


  if (username)
    username.value = "";


  if (password)
    password.value = "";


  showLoginMessage(
    "Admin logout successfully.",
    "success"
  );

}


window.adminLogout =
  adminLogout;


/*
 * જૂના code માં logoutAdmin હતું.
 * compatibility માટે બંને રાખ્યા છે.
 */

window.logoutAdmin =
  adminLogout;


/* ============================================================
   ESCAPE HTML
   ============================================================ */

function escapeHtml(
  value
) {

  return String(
    value === null ||
    value === undefined
      ?
        ""
      :
        value
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
   ESCAPE JS
   ============================================================ */

function escapeJs(
  value
) {

  return String(
    value || ""
  )
    .replace(
      /\\/g,
      "\\\\"
    )
    .replace(
      /'/g,
      "\\'"
    )
    .replace(
      /"/g,
      '\\"'
    )
    .replace(
      /\n/g,
      "\\n"
    )
    .replace(
      /\r/g,
      "\\r"
    );

}


/* ============================================================
   GLOBAL
   ============================================================ */

window.adminLogin =
  adminLogin;

window.createRetailer =
  function () {

    const form =
      $("#createRetailerForm");

    if (form) {

      return createRetailer(
        form
      );

    }

  };

window.loadDashboard =
  loadDashboard;

window.loadApplications =
  loadApplications;


/* ============================================================
   CLOSE MODAL ON OUTSIDE CLICK
   ============================================================ */

document.addEventListener(
  "click",
  function (event) {

    const modal =
      $("#applicationModal");


    if (
      modal &&
      event.target === modal
    ) {

      closeApplicationModal();

    }

  }
);


/* ============================================================
   ESC KEY - CLOSE MODAL
   ============================================================ */

document.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key === "Escape"
    ) {

      closeApplicationModal();

    }

  }
);


/* ============================================================
   END
============================================================ */
