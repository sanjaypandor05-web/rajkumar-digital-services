/* =====================================================
   RAJKUMAR RATIONCARD SERVICES
   FINAL ADMIN DASHBOARD JAVASCRIPT

   ADMIN LOGIN:
   login.js -> adminLogin -> admin.html

   This page does NOT contain another login form.
===================================================== */


/* =====================================================
   GOOGLE APPS SCRIPT URL
===================================================== */

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbw1mKC92_EjWJS_x2o8LMqiL9sssMbFh089IhMujZLd6_9VuujoVckjoMS8fbajVn-uQQ/exec";


/* =====================================================
   GLOBAL DATA
===================================================== */

let allApplications = [];

let filteredApplications = [];


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        checkAdminSession();

        setupForms();

    }
);


/* =====================================================
   ADMIN SESSION CHECK
===================================================== */

function checkAdminSession() {

    const role =
        localStorage.getItem("rajkumarRole");

    const adminId =
        localStorage.getItem("rajkumarAdminId");


    /*
       Admin login વગર admin.html ખોલવામાં આવે
       તો સીધું Home page પર મોકલો.
    */

    if (
        role !== "admin" ||
        !adminId
    ) {

        window.location.replace(
            "index.html"
        );

        return;

    }


    const adminName =
        localStorage.getItem(
            "rajkumarAdminName"
        );


    const welcome =
        document.getElementById(
            "adminWelcomeText"
        );


    if (welcome) {

        welcome.textContent =
            "Welcome, " +
            (
                adminName ||
                adminId ||
                "Administrator"
            );

    }


    /*
       Dashboard load
    */

    loadDashboard();

    loadApplications();

}


/* =====================================================
   API REQUEST
===================================================== */

async function callAPI(payload) {

    const response =
        await fetch(
            SCRIPT_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body: JSON.stringify(
                    payload
                )
            }
        );


    if (!response.ok) {

        throw new Error(
            "HTTP Error " +
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
            "Invalid JSON:",
            text
        );

        throw new Error(
            "Invalid server response."
        );

    }


    return result;

}


/* =====================================================
   LOAD DASHBOARD
===================================================== */

async function loadDashboard() {

    try {

        const result =
            await callAPI({
                action:
                    "loadDashboard"
            });


        if (
            result &&
            result.success
        ) {

            const data =
                result.data ||
                result;


            setText(
                "totalApplications",
                getNumber(
                    data.totalApplications,
                    data.total
                )
            );


            setText(
                "pendingApplications",
                getNumber(
                    data.pendingApplications,
                    data.pending
                )
            );


            setText(
                "paidApplications",
                getNumber(
                    data.paidApplications,
                    data.paymentReceived,
                    data.paid
                )
            );


            setText(
                "processingApplications",
                getNumber(
                    data.processingApplications,
                    data.processing
                )
            );


            setText(
                "completedApplications",
                getNumber(
                    data.completedApplications,
                    data.completed
                )
            );

        }

    }

    catch (error) {

        console.error(
            "Dashboard Load Error:",
            error
        );

    }

}


/* =====================================================
   LOAD APPLICATIONS
===================================================== */

async function loadApplications() {

    const table =
        document.getElementById(
            "applicationsTableBody"
        );


    if (table) {

        table.innerHTML = `
            <tr>
                <td colspan="9"
                    style="
                    text-align:center;
                    padding:30px;
                    color:#777;">
                    🔄 Applications load થઈ રહી છે...
                </td>
            </tr>
        `;

    }


    try {

        const result =
            await callAPI({
                action:
                    "loadApplications"
            });


        console.log(
            "APPLICATION RESULT:",
            result
        );


        if (
            result &&
            result.success === true
        ) {

            allApplications =
                normalizeApplications(
                    result.applications ||
                    result.data ||
                    []
                );

            filteredApplications =
                [...allApplications];

            renderApplications(
                filteredApplications
            );

            return;

        }


        allApplications = [];

        renderApplications([]);

    }

    catch (error) {

        console.error(
            "Application Load Error:",
            error
        );


        if (table) {

            table.innerHTML = `
                <tr>
                    <td colspan="9"
                        style="
                        text-align:center;
                        padding:30px;
                        color:#c62828;">
                        ❌ Applications load કરવામાં error.
                        <br><br>
                        Apps Script deployment check કરો.
                    </td>
                </tr>
            `;

        }

    }

}


