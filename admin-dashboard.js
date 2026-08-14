/* =====================================================
   RAJKUMAR ADMIN DASHBOARD JS
   FINAL CORRECTED + ATTRACTIVE VERSION

   IMPORTANT:
   Services are LOCAL/static.
   No "loadServices" backend action is called.
===================================================== */


/* =====================================================
   GOOGLE APPS SCRIPT URL
===================================================== */

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxcvT9nvNFEnK6dYVoUakpVOQ_9RW2zFnfPmwp0rgcY7e69vKYiRTerE-NcUwuJV7yQjQ/exec";

const LOGIN_SCRIPT_URL = SCRIPT_URL;

const APPLICATION_SCRIPT_URL = SCRIPT_URL;


/* =====================================================
   GLOBAL
===================================================== */

let allApplications = [];

let currentApplication = null;

let currentSection = "dashboard";

let toastTimer = null;


/* =====================================================
   STATIC SERVICES
   NO BACKEND CALL
===================================================== */

const SERVICES = [

  {
    name: "Ration Card Services",
    icon: "🍚"
  },

  {
    name: "PAN Card Services",
    icon: "🪪"
  },

  {
    name: "Recharge Services",
    icon: "📱"
  },

  {
    name: "iKhedut Portal અરજી",
    icon: "🌾"
  },

  {
    name: "PM Kisan Samman Nidhi",
    icon: "👨‍🌾"
  },

  {
    name: "Aadhaar → Mobile Link Check",
    icon: "📲"
  },

  {
    name: "Aadhaar → PAN Link Check",
    icon: "🔗"
  },

  {
    name: "RC PDF Download",
    icon: "📄"
  },

  {
    name: "DL PDF Download",
    icon: "🚗"
  },

  {
    name: "LMS Certificate Apply",
    icon: "🎓"
  }

];


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    checkAdminLogin();

    renderServices();

    setupMobileInput();

  }
);


/* =====================================================
   CHECK ADMIN LOGIN
===================================================== */

function checkAdminLogin() {

  const role =
    localStorage.getItem(
      "rajkumarRole"
    );


  const normalizedRole =
    String(
      role || ""
    )
      .trim()
      .toLowerCase();


  if (
    normalizedRole !== "admin"
  ) {

    window.location.href =
      "login.html";

    return;

  }


  const adminName =
    localStorage.getItem(
      "rajkumarAdminName"
    ) ||
    localStorage.getItem(
      "adminName"
    ) ||
    "Administrator";


  setText(
    "adminName",
    adminName
  );


  setText(
    "welcomeName",
    adminName
  );


  setText(
    "sidebarAdminName",
    adminName
  );


  loadDashboard();

}


/* =====================================================
   API CALL
===================================================== */

async function apiCall(
  action,
  data = {}
) {

  if (
    !APPLICATION_SCRIPT_URL
  ) {

    throw new Error(
      "Backend URL is not configured."
    );

  }


  const response =
    await fetch(
      APPLICATION_SCRIPT_URL,
      {

        method: "POST",

        headers: {
          "Content-Type":
            "text/plain;charset=utf-8"
        },

        body: JSON.stringify({

          action: action,

          ...data

        })

      }
    );


  if (!response.ok) {

    throw new Error(
      "Server error: " +
      response.status
    );

  }


  const text =
    await response.text();


  let result;


  try {

    result =
      JSON.parse(text);

  }

  catch (error) {

    console.error(
      "Invalid server response:",
      text
    );

    throw new Error(
      "Invalid response from Google Apps Script."
    );

  }


  return result;

}


/* =====================================================
   SECTION
===================================================== */

