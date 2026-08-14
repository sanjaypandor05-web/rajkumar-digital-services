/* =====================================================
   RAJKUMAR ADMIN DASHBOARD JS
   FINAL CORRECTED VERSION
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


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    checkAdminLogin();

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


  if (
    role !== "admin" &&
    role !== "Admin"
  ) {

    window.location.href =
      "login.html";

    return;

  }


  const adminName =
    localStorage.getItem(
      "rajkumarAdminName"
    ) ||
    "Administrator";


  const nameElement =
    document.getElementById(
      "adminName"
    );


  const welcomeElement =
    document.getElementById(
      "welcomeName"
    );


  if (nameElement) {

    nameElement.textContent =
      adminName;

  }


  if (welcomeElement) {

    welcomeElement.textContent =
      adminName;

  }


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
      section + "Section"
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


  const pageTitle =
    document.getElementById(
      "pageTitle"
    );


  if (pageTitle) {

    pageTitle.textContent =
      titles[section] ||
      "Admin Dashboard";

  }


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


  if (
    section ===
    "services"
  ) {

    loadServices();

  }


  if (
    window.innerWidth <= 900
  ) {

    const sidebar =
      document.getElementById(
        "sidebar"
      );


    if (sidebar) {

      sidebar.classList.remove(
        "open"
      );

    }

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
          "'" + section + "'"
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
   SIDEBAR
===================================================== */