/* =====================================================
   NORMALIZE APPLICATIONS
===================================================== */

function normalizeApplications(list) {

    if (!Array.isArray(list)) {

        return [];

    }


    return list.map(
        function (item) {

            if (
                Array.isArray(item)
            ) {

                return {

                    applicationId:
                        item[0] || "",

                    englishName:
                        item[1] || "",

                    gujaratiName:
                        item[2] || "",

                    finalName:
                        item[3] || "",

                    mobile:
                        item[4] || "",

                    nameType:
                        item[5] || "",

                    husbandName:
                        item[6] || "",

                    village:
                        item[7] || "",

                    taluka:
                        item[8] || "",

                    district:
                        item[9] || "",

                    rationCardNumber:
                        item[10] || "",

                    service:
                        item[11] || "",

                    transactionId:
                        item[12] || "",

                    aadhaarFile:
                        item[13] || "",

                    rationFile:
                        item[14] || "",

                    paymentScreenshot:
                        item[15] || "",

                    paymentStatus:
                        item[16] || "",

                    applicationStatus:
                        item[17] || "",

                    date:
                        item[18] || "",

                    whatsapp:
                        item[19] || ""

                };

            }


            return {

                applicationId:
                    item.applicationId ||
                    item.applicationID ||
                    item.id ||
                    "",

                englishName:
                    item.englishName ||
                    item.EnglishName ||
                    "",

                gujaratiName:
                    item.gujaratiName ||
                    item.GujaratiName ||
                    "",

                finalName:
                    item.finalName ||
                    item.FinalName ||
                    "",

                mobile:
                    item.mobile ||
                    item.Mobile ||
                    "",

                nameType:
                    item.nameType ||
                    item.NameType ||
                    "",

                husbandName:
                    item.husbandName ||
                    item.HusbandName ||
                    "",

                village:
                    item.village ||
                    item.Village ||
                    "",

                taluka:
                    item.taluka ||
                    item.Taluka ||
                    "",

                district:
                    item.district ||
                    item.District ||
                    "",

                rationCardNumber:
                    item.rationCardNumber ||
                    item.RationCardNumber ||
                    "",

                service:
                    item.service ||
                    item.Service ||
                    "",

                transactionId:
                    item.transactionId ||
                    item.TransactionId ||
                    "",

                aadhaarFile:
                    item.aadhaarFile ||
                    item.AadhaarFile ||
                    "",

                rationFile:
                    item.rationFile ||
                    item.RationFile ||
                    "",

                paymentScreenshot:
                    item.paymentScreenshot ||
                    item.PaymentScreenshot ||
                    "",

                paymentStatus:
                    item.paymentStatus ||
                    item.PaymentStatus ||
                    "",

                applicationStatus:
                    item.applicationStatus ||
                    item.ApplicationStatus ||
                    item.status ||
                    item.Status ||
                    "",

                date:
                    item.date ||
                    item.Date ||
                    "",

                whatsapp:
                    item.whatsapp ||
                    item.WhatsApp ||
                    ""

            };

        }
    );

}


/* =====================================================
   RENDER APPLICATION TABLE
===================================================== */