function showSection(
  section,
  button
) {

  currentSection =
    section;


  document
    .querySelectorAll(
      ".page-section"
    )
    .forEach(
      function (item) {

        item.classList.remove(
          "active"
        );

      }
    );


  document
    .querySelectorAll(
      ".nav-item"
    )
    .forEach(
      function (item) {

        item.classList.remove(
          "active"
        );

      }
    );


  const sectionElement =
    document.getElementById(
      section +
      "Section"
    );


  if (sectionElement) {

    sectionElement.classList.add(
      "active"
    );

  }


  if (button) {

    button.classList.add(
      "active"
    );

  }


  const titles = {

    dashboard:
      "Admin Dashboard",

    applications:
      "Applications",

    retailers:
      "Retailers",

    services:
      "Services"

  };


  setText(
    "pageTitle",
    titles[section] ||
    "Admin Dashboard"
  );


  if (
    section ===
    "dashboard"
  ) {

    loadDashboard();

  }


  if (
    section ===
    "applications"
  ) {

    loadApplications();

  }


  if (
    section ===
    "retailers"
  ) {

    loadRetailers();

  }


  /*
   * IMPORTANT:
   * Services are local.
   * Do NOT call any backend action.
   */

  if (
    section ===
    "services"
  ) {

    renderServices();

  }


  if (
    window.innerWidth <= 900
  ) {

    toggleSidebar(false);

  }

}


/* =====================================================
   SECTION BY NAME
===================================================== */

function showSectionByName(
  section
) {

  const buttons =
    document.querySelectorAll(
      ".nav-item"
    );


  let selectedButton =
    null;


  buttons.forEach(
    function (button) {

      const onclick =
        button.getAttribute(
          "onclick"
        ) || "";


      if (
        onclick.includes(
          "'" +
          section +
          "'"
        )
      ) {

        selectedButton =
          button;

      }

    }
  );


  showSection(
    section,
    selectedButton
  );

}


/* =====================================================
   REFRESH CURRENT SECTION
===================================================== */

function refreshCurrentSection() {

  if (
    currentSection ===
    "dashboard"
  ) {

    loadDashboard();

    return;

  }


  if (
    currentSection ===
    "applications"
  ) {

    loadApplications();

    return;

  }


  if (
    currentSection ===
    "retailers"
  ) {

    loadRetailers();

    return;

  }


  if (
    currentSection ===
    "services"
  ) {

    renderServices();

  }

}


/* =====================================================
   SIDEBAR
===================================================== */

function toggleSidebar(
  force
) {

  const sidebar =
    document.getElementById(
      "sidebar"
    );

  const overlay =
    document.getElementById(
      "sidebarOverlay"
    );


  if (!sidebar) {
    return;
  }


  if (
    typeof force ===
    "boolean"
  ) {

    if (force) {

      sidebar.classList.add(
        "open"
      );

      if (overlay) {

        overlay.classList.add(
          "active"
        );

      }

    }

    else {

      sidebar.classList.remove(
        "open"
      );

      if (overlay) {

        overlay.classList.remove(
          "active"
        );

      }

    }

    return;

  }


  const isOpen =
    sidebar.classList.toggle(
      "open"
    );


  if (overlay) {

    overlay.classList.toggle(
      "active",
      isOpen
    );

  }

}


/* =====================================================
   DASHBOARD
===================================================== */

async function loadDashboard() {

  try {

    const result =
      await apiCall(
        "getDashboardStats"
      );


    if (
      !result ||
      result.success === false
    ) {

      throw new Error(
        result?.message ||
        "Dashboard loading failed."
      );

    }


    setText(
      "totalApplications",
      result.total ||
      result.totalApplications ||
      0
    );


    setText(
      "paymentPending",
      result.paymentPending ||
      0
    );


    setText(
      "paymentVerified",
      result.paymentVerified ||
      0
    );


    setText(
      "processing",
      result.processing ||
      0
    );


    setText(
      "completed",
      result.completed ||
      0
    );


    setText(
      "rejected",
      result.rejected ||
      0
    );

  }

  catch (error) {

    console.error(
      "Dashboard Error:",
      error
    );


    showToast(
      error.message ||
      "Dashboard loading failed.",
      true
    );

  }

}


/* =====================================================
   APPLICATIONS
===================================================== */

