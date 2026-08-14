/* =====================================================
   RAJKUMAR ADMIN DASHBOARD JS
===================================================== */


/* =====================================================
   LOGIN BACKEND
===================================================== */

const LOGIN_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx58Oqv9XwQiT--JZ9mnJASOSGsl0yPI3qDWlRZgoS3APcNlCy593wzaKkVzD1ZOSsD6Q/exec";


/* =====================================================
   APPLICATION BACKEND
===================================================== */

const APPLICATION_SCRIPT_URL =
  "PASTE_OLD_APPLICATION_TRACKING_EXEC_URL_HERE";


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
  function() {

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


  if (role !== "admin") {

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
    !APPLICATION_SCRIPT_URL ||
    APPLICATION_SCRIPT_URL ===
    "PASTE_OLD_APPLICATION_TRACKING_EXEC_URL_HERE"
  ) {

    throw new Error(
      "Application backend URL is not configured."
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

          action:
            action,

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


  return await response.json();

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
      function(item) {

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
      function(item) {

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


  document.getElementById(
    "pageTitle"
  ).textContent =
    titles[section] ||
    "Admin Dashboard";


  if (section === "dashboard") {

    loadDashboard();

  }


  if (section === "applications") {

    loadApplications();

  }


  if (section === "retailers") {

    loadRetailers();

  }


  if (section === "services") {

    loadServices();

  }


  if (
    window.innerWidth <= 900
  ) {

    document
      .getElementById(
        "sidebar"
      )
      .classList.remove(
        "open"
      );

  }

}


/* =====================================================
   SECTION BY NAME
===================================================== */

function showSectionByName(
  section
) {

  const button =
    document.querySelector(
      `.nav-item[onclick*="'${section}'"]`
    );


  showSection(
    section,
    button
  );

}


/* =====================================================
   SIDEBAR
===================================================== */

function toggleSidebar() {

  document
    .getElementById(
      "sidebar"
    )
    .classList.toggle(
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


    if (!result.success) {

      throw new Error(
        result.message ||
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
      error
    );

    showToast(
      error.message,
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


    if (!result.success) {

      throw new Error(
        result.message ||
        "Applications loading failed."
      );

    }


    allApplications =
      result.applications || [];


    renderApplications(
      allApplications
    );

  }

  catch (error) {

    console.error(
      error
    );


    table.innerHTML = `

      <tr>

        <td
          colspan="10"
          class="empty-row"
        >
          ${escapeHtml(error.message)}

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


  if (!applications.length) {

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
        function(app, index) {

          return `

            <tr>

              <td>
                <strong>
                  ${escapeHtml(app.applicationId)}
                </strong>
              </td>

              <td>
                ${escapeHtml(app.customerName)}
              </td>

              <td>
                ${escapeHtml(app.mobile)}
              </td>

              <td>
                ${escapeHtml(app.retailerName)}
              </td>

              <td>
                ${escapeHtml(app.service)}
              </td>

              <td>
                ₹${Number(app.amount || 0)}
              </td>

              <td>
                ${statusBadge(app.paymentStatus)}
              </td>

              <td>
                ${statusBadge(app.applicationStatus)}
              </td>

              <td>
                ${escapeHtml(app.applicationDate)}
              </td>

              <td>

                <button
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

  const search =
    document
      .getElementById(
        "applicationSearch"
      )
      .value
      .toLowerCase()
      .trim();


  const payment =
    document
      .getElementById(
        "paymentFilter"
      )
      .value;


  const status =
    document
      .getElementById(
        "statusFilter"
      )
      .value;


  const filtered =
    allApplications.filter(
      function(app) {

        const searchable =
          [
            app.applicationId,
            app.customerName,
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
          app.paymentStatus ===
          payment;


        const statusMatch =
          !status ||
          app.applicationStatus ===
          status;


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
    return;
  }


  const app =
    currentApplication;


  document.getElementById(
    "applicationDetails"
  ).innerHTML = `

    ${detail(
      "Application ID",
      app.applicationId
    )}

    ${detail(
      "Customer Name",
      app.customerName
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
      "₹" + Number(app.amount || 0)
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


  document.getElementById(
    "modalPaymentStatus"
  ).value =
    app.paymentStatus ||
    "Pending";


  document.getElementById(
    "modalApplicationStatus"
  ).value =
    app.applicationStatus ||
    "Pending";


  document.getElementById(
    "modalRemarks"
  ).value =
    app.adminRemarks ||
    "";


  document
    .getElementById(
      "applicationModal"
    )
    .classList.add(
      "active"
    );

}


/* =====================================================
   FILTERED ARRAY
===================================================== */

function getFilteredApplications() {

  const search =
    document
      .getElementById(
        "applicationSearch"
      )
      .value
      .toLowerCase()
      .trim();


  const payment =
    document
      .getElementById(
        "paymentFilter"
      )
      .value;


  const status =
    document
      .getElementById(
        "statusFilter"
      )
      .value;


  return allApplications.filter(
    function(app) {

      const searchable =
        [
          app.applicationId,
          app.customerName,
          app.mobile,
          app.retailerName,
          app.service
        ]
        .join(" ")
        .toLowerCase();


      return (
        (!search ||
          searchable.includes(search)) &&

        (!payment ||
          app.paymentStatus === payment) &&

        (!status ||
          app.applicationStatus === status)
      );

    }
  );

}


/* =====================================================
   SAVE APPLICATION
===================================================== */

async function saveApplicationChanges() {

  if (!currentApplication) {
    return;
  }


  const paymentStatus =
    document.getElementById(
      "modalPaymentStatus"
    ).value;


  const applicationStatus =
    document.getElementById(
      "modalApplicationStatus"
    ).value;


  const remarks =
    document.getElementById(
      "modalRemarks"
    ).value;


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


    if (!paymentResult.success) {

      throw new Error(
        paymentResult.message
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


    if (!statusResult.success) {

      throw new Error(
        statusResult.message
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


    if (!result.success) {

      throw new Error(
        result.message
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

  document
    .getElementById(
      "applicationModal"
    )
    .classList.remove(
      "active"
    );


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


  try {

    const result =
      await apiCall(
        "getRetailers"
      );


    if (!result.success) {

      throw new Error(
        result.message
      );

    }


    const retailers =
      result.retailers || [];


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
          function(retailer) {

            return `

              <tr>

                <td>
                  <strong>
                    ${escapeHtml(retailer.retailerId)}
                  </strong>
                </td>

                <td>
                  ${escapeHtml(retailer.name)}
                </td>

                <td>
                  ${escapeHtml(retailer.mobile)}
                </td>

                <td>
                  ${escapeHtml(retailer.username)}
                </td>

                <td>
                  ${statusBadge(retailer.status)}
                </td>

                <td>
                  ${Number(
                    retailer.totalApplications || 0
                  )}
                </td>

                <td>
                  ${escapeHtml(
                    retailer.lastLogin || "-"
                  )}
                </td>

                <td>

                  <button
                    class="table-action"
                    onclick="toggleRetailerStatus(
                      '${escapeAttribute(
                        retailer.retailerId
                      )}',
                      '${escapeAttribute(
                        retailer.status
                      )}'
                    )"
                  >
                    ${retailer.status === "Active"
                      ? "Deactivate"
                      : "Activate"}
                  </button>

                </td>

              </tr>

            `;

          }
        )
        .join("");

  }

  catch (error) {

    table.innerHTML = `

      <tr>

        <td
          colspan="8"
          class="empty-row"
        >
          ${escapeHtml(error.message)}

        </td>

      </tr>

    `;

  }

}


/* =====================================================
   RETAILER MODAL
===================================================== */

function openRetailerModal() {

  document
    .getElementById(
      "retailerModal"
    )
    .classList.add(
      "active"
    );

}


function closeRetailerModal() {

  document
    .getElementById(
      "retailerModal"
    )
    .classList.remove(
      "active"
    );


  document
    .getElementById(
      "retailerForm"
    )
    .reset();


  document.getElementById(
    "retailerFormMessage"
  ).textContent = "";

}


/* =====================================================
   CREATE RETAILER
===================================================== */

async function createNewRetailer(
  event
) {

  event.preventDefault();


  const name =
    document
      .getElementById(
        "retailerNameInput"
      )
      .value
      .trim();


  const mobile =
    document
      .getElementById(
        "retailerMobileInput"
      )
      .value
      .trim();


  const username =
    document
      .getElementById(
        "retailerUsernameInput"
      )
      .value
      .trim();


  const password =
    document
      .getElementById(
        "retailerPasswordInput"
      )
      .value;


  const button =
    document.getElementById(
      "createRetailerBtn"
    );


  const message =
    document.getElementById(
      "retailerFormMessage"
    );


  button.disabled = true;

  button.textContent =
    "Creating...";


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


    if (!result.success) {

      throw new Error(
        result.message
      );

    }


    message.textContent =
      "Retailer created. ID: " +
      result.retailerId;


    showToast(
      "Retailer created successfully."
    );


    await loadRetailers();


    setTimeout(
      function() {

        closeRetailerModal();

      },
      1200
    );

  }

  catch (error) {

    message.textContent =
      error.message;

    showToast(
      error.message,
      true
    );

  }

  finally {

    button.disabled = false;

    button.textContent =
      "Create Retailer";

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
    currentStatus === "Active"
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


    if (!result.success) {

      throw new Error(
        result.message
      );

    }


    showToast(
      "Retailer status updated."
    );


    await loadRetailers();

  }

  catch (error) {

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


  try {

    const result =
      await apiCall(
        "getServices"
      );


    if (!result.success) {

      throw new Error(
        result.message
      );

    }


    const services =
      result.services || [];


    if (!services.length) {

      grid.innerHTML = `

        <div class="loading-box">

          No active services found.

        </div>

      `;

      return;

    }


    grid.innerHTML =
      services
        .map(
          function(service) {

            return `

              <div class="service-card">

                <h3>
                  ${escapeHtml(
                    service.service
                  )}
                </h3>

                <div class="service-price">
                  ₹${Number(
                    service.price || 0
                  )}
                </div>

                ${statusBadge(
                  service.status
                )}

              </div>

            `;

          }
        )
        .join("");

  }

  catch (error) {

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
   HELPERS
===================================================== */

function setText(
  id,
  value
) {

  const element =
    document.getElementById(id);


  if (element) {

    element.textContent =
      value;

  }

}


function statusBadge(
  status
) {

  const value =
    String(
      status || "Pending"
    );


  const className =
    value
      .toLowerCase()
      .replace(
        /\s+/g,
        "-"
      );


  return `

    <span class="status ${className}">

      ${escapeHtml(value)}

    </span>

  `;

}


function detail(
  label,
  value,
  isLink
) {

  if (
    isLink &&
    value
  ) {

    return `

      <div class="detail-item">

        <span>
          ${escapeHtml(label)}
        </span>

        <strong>

          <a
            href="${escapeAttribute(value)}"
            target="_blank"
            rel="noopener"
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
        ${escapeHtml(label)}
      </span>

      <strong>
        ${escapeHtml(
          value || "-"
        )}
      </strong>

    </div>

  `;

}


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


function escapeAttribute(
  value
) {

  return escapeHtml(
    value
  );

}


function showToast(
  message,
  error = false
) {

  const toast =
    document.getElementById(
      "toast"
    );


  toast.textContent =
    message;


  toast.className =
    "toast show";


  setTimeout(
    function() {

      toast.className =
        "toast";

    },
    3000
  );

}


/* =====================================================
   CLOSE MODAL ON BACKGROUND
===================================================== */

document.addEventListener(
  "click",
  function(event) {

    if (
      event.target.id ===
      "retailerModal"
    ) {

      closeRetailerModal();

    }


    if (
      event.target.id ===
      "applicationModal"
    ) {

      closeApplicationModal();

    }

  }
);