function renderApplications(
    applications
) {

    const table =
        document.getElementById(
            "applicationsTableBody"
        );


    if (!table) {

        return;

    }


    if (
        !applications ||
        applications.length === 0
    ) {

        table.innerHTML = `
            <tr>
                <td colspan="9"
                    style="
                    text-align:center;
                    padding:30px;
                    color:#777;">
                    હાલમાં કોઈ application નથી.
                </td>
            </tr>
        `;

        return;

    }


    table.innerHTML =
        applications
            .map(
                function (app, index) {

                    const payment =
                        app.paymentStatus ||
                        "Payment Pending";


                    const status =
                        app.applicationStatus ||
                        "Pending";


                    const amount =
                        getApplicationAmount(
                            app.service
                        );


                    return `
                        <tr>

                            <td>
                                <strong>
                                    ${escapeHtml(
                                        app.applicationId
                                    )}
                                </strong>
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
                                    app.finalName ||
                                    app.gujaratiName ||
                                    app.englishName ||
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
                                    app.service ||
                                    "-"
                                )}
                            </td>

                            <td>
                                ₹${escapeHtml(
                                    amount
                                )}
                            </td>

                            <td>
                                ${statusBadge(
                                    payment
                                )}
                            </td>

                            <td>
                                ${statusBadge(
                                    status
                                )}
                            </td>

                            <td>

                                <button
                                    type="button"
                                    class="action-button view-button"
                                    onclick="viewApplication(${index})">
                                    👁 View
                                </button>

                                <button
                                    type="button"
                                    class="action-button edit-button"
                                    onclick="editApplicationStatus('${escapeAttribute(app.applicationId)}')">
                                    ✏️ Status
                                </button>

                                <button
                                    type="button"
                                    class="action-button delete-button"
                                    onclick="deleteApplication('${escapeAttribute(app.applicationId)}')">
                                    🗑 Delete
                                </button>

                            </td>

                        </tr>
                    `;

                }
            )
            .join("");

}


/* =====================================================
   SEARCH APPLICATIONS
===================================================== */

function searchApplications() {

    const searchInput =
        document.getElementById(
            "applicationSearch"
        );

    const statusFilter =
        document.getElementById(
            "applicationStatusFilter"
        );


    const search =
        (
            searchInput
                ? searchInput.value
                : ""
        )
        .trim()
        .toLowerCase();


    const status =
        statusFilter
            ? statusFilter.value
            : "";


    filteredApplications =
        allApplications.filter(
            function (app) {

                const searchable = [

                    app.applicationId,

                    app.englishName,

                    app.gujaratiName,

                    app.finalName,

                    app.mobile,

                    app.service,

                    app.village,

                    app.rationCardNumber

                ]
                .join(" ")
                .toLowerCase();


                const matchSearch =
                    !search ||
                    searchable.includes(
                        search
                    );


                const currentStatus =
                    normalizeStatus(
                        app.applicationStatus
                    );


                const filterStatus =
                    normalizeStatus(
                        status
                    );


                const matchStatus =
                    !status ||
                    currentStatus ===
                    filterStatus;


                return (
                    matchSearch &&
                    matchStatus
                );

            }
        );


    renderApplications(
        filteredApplications
    );

}


/* =====================================================
   STATUS BADGE
===================================================== */

function statusBadge(status) {

    const normalized =
        normalizeStatus(
            status
        );


    let className =
        "status-pending";


    if (
        normalized.includes("payment") &&
        (
            normalized.includes("received") ||
            normalized.includes("verified")
        )
    ) {

        className =
            "status-paid";

    }

    else if (
        normalized.includes("processing")
    ) {

        className =
            "status-processing";

    }

    else if (
        normalized.includes("completed") ||
        normalized.includes("success")
    ) {

        className =
            "status-completed";

    }

    else if (
        normalized.includes("rejected")
    ) {

        className =
            "status-rejected";

    }


    return `
        <span class="status ${className}">
            ${escapeHtml(
                status || "Pending"
            )}
        </span>
    `;

}


/* =====================================================
   SHOW ADMIN PANEL
===================================================== */

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


    const selected =
        document.getElementById(
            panelId
        );


    if (selected) {

        selected.classList.remove(
            "admin-hidden"
        );

    }


    const menuCards =
        document.querySelectorAll(
            ".admin-menu-card"
        );


    menuCards.forEach(
        function (card) {

            card.classList.remove(
                "active"
            );


            if (
                card.dataset.panel ===
                panelId
            ) {

                card.classList.add(
                    "active"
                );

            }

        }
    );


    window.scrollTo({

        top: 250,

        behavior: "smooth"

    });


    if (
        panelId ===
        "applicationsPanel"
    ) {

        loadApplications();

    }

}