async function loadApplications() {

  const table =
    document.getElementById(
      "applicationsTable"
    );


  if (!table) {
    return;
  }


  table.innerHTML = `

    <tr>

      <td colspan="10"
          class="empty-row">

        <div class="table-loading">

          <span class="spinner"></span>

          Loading applications...

        </div>

      </td>

    </tr>

  `;


  try {

    const result =
      await apiCall(
        "getAllApplications"
      );


    if (
      !result ||
      result.success === false
    ) {

      throw new Error(
        result?.message ||
        "Applications loading failed."
      );

    }


    allApplications =
      Array.isArray(
        result.applications
      )
        ? result.applications
        : [];


    renderApplications(
      getFilteredApplications()
    );

  }

  catch (error) {

    console.error(
      "Applications Error:",
      error
    );


    table.innerHTML = `

      <tr>

        <td colspan="10"
            class="empty-row">

          ${escapeHtml(
            error.message ||
            "Applications loading failed."
          )}

        </td>

      </tr>

    `;

  }

}


/* =====================================================
   RENDER APPLICATIONS
===================================================== */

function renderApplications(
  applications
) {

  const table =
    document.getElementById(
      "applicationsTable"
    );


  if (!table) {
    return;
  }


  if (
    !applications ||
    !applications.length
  ) {

    table.innerHTML = `

      <tr>

        <td colspan="10"
            class="empty-row">

          No applications found.

        </td>

      </tr>

    `;

    return;

  }


  table.innerHTML =
    applications
      .map(
        function (app) {

          const originalIndex =
            allApplications.indexOf(
              app
            );


          return `

            <tr>

              <td>

                <strong>
                  ${escapeHtml(
                    getApplicationId(app)
                  )}
                </strong>

              </td>


              <td>

                ${escapeHtml(
                  getCustomerName(app)
                )}

              </td>


              <td>

                ${escapeHtml(
                  app.mobile ||
                  "-"
                )}

              </td>


              <td>

                ${escapeHtml(
                  app.retailerName ||
                  app.retailer ||
                  "-"
                )}

              </td>


              <td>

                ${escapeHtml(
                  app.service ||
                  "-"
                )}

              </td>


              <td>

                ₹${formatAmount(
                  app.amount
                )}

              </td>


              <td>

                ${statusBadge(
                  app.paymentStatus
                )}

              </td>


              <td>

                ${statusBadge(
                  app.applicationStatus
                )}

              </td>


              <td>

                ${escapeHtml(
                  getApplicationDate(app)
                )}

              </td>


              <td>

                <button
                  type="button"
                  class="table-action"
                  onclick="openApplicationByIndex(${originalIndex})">

                  View

                </button>

              </td>

            </tr>

          `;

        }
      )
      .join("");

}


/* =====================================================
   FILTER APPLICATIONS
===================================================== */

function filterApplications() {

  renderApplications(
    getFilteredApplications()
  );

}


/* =====================================================
   GET FILTERED APPLICATIONS
===================================================== */

function getFilteredApplications() {

  const search =
    document.getElementById(
      "applicationSearch"
    )?.value
      .toLowerCase()
      .trim() ||
    "";


  const payment =
    document.getElementById(
      "paymentFilter"
    )?.value ||
    "";


  const status =
    document.getElementById(
      "statusFilter"
    )?.value ||
    "";


  return allApplications.filter(
    function (app) {

      const searchable = [

        app.applicationId,
        app.appId,
        app.customerName,
        app.finalName,
        app.name,
        app.mobile,
        app.retailerName,
        app.retailer,
        app.service

      ]
        .join(" ")
        .toLowerCase();


      const searchMatch =
        !search ||
        searchable.includes(
          search
        );


      const paymentMatch =
        !payment ||
        normalizeStatus(
          app.paymentStatus
        ) ===
        normalizeStatus(
          payment
        );


      const statusMatch =
        !status ||
        normalizeStatus(
          app.applicationStatus
        ) ===
        normalizeStatus(
          status
        );


      return (
        searchMatch &&
        paymentMatch &&
        statusMatch
      );

    }
  );

}


/* =====================================================
   OPEN APPLICATION BY INDEX
===================================================== */

function openApplicationByIndex(
  index
) {

  currentApplication =
    allApplications[index];


  if (!currentApplication) {

    showToast(
      "Application not found.",
      true
    );

    return;

  }


  openCurrentApplication();

}