function toggleSidebar() {

  const sidebar =
    document.getElementById(
      "sidebar"
    );


  if (!sidebar) {
    return;
  }


  sidebar.classList.toggle(
    "open"
  );

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
      result.total || 0
    );


    setText(
      "paymentPending",
      result.paymentPending || 0
    );


    setText(
      "paymentVerified",
      result.paymentVerified || 0
    );


    setText(
      "processing",
      result.processing || 0
    );


    setText(
      "completed",
      result.completed || 0
    );


    setText(
      "rejected",
      result.rejected || 0
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

      <td
        colspan="10"
        class="empty-row"
      >
        Loading applications...
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
      allApplications
    );

  }

  catch (error) {

    console.error(
      "Applications Error:",
      error
    );


    table.innerHTML = `

      <tr>

        <td
          colspan="10"
          class="empty-row"
        >
          ${escapeHtml(
            error.message
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

        <td
          colspan="10"
          class="empty-row"
        >
          No applications found.
        </td>

      </tr>

    `;

    return;

  }


  table.innerHTML =
    applications
      .map(
        function (app, index) {

          return `

            <tr>

              <td>
                <strong>
                  ${escapeHtml(
                    app.applicationId ||
                    "-"
                  )}
                </strong>
              </td>

              <td>
                ${escapeHtml(
                  app.customerName ||
                  app.finalName ||
                  app.name ||
                  "-"
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
                ₹${Number(
                  app.amount || 0
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
                  app.applicationDate ||
                  app.date ||
                  "-"
                )}
              </td>

              <td>

                <button
                  type="button"
                  class="table-action"
                  onclick="openApplication(${index})"
                >
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

  const searchElement =
    document.getElementById(
      "applicationSearch"
    );


  const paymentElement =
    document.getElementById(
      "paymentFilter"
    );


  const statusElement =
    document.getElementById(
      "statusFilter"
    );


  const search =
    searchElement
      ? searchElement.value
          .toLowerCase()
          .trim()
      : "";


  const payment =
    paymentElement
      ? paymentElement.value
      : "";


  const status =
    statusElement
      ? statusElement.value
      : "";


  const filtered =
    allApplications.filter(
      function (app) {

        const searchable =
          [

            app.applicationId,

            app.customerName,

            app.finalName,

            app.mobile,

            app.retailerName,

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


  renderApplications(
    filtered
  );

}


/* =====================================================
   GET FILTERED APPLICATIONS
===================================================== */

function getFilteredApplications() {

  const searchElement =
    document.getElementById(
      "applicationSearch"
    );


  const paymentElement =
    document.getElementById(
      "paymentFilter"
    );


  const statusElement =
    document.getElementById(
      "statusFilter"
    );


  const search =
    searchElement
      ? searchElement.value
          .toLowerCase()
          .trim()
      : "";


  const payment =
    paymentElement
      ? paymentElement.value
      : "";


  const status =
    statusElement
      ? statusElement.value
      : "";


  return allApplications.filter(
    function (app) {

      const searchable =
        [

          app.applicationId,

          app.customerName,

          app.finalName,

          app.mobile,

          app.retailerName,

          app.service

        ]
        .join(" ")
        .toLowerCase();


      return (

        (!search ||
          searchable.includes(
            search
          ))

        &&

        (!payment ||
          normalizeStatus(
            app.paymentStatus
          ) ===
          normalizeStatus(
            payment
          ))

        &&

        (!status ||
          normalizeStatus(
            app.applicationStatus
          ) ===
          normalizeStatus(
            status
          ))

      );

    }
  );

}


/* =====================================================
   OPEN APPLICATION
===================================================== */

function openApplication(
  index
) {

  const visibleApps =
    getFilteredApplications();


  currentApplication =
    visibleApps[index];


  if (!currentApplication) {

    showToast(
      "Application not found.",
      true
    );

    return;

  }


  const app =
    currentApplication;


  const details =
    document.getElementById(
      "applicationDetails"
    );


  if (details) {

    details.innerHTML = `

      ${detail(
        "Application ID",
        app.applicationId
      )}

      ${detail(
        "Customer Name",
        app.customerName ||
        app.finalName ||
        app.name
      )}

      ${detail(
        "Mobile",
        app.mobile
      )}

      ${detail(
        "Retailer",
        app.retailerName
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
        "Service",
        app.service
      )}

      ${detail(
        "Amount",
        "₹" +
        Number(
          app.amount || 0
        )
      )}

      ${detail(
        "Transaction ID",
        app.transactionId
      )}

      ${detail(
        "Payment Screenshot",
        app.paymentScreenshot,
        true
      )}

      ${detail(
        "Aadhaar Document",
        app.aadhaarDocument,
        true
      )}

      ${detail(
        "Service Document",
        app.serviceDocument,
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
      app.paymentStatus ||
      "Pending";

  }


  if (applicationSelect) {

    applicationSelect.value =
      app.applicationStatus ||
      "Pending";

  }


  if (remarks) {

    remarks.value =
      app.adminRemarks ||
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
    )?.value ||
    "";


  try {

    const paymentResult =
      await apiCall(
        "updatePaymentStatus",
        {

          applicationId:
            currentApplication.applicationId,

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
            currentApplication.applicationId,

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
      error.message,
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


  const confirmed =
    confirm(
      "Are you sure you want to delete this application?"
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
            currentApplication.applicationId

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
      error.message,
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

      <td
        colspan="8"
        class="empty-row"
      >
        Loading retailers...
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

          <td
            colspan="8"
            class="empty-row"
          >
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


            const newStatus =
              normalizeStatus(
                status
              ) === "active"
                ? "Inactive"
                : "Active";


            return `

              <tr>

                <td>
                  <strong>
                    ${escapeHtml(
                      retailer.retailerId ||
                      "-"
                    )}
                  </strong>
                </td>

                <td>
                  ${escapeHtml(
                    retailer.name ||
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
                        retailer.retailerId
                      )}',
                      '${escapeAttribute(
                        status
                      )}'
                    )"
                  >
                    ${newStatus === "Active"
                      ? "Activate"
                      : "Deactivate"}
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

        <td
          colspan="8"
          class="empty-row"
        >
          ${escapeHtml(
            error.message
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


  const message =
    document.getElementById(
      "retailerFormMessage"
    );


  if (message) {

    message.textContent =
      "";

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


  if (button) {

    button.disabled = true;

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


    if (message) {

      message.textContent =
        "Retailer created. ID: " +
        (
          result.retailerId ||
          "-"
        );

    }


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


    if (message) {

      message.textContent =
        error.message;

    }


    showToast(
      error.message,
      true
    );

  }

  finally {

    if (button) {

      button.disabled =
        false;

      button.textContent =
        "Create Retailer";

    }

  }

}


/* =====================================================
   RETAILER STATUS
===================================================== */

async function toggleRetailerStatus(
  retailerId,
  currentStatus
) {

  const newStatus =
    normalizeStatus(
      currentStatus
    ) === "active"
      ? "Inactive"
      : "Active";


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
      error.message,
      true
    );

  }

}


/* =====================================================
   SERVICES
===================================================== */

async function loadServices() {

  const grid =
    document.getElementById(
      "servicesGrid"
    );


  if (!grid) {
    return;
  }


  grid.innerHTML = `

    <div class="loading-box">

      Loading services...

    </div>

  `;


  try {

    const result =
      await apiCall(
        "getServices"
      );


    if (
      !result ||
      result.success === false
    ) {

      throw new Error(
        result?.message ||
        "Services loading failed."
      );

    }


    const services =
      Array.isArray(
        result.services
      )
        ? result.services
        : [];


    if (!services.length) {

      grid.innerHTML = `

        <div class="loading-box">

          No services found.

        </div>

      `;

      return;

    }


    grid.innerHTML =
      services
        .map(
          function (service) {

            return `

              <div class="service-card">

                <h3>
                  ${escapeHtml(
                    service.service ||
                    service.name ||
                    "-"
                  )}
                </h3>

                <div class="service-price">
                  ₹${Number(
                    service.price || 0
                  )}
                </div>

                ${statusBadge(
                  service.status ||
                  "Active"
                )}

              </div>

            `;

          }
        )
        .join("");

  }

  catch (error) {

    console.error(
      "Services Error:",
      error
    );


    grid.innerHTML = `

      <div class="loading-box">

        ${escapeHtml(
          error.message
        )}

      </div>

    `;

  }

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


  window.location.href =
    "login.html";

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
    ).trim();


  const className =
    value
      .toLowerCase()
      .replace(
        /\s+/g,
        "-"
      );


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
              value
            )}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Document
          </a>

        </strong>

      </div>

    `;

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


  toast.textContent =
    message;


  toast.className =
    "toast show";


  if (error) {

    toast.classList.add(
      "error"
    );

  }


  setTimeout(
    function () {

      toast.className =
        "toast";

    },
    3000
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
   ESC KEY CLOSE MODALS
===================================================== */

document.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key !== "Escape"
    ) {

      return;

    }


    closeRetailerModal();

    closeApplicationModal();

  }
);