/* =====================================================
   VIEW APPLICATION
===================================================== */

function viewApplication(
    index
) {

    const app =
        filteredApplications[index];


    if (!app) {

        return;

    }


    const details =
        document.getElementById(
            "applicationDetails"
        );


    if (!details) {

        return;

    }


    details.innerHTML = `

        ${detailRow(
            "Application ID",
            app.applicationId
        )}

        ${detailRow(
            "Applicant Name",
            app.finalName ||
            app.gujaratiName ||
            app.englishName
        )}

        ${detailRow(
            "English Name",
            app.englishName
        )}

        ${detailRow(
            "Gujarati Name",
            app.gujaratiName
        )}

        ${detailRow(
            "Mobile",
            app.mobile
        )}

        ${detailRow(
            "Name Type",
            app.nameType
        )}

        ${detailRow(
            "Husband Name",
            app.husbandName
        )}

        ${detailRow(
            "Village",
            app.village
        )}

        ${detailRow(
            "Taluka",
            app.taluka
        )}

        ${detailRow(
            "District",
            app.district
        )}

        ${detailRow(
            "Ration Card Number",
            app.rationCardNumber
        )}

        ${detailRow(
            "Service",
            app.service
        )}

        ${detailRow(
            "Transaction ID",
            app.transactionId
        )}

        ${detailRow(
            "Payment Status",
            app.paymentStatus
        )}

        ${detailRow(
            "Application Status",
            app.applicationStatus
        )}

        ${detailRow(
            "Date",
            app.date
        )}

        ${
            app.aadhaarFile
            ? detailLink(
                "Aadhaar File",
                app.aadhaarFile
            )
            : ""
        }

        ${
            app.rationFile
            ? detailLink(
                "Ration Card File",
                app.rationFile
            )
            : ""
        }

        ${
            app.paymentScreenshot
            ? detailLink(
                "Payment Screenshot",
                app.paymentScreenshot
            )
            : ""
        }

    `;


    const modal =
        document.getElementById(
            "applicationModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

    }

}


/* =====================================================
   DETAIL ROW
===================================================== */

function detailRow(
    label,
    value
) {

    return `
        <div class="detail-row">

            <div class="detail-label">
                ${escapeHtml(label)}
            </div>

            <div class="detail-value">
                ${escapeHtml(
                    value || "-"
                )}
            </div>

        </div>
    `;

}


/* =====================================================
   DETAIL LINK
===================================================== */

function detailLink(
    label,
    url
) {

    return `
        <div class="detail-row">

            <div class="detail-label">
                ${escapeHtml(label)}
            </div>

            <div class="detail-value">

                <a
                    href="${escapeAttribute(url)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    style="
                    color:#0d47a1;
                    font-weight:bold;
                    text-decoration:none;">
                    📂 Open File
                </a>

            </div>

        </div>
    `;

}


/* =====================================================
   CLOSE MODAL
===================================================== */