/* =====================================================
   BACKWARD COMPATIBILITY
===================================================== */

function openApplication(
  index
) {

  const visibleApps =
    getFilteredApplications();


  const app =
    visibleApps[index];


  if (!app) {

    showToast(
      "Application not found.",
      true
    );

    return;

  }


  currentApplication =
    app;


  openCurrentApplication();

}


/* =====================================================
   OPEN CURRENT APPLICATION
===================================================== */

function openCurrentApplication() {

  const app =
    currentApplication;


  if (!app) {
    return;
  }


  const details =
    document.getElementById(
      "applicationDetails"
    );


  if (details) {

    details.innerHTML = `

      ${detail(
        "Application ID",
        getApplicationId(app)
      )}

      ${detail(
        "Customer Name",
        getCustomerName(app)
      )}

      ${detail(
        "Mobile",
        app.mobile
      )}

      ${detail(
        "Retailer",
        app.retailerName ||
        app.retailer
      )}

      ${detail(
        "Village",
        app.village
      )}

      ${detail(
        "Taluka",
        app.taluka
      )}

      ${detail(
        "District",
        app.district
      )}

      ${detail(
        "Ration Card Number",
        app.rationCardNumber
      )}

      ${detail(
        "Service",
        app.service
      )}

      ${detail(
        "Amount",
        "₹" +
        formatAmount(
          app.amount
        )
      )}

      ${detail(
        "Transaction ID",
        app.transactionId ||
        app.transactionID
      )}

      ${detail(
        "Application Date",
        getApplicationDate(app)
      )}

      ${detail(
        "Payment Screenshot",
        app.paymentScreenshot ||
        app.paymentScreenshotUrl,
        true
      )}

      ${detail(
        "Aadhaar Document",
        app.aadhaarDocument ||
        app.aadhaarFile,
        true
      )}

      ${detail(
        "Ration / Service Document",
        app.serviceDocument ||
        app.rationFile ||
        app.serviceFile,
        true
      )}

    `;

  }


  const paymentSelect =
    document.getElementById(
      "modalPaymentStatus"
    );


  const applicationSelect =
    document.getElementById(
      "modalApplicationStatus"
    );


  const remarks =
    document.getElementById(
      "modalRemarks"
    );


  if (paymentSelect) {

    paymentSelect.value =
      normalizeSelectValue(
        app.paymentStatus,
        [
          "Pending",
          "Verified",
          "Failed"
        ],
        "Pending"
      );

  }


  if (applicationSelect) {

    applicationSelect.value =
      normalizeSelectValue(
        app.applicationStatus,
        [
          "Pending",
          "Processing",
          "Completed",
          "Rejected"
        ],
        "Pending"
      );

  }


  if (remarks) {

    remarks.value =
      app.adminRemarks ||
      app.remarks ||
      "";

  }


  const modal =
    document.getElementById(
      "applicationModal"
    );


  if (modal) {

    modal.classList.add(
      "active"
    );

  }

}


/* =====================================================
   SAVE APPLICATION
===================================================== */

async function saveApplicationChanges() {

  if (!currentApplication) {

    showToast(
      "No application selected.",
      true
    );

    return;

  }


  const paymentStatus =
    document.getElementById(
      "modalPaymentStatus"
    )?.value ||
    "Pending";


  const applicationStatus =
    document.getElementById(
      "modalApplicationStatus"
    )?.value ||
    "Pending";


  const remarks =
    document.getElementById(
      "modalRemarks"
    )?.value
      .trim() ||
    "";


  const applicationId =
    getApplicationId(
      currentApplication
    );


  if (!applicationId) {

    showToast(
      "Application ID is missing.",
      true
    );

    return;

  }


  try {

    const paymentResult =
      await apiCall(
        "updatePaymentStatus",
        {

          applicationId:
            applicationId,

          paymentStatus:
            paymentStatus,

          remarks:
            remarks

        }
      );


    if (
      !paymentResult ||
      paymentResult.success === false
    ) {

      throw new Error(
        paymentResult?.message ||
        "Payment status update failed."
      );

    }


    const statusResult =
      await apiCall(
        "updateApplicationStatus",
        {

          applicationId:
            applicationId,

          applicationStatus:
            applicationStatus,

          remarks:
            remarks

        }
      );


    if (
      !statusResult ||
      statusResult.success === false
    ) {

      throw new Error(
        statusResult?.message ||
        "Application status update failed."
      );

    }


    showToast(
      "Application updated successfully."
    );


    closeApplicationModal();


    await loadApplications();

    await loadDashboard();

  }

  catch (error) {

    console.error(
      "Save Application Error:",
      error
    );


    showToast(
      error.message ||
      "Application update failed.",
      true
    );

  }

}


/* =====================================================
   DELETE APPLICATION
===================================================== */

async function deleteCurrentApplication() {

  if (!currentApplication) {
    return;
  }


  const applicationId =
    getApplicationId(
      currentApplication
    );


  const confirmed =
    confirm(
      "Are you sure you want to delete application " +
      applicationId +
      "?"
    );


  if (!confirmed) {
    return;
  }


  try {

    const result =
      await apiCall(
        "deleteApplication",
        {

          applicationId:
            applicationId

        }
      );


    if (
      !result ||
      result.success === false
    ) {

      throw new Error(
        result?.message ||
        "Delete failed."
      );

    }


    showToast(
      "Application deleted successfully."
    );


    closeApplicationModal();


    await loadApplications();

    await loadDashboard();

  }

  catch (error) {

    console.error(
      "Delete Error:",
      error
    );


    showToast(
      error.message ||
      "Delete failed.",
      true
    );

  }

}


/* =====================================================
   CLOSE APPLICATION MODAL
===================================================== */

function closeApplicationModal() {

  const modal =
    document.getElementById(
      "applicationModal"
    );


  if (modal) {

    modal.classList.remove(
      "active"
    );

  }


  currentApplication =
    null;

}


/* =====================================================
   RETAILERS
===================================================== */

async function loadRetailers() {

  const table =
    document.getElementById(
      "retailersTable"
    );


  if (!table) {
    return;
  }


  table.innerHTML = `

    <tr>

      <td colspan="8"
          class="empty-row">

        <div class="table-loading">

          <span class="spinner"></span>

          Loading retailers...

        </div>

      </td>

    </tr>

  `;


  try {

    const result =
      await apiCall(
        "getRetailers"
      );


    if (
      !result ||
      result.success === false
    ) {

      throw new Error(
        result?.message ||
        "Retailers loading failed."
      );

    }


    const retailers =
      Array.isArray(
        result.retailers
      )
        ? result.retailers
        : [];


    if (!retailers.length) {

      table.innerHTML = `

        <tr>

          <td colspan="8"
              class="empty-row">

            No retailers found.

          </td>

        </tr>

      `;

      return;

    }


    table.innerHTML =
      retailers
        .map(
          function (retailer) {

            const status =
              retailer.status ||
              "Inactive";


            const isActive =
              normalizeStatus(
                status
              ) ===
              "active";


            const newStatus =
              isActive
                ? "Inactive"
                : "Active";


            const actionText =
              isActive
                ? "Deactivate"
                : "Activate";


            return `

              <tr>

                <td>

                  <strong>
                    ${escapeHtml(
                      retailer.retailerId ||
                      retailer.id ||
                      "-"
                    )}
                  </strong>

                </td>


                <td>

                  ${escapeHtml(
                    retailer.name ||
                    retailer.retailerName ||
                    "-"
                  )}

                </td>


                <td>

                  ${escapeHtml(
                    retailer.mobile ||
                    "-"
                  )}

                </td>


                <td>

                  ${escapeHtml(
                    retailer.username ||
                    "-"
                  )}

                </td>


                <td>

                  ${statusBadge(
                    status
                  )}

                </td>


                <td>

                  ${Number(
                    retailer.totalApplications ||
                    retailer.applicationCount ||
                    0
                  )}

                </td>


                <td>

                  ${escapeHtml(
                    retailer.lastLogin ||
                    "-"
                  )}

                </td>


                <td>

                  <button
                    type="button"
                    class="table-action"
                    onclick="toggleRetailerStatus(
                      '${escapeAttribute(
                        retailer.retailerId ||
                        retailer.id ||
                        ""
                      )}',
                      '${escapeAttribute(
                        status
                      )}'
                    )">

                    ${actionText}

                  </button>

                </td>

              </tr>

            `;

          }
        )
        .join("");

  }

  catch (error) {

    console.error(
      "Retailer Error:",
      error
    );


    table.innerHTML = `

      <tr>

        <td colspan="8"
            class="empty-row">

          ${escapeHtml(
            error.message ||
            "Retailers loading failed."
          )}

        </td>

      </tr>

    `;

  }

}