function closeApplicationModal() {

    const modal =
        document.getElementById(
            "applicationModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


/* =====================================================
   EDIT APPLICATION STATUS
===================================================== */

async function editApplicationStatus(
    applicationId
) {

    if (!applicationId) {

        return;

    }


    const status =
        prompt(
            "Application Status નાખો:\n\n" +
            "Pending\n" +
            "Payment Received\n" +
            "Processing\n" +
            "Completed\n" +
            "Rejected",
            "Processing"
        );


    if (
        status === null
    ) {

        return;

    }


    const cleanStatus =
        status.trim();


    if (!cleanStatus) {

        alert(
            "Status ખાલી રાખી શકાતું નથી."
        );

        return;

    }


    try {

        const result =
            await callAPI({

                action:
                    "updateStatus",

                applicationId:
                    applicationId,

                status:
                    cleanStatus

            });


        if (
            result &&
            result.success
        ) {

            alert(
                "Application Status successfully updated."
            );

            await loadApplications();

            await loadDashboard();

        }

        else {

            alert(
                result &&
                result.message
                    ? result.message
                    : "Status update failed."
            );

        }

    }

    catch (error) {

        console.error(
            "STATUS UPDATE ERROR:",
            error
        );

        alert(
            "Server connection failed."
        );

    }

}


/* =====================================================
   UPDATE PAYMENT STATUS
===================================================== */

async function updatePaymentStatus() {

    const applicationId =
        document.getElementById(
            "paymentApplicationId"
        ).value.trim();


    const paymentStatus =
        document.getElementById(
            "paymentStatusSelect"
        ).value;


    const message =
        document.getElementById(
            "paymentMessage"
        );


    if (!applicationId) {

        showAdminMessage(
            message,
            "Application ID નાખો.",
            "error"
        );

        return;

    }


    if (!paymentStatus) {

        showAdminMessage(
            message,
            "Payment Status પસંદ કરો.",
            "error"
        );

        return;

    }


    showAdminMessage(
        message,
        "Payment update થઈ રહ્યું છે...",
        "loading"
    );


    try {

        const result =
            await callAPI({

                action:
                    "updatePayment",

                applicationId:
                    applicationId,

                paymentStatus:
                    paymentStatus

            });


        if (
            result &&
            result.success
        ) {

            showAdminMessage(
                message,
                "✅ Payment Status successfully updated.",
                "success"
            );


            await loadApplications();

            await loadDashboard();

        }

        else {

            showAdminMessage(
                message,
                result &&
                result.message
                    ? result.message
                    : "Payment update failed.",
                "error"
            );

        }

    }

    catch (error) {

        console.error(
            "PAYMENT ERROR:",
            error
        );


        showAdminMessage(
            message,
            "Server connection failed.",
            "error"
        );

    }

}


/* =====================================================
   DELETE APPLICATION
===================================================== */

async function deleteApplication(
    applicationId
) {

    if (!applicationId) {

        return;

    }


    const confirmed =
        confirm(
            "શું તમે આ Application delete કરવા માંગો છો?\n\n" +
            applicationId
        );


    if (!confirmed) {

        return;

    }


    try {

        const result =
            await callAPI({

                action:
                    "deleteApplication",

                applicationId:
                    applicationId

            });


        if (
            result &&
            result.success
        ) {

            alert(
                "Application successfully deleted."
            );


            await loadApplications();

            await loadDashboard();

        }

        else {

            alert(
                result &&
                result.message
                    ? result.message
                    : "Delete failed."
            );

        }

    }

    catch (error) {

        console.error(
            "DELETE ERROR:",
            error
        );


        alert(
            "Server connection failed."
        );

    }

}


/* =====================================================
   CREATE RETAILER FORM
===================================================== */

function setupForms() {

    const form =
        document.getElementById(
            "createRetailerForm"
        );


    if (form) {

        form.addEventListener(
            "submit",
            createRetailer
        );

    }


    const searchInput =
        document.getElementById(
            "applicationSearch"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Enter"
                ) {

                    event.preventDefault();

                    searchApplications();

                }

            }
        );

    }


    const statusFilter =
        document.getElementById(
            "applicationStatusFilter"
        );


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            searchApplications
        );

    }

}


/* =====================================================
   CREATE RETAILER
===================================================== */