/* =====================================================
   RETAILER MODAL
===================================================== */

function openRetailerModal() {

  const modal =
    document.getElementById(
      "retailerModal"
    );


  if (modal) {

    modal.classList.add(
      "active"
    );

  }

}


function closeRetailerModal() {

  const modal =
    document.getElementById(
      "retailerModal"
    );


  if (modal) {

    modal.classList.remove(
      "active"
    );

  }


  const form =
    document.getElementById(
      "retailerForm"
    );


  if (form) {

    form.reset();

  }


  const password =
    document.getElementById(
      "retailerPasswordInput"
    );


  if (password) {

    password.type =
      "password";

  }


  const toggle =
    document.getElementById(
      "passwordToggle"
    );


  if (toggle) {

    toggle.textContent =
      "👁️";

  }


  const message =
    document.getElementById(
      "retailerFormMessage"
    );


  if (message) {

    message.textContent =
      "";

    message.className =
      "form-message";

  }

}


/* =====================================================
   PASSWORD VISIBILITY
===================================================== */

function togglePasswordVisibility() {

  const input =
    document.getElementById(
      "retailerPasswordInput"
    );


  const button =
    document.getElementById(
      "passwordToggle"
    );


  if (!input) {
    return;
  }


  if (
    input.type ===
    "password"
  ) {

    input.type =
      "text";


    if (button) {

      button.textContent =
        "🙈";

    }

  }

  else {

    input.type =
      "password";


    if (button) {

      button.textContent =
        "👁️";

    }

  }

}


/* =====================================================
   CREATE RETAILER
===================================================== */

async function createNewRetailer(
  event
) {

  event.preventDefault();


  const name =
    document.getElementById(
      "retailerNameInput"
    )?.value
      .trim() ||
    "";


  const mobile =
    document.getElementById(
      "retailerMobileInput"
    )?.value
      .trim() ||
    "";


  const username =
    document.getElementById(
      "retailerUsernameInput"
    )?.value
      .trim() ||
    "";


  const password =
    document.getElementById(
      "retailerPasswordInput"
    )?.value ||
    "";


  const button =
    document.getElementById(
      "createRetailerBtn"
    );


  const message =
    document.getElementById(
      "retailerFormMessage"
    );


  if (!name) {

    showFormMessage(
      "Please enter retailer name.",
      true
    );

    return;

  }


  if (
    mobile &&
    !/^[0-9]{10}$/.test(
      mobile
    )
  ) {

    showFormMessage(
      "Please enter a valid 10 digit mobile number.",
      true
    );

    return;

  }


  if (!username) {

    showFormMessage(
      "Please enter username.",
      true
    );

    return;

  }


  if (!password) {

    showFormMessage(
      "Please enter password.",
      true
    );

    return;

  }


  if (button) {

    button.disabled =
      true;

    button.textContent =
      "Creating...";

  }


  try {

    const result =
      await apiCall(
        "createRetailer",
        {

          name:
            name,

          mobile:
            mobile,

          username:
            username,

          password:
            password

        }
      );


    if (
      !result ||
      result.success === false
    ) {

      throw new Error(
        result?.message ||
        "Retailer creation failed."
      );

    }


    showFormMessage(
      "Retailer created successfully. ID: " +
      (
        result.retailerId ||
        "-"
      )
    );


    showToast(
      "Retailer created successfully."
    );


    await loadRetailers();


    setTimeout(
      function () {

        closeRetailerModal();

      },
      1200
    );

  }

  catch (error) {

    console.error(
      "Create Retailer Error:",
      error
    );


    showFormMessage(
      error.message ||
      "Retailer creation failed.",
      true
    );


    showToast(
      error.message ||
      "Retailer creation failed.",
      true
    );

  }

  finally {

    if (button) {

      button.disabled =
        false;

      button.textContent =
        "➕ Create Retailer";

    }

  }

}


/* =====================================================
   SHOW FORM MESSAGE
===================================================== */

function showFormMessage(
  message,
  error = false
) {

  const element =
    document.getElementById(
      "retailerFormMessage"
    );


  if (!element) {
    return;
  }


  element.textContent =
    message;


  element.className =
    error
      ? "form-message error"
      : "form-message";

}


/* =====================================================
   RETAILER STATUS
===================================================== */

async function toggleRetailerStatus(
  retailerId,
  currentStatus
) {

  if (!retailerId) {

    showToast(
      "Retailer ID is missing.",
      true
    );

    return;

  }


  const newStatus =
    normalizeStatus(
      currentStatus
    ) ===
    "active"
      ? "Inactive"
      : "Active";


  const confirmed =
    confirm(
      "Change retailer status to " +
      newStatus +
      "?"
    );


  if (!confirmed) {
    return;
  }


  try {

    const result =
      await apiCall(
        "updateRetailerStatus",
        {

          retailerId:
            retailerId,

          status:
            newStatus

        }
      );


    if (
      !result ||
      result.success === false
    ) {

      throw new Error(
        result?.message ||
        "Retailer status update failed."
      );

    }


    showToast(
      "Retailer status updated."
    );


    await loadRetailers();

  }

  catch (error) {

    console.error(
      "Retailer Status Error:",
      error
    );


    showToast(
      error.message ||
      "Retailer status update failed.",
      true
    );

  }

}


/* =====================================================
   SERVICES
   LOCAL ONLY
===================================================== */

function renderServices() {

  const grid =
    document.getElementById(
      "servicesGrid"
    );


  if (!grid) {
    return;
  }


  const count =
    document.getElementById(
      "serviceCount"
    );


  if (count) {

    count.textContent =
      SERVICES.length +
      " Services";

  }


  grid.innerHTML =
    SERVICES
      .map(
        function (service, index) {

          return `

            <div class="service-card">

              <div class="service-number">
                SERVICE ${String(
                  index + 1
                ).padStart(2, "0")}
              </div>

              <div style="
                font-size:30px;
                margin-bottom:10px;
              ">
                ${service.icon}
              </div>

              <h3>
                ${escapeHtml(
                  service.name
                )}
              </h3>

              <div class="service-price">
                Available on Rajkumar Website
              </div>

              <span class="status active">
                Active
              </span>

            </div>

          `;

        }
      )
      .join("");

}


/* =====================================================
   LOGOUT
===================================================== */

function logoutAdmin() {

  const confirmed =
    confirm(
      "Are you sure you want to logout?"
    );


  if (!confirmed) {
    return;
  }


  localStorage.removeItem(
    "rajkumarRole"
  );


  localStorage.removeItem(
    "rajkumarAdminId"
  );


  localStorage.removeItem(
    "rajkumarAdminName"
  );


  localStorage.removeItem(
    "adminName"
  );


  sessionStorage.clear();


  window.location.replace(
    "login.html"
  );

}


/* =====================================================
   APPLICATION HELPERS
===================================================== */

function getApplicationId(
  app
) {

  return (
    app?.applicationId ||
    app?.applicationID ||
    app?.appId ||
    app?.id ||
    ""
  );

}


function getCustomerName(
  app
) {

  return (
    app?.customerName ||
    app?.finalName ||
    app?.englishName ||
    app?.name ||
    "-"
  );

}


function getApplicationDate(
  app
) {

  return (
    app?.applicationDate ||
    app?.date ||
    app?.createdAt ||
    "-"
  );

}