async function createRetailer(
    event
) {

    event.preventDefault();


    const name =
        document.getElementById(
            "newRetailerName"
        ).value.trim();


    const mobile =
        document.getElementById(
            "newRetailerMobile"
        ).value.trim();


    const retailerId =
        document.getElementById(
            "newRetailerId"
        ).value.trim();


    const password =
        document.getElementById(
            "newRetailerPassword"
        ).value;


    const button =
        document.getElementById(
            "createRetailerButton"
        );


    const message =
        document.getElementById(
            "retailerCreateMessage"
        );


    if (
        !name ||
        !mobile ||
        !retailerId ||
        !password
    ) {

        showAdminMessage(
            message,
            "બધી માહિતી ભરો.",
            "error"
        );

        return;

    }


    if (
        !/^[0-9]{10}$/.test(
            mobile
        )
    ) {

        showAdminMessage(
            message,
            "Mobile Number 10 digit હોવો જોઈએ.",
            "error"
        );

        return;

    }


    button.disabled = true;

    button.textContent =
        "Creating...";


    showAdminMessage(
        message,
        "Retailer બનાવવામાં આવી રહ્યો છે...",
        "loading"
    );


    try {

        const result =
            await callAPI({

                action:
                    "createRetailer",

                name:
                    name,

                mobile:
                    mobile,

                retailerId:
                    retailerId,

                password:
                    password

            });


        console.log(
            "CREATE RETAILER:",
            result
        );


        if (
            result &&
            result.success
        ) {

            showAdminMessage(
                message,
                "✅ Retailer successfully created.",
                "success"
            );


            document
                .getElementById(
                    "createRetailerForm"
                )
                .reset();

        }

        else {

            showAdminMessage(
                message,
                result &&
                result.message
                    ? result.message
                    : "Retailer create failed.",
                "error"
            );

        }

    }

    catch (error) {

        console.error(
            "CREATE RETAILER ERROR:",
            error
        );


        showAdminMessage(
            message,
            "Server connection failed.",
            "error"
        );

    }

    finally {

        button.disabled = false;

        button.textContent =
            "➕ Create Retailer";

    }

}


/* =====================================================
   ADMIN LOGOUT
===================================================== */

function adminLogout() {

    const confirmed =
        confirm(
            "શું તમે Admin Logout કરવા માંગો છો?"
        );


    if (!confirmed) {

        return;

    }


    /*
       Remove all admin session keys
    */

    localStorage.removeItem(
        "rajkumarRole"
    );

    localStorage.removeItem(
        "rajkumarAdminId"
    );

    localStorage.removeItem(
        "rajkumarAdminName"
    );


    /*
       કોઈ જૂની admin session હોય
       તો તે પણ clear
    */

    sessionStorage.clear();


    /*
       Home page
    */

    window.location.replace(
        "index.html"
    );

}


/* =====================================================
   CLOSE MODAL ON BACKGROUND CLICK
===================================================== */

document.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "applicationModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeApplicationModal();

        }

    }
);


/* =====================================================
   ESCAPE KEY
===================================================== */

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
            value ?? 0;

    }

}


/* =====================================================
   HELPER - NUMBER
===================================================== */

function getNumber(
    ...values
) {

    for (
        const value of values
    ) {

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {

            const number =
                Number(value);


            if (
                !Number.isNaN(number)
            ) {

                return number;

            }

        }

    }


    return 0;

}


/* =====================================================
   HELPER - NORMALIZE STATUS
===================================================== */

function normalizeStatus(
    value
) {

    return String(
        value || ""
    )
    .trim()
    .toLowerCase()
    .replace(
        /\s+/g,
        " "
    );

}


/* =====================================================
   HELPER - APPLICATION AMOUNT
===================================================== */

function getApplicationAmount(
    service
) {

    const text =
        String(
            service || ""
        )
        .trim()
        .toLowerCase();


    /*
       Current Rajkumar services
    */

    if (
        text.includes("remove") ||
        text.includes("name remove")
    ) {

        return "100";

    }


    if (
        text.includes("add") ||
        text.includes("name add")
    ) {

        return "100";

    }


    if (
        text.includes("correction")
    ) {

        return "200";

    }


    if (
        text.includes("husband")
    ) {

        return "200";

    }


    /*
       Unknown service
    */

    return "0";

}


/* =====================================================
   HELPER - SHOW MESSAGE
===================================================== */

function showAdminMessage(
    element,
    text,
    type
) {

    if (!element) {

        return;

    }


    element.textContent =
        text;


    element.className =
        "admin-message " +
        type;

}


/* =====================================================
   HELPER - HTML SECURITY
===================================================== */

function escapeHtml(
    value
) {

    return String(
        value ?? ""
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
   HELPER - ATTRIBUTE SECURITY
===================================================== */

function escapeAttribute(
    value
) {

    return escapeHtml(
        value
    );

}


/* =====================================================
   PAGE READY LOG
===================================================== */

console.log(
    "RAJKUMAR ADMIN DASHBOARD loaded successfully."
);