function formatAmount(
  amount
) {

  const number =
    Number(
      amount || 0
    );


  if (
    Number.isNaN(
      number
    )
  ) {

    return "0";

  }


  return number.toLocaleString(
    "en-IN"
  );

}


/* =====================================================
   NORMALIZE SELECT
===================================================== */

function normalizeSelectValue(
  value,
  allowed,
  fallback
) {

  const normalized =
    normalizeStatus(
      value
    );


  const match =
    allowed.find(
      function (item) {

        return (
          normalizeStatus(
            item
          ) ===
          normalized
        );

      }
    );


  return match ||
    fallback;

}


/* =====================================================
   HELPER - SET TEXT
===================================================== */

function setText(
  id,
  value
) {

  const element =
    document.getElementById(
      id
    );


  if (element) {

    element.textContent =
      value;

  }

}


/* =====================================================
   HELPER - STATUS NORMALIZE
===================================================== */

function normalizeStatus(
  status
) {

  return String(
    status || ""
  )
    .trim()
    .toLowerCase();

}


/* =====================================================
   HELPER - STATUS BADGE
===================================================== */

function statusBadge(
  status
) {

  const value =
    String(
      status ||
      "Pending"
    )
      .trim();


  let className =
    value
      .toLowerCase()
      .replace(
        /\s+/g,
        "-"
      );


  if (
    className ===
    "success"
  ) {

    className =
      "completed";

  }


  if (
    className ===
    "complete"
  ) {

    className =
      "completed";

  }


  return `

    <span class="status ${className}">

      ${escapeHtml(
        value
      )}

    </span>

  `;

}


/* =====================================================
   HELPER - DETAIL
===================================================== */

function detail(
  label,
  value,
  isLink = false
) {

  if (
    isLink &&
    value
  ) {

    const safeUrl =
      String(
        value
      ).trim();


    if (
      /^https?:\/\//i.test(
        safeUrl
      )
    ) {

      return `

        <div class="detail-item">

          <span>
            ${escapeHtml(
              label
            )}
          </span>

          <strong>

            <a
              href="${escapeAttribute(
                safeUrl
              )}"
              target="_blank"
              rel="noopener noreferrer">

              Open Document ↗

            </a>

          </strong>

        </div>

      `;

    }

  }


  return `

    <div class="detail-item">

      <span>
        ${escapeHtml(
          label
        )}
      </span>

      <strong>
        ${escapeHtml(
          value ||
          "-"
        )}
      </strong>

    </div>

  `;

}


/* =====================================================
   HELPER - ESCAPE HTML
===================================================== */

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


/* =====================================================
   HELPER - ESCAPE ATTRIBUTE
===================================================== */

function escapeAttribute(
  value
) {

  return escapeHtml(
    value
  );

}


/* =====================================================
   TOAST
===================================================== */

function showToast(
  message,
  error = false
) {

  const toast =
    document.getElementById(
      "toast"
    );


  if (!toast) {
    return;
  }


  if (toastTimer) {

    clearTimeout(
      toastTimer
    );

  }


  toast.textContent =
    message;


  toast.className =
    "toast show";


  if (error) {

    toast.classList.add(
      "error"
    );

  }


  toastTimer =
    setTimeout(
      function () {

        toast.className =
          "toast";

      },
      3500
    );

}


/* =====================================================
   MOBILE INPUT
===================================================== */

function setupMobileInput() {

  const mobile =
    document.getElementById(
      "retailerMobileInput"
    );


  if (!mobile) {
    return;
  }


  mobile.addEventListener(
    "input",
    function () {

      this.value =
        this.value
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

}


/* =====================================================
   CLOSE MODALS ON BACKGROUND CLICK
===================================================== */

document.addEventListener(
  "click",
  function (event) {

    if (
      event.target &&
      event.target.id ===
      "retailerModal"
    ) {

      closeRetailerModal();

    }


    if (
      event.target &&
      event.target.id ===
      "applicationModal"
    ) {

      closeApplicationModal();

    }

  }
);


/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key !==
      "Escape"
    ) {

      return;

    }


    closeRetailerModal();

    closeApplicationModal();

    toggleSidebar(false);

  }
);
