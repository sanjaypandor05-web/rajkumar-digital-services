/* =========================================================
   RAJKUMAR RATIONCARD SERVICES
   FINAL ADMIN JAVASCRIPT
   Compatible with current Code.gs
========================================================= */


/* =========================================================
   IMPORTANT
   અહીં તમારો Google Apps Script Web App /exec URL મૂકો.
========================================================= */

const API_URL =
    "https://script.google.com/macros/s/AKfycbzsFEWN6DUVclqWm9zE2TAzAWT22KqeVTkLqCWG9a6LpR1V6vzHKJozmwlL6g1qsBtXaw/exec";


/* =========================================================
   GLOBAL DATA
========================================================= */

let allApplications = [];

let isAdminLoggedIn = false;


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupLoginForm();

        setupRetailerForm();

        setupSearchEvents();

        checkAdminSession();

    }
);


/* =========================================================
   API REQUEST
========================================================= */

async function apiRequest(
    action,
    data = {}
) {

    if (
        !API_URL ||
        API_URL.includes(
            "PASTE_YOUR"
        )
    ) {

        throw new Error(
            "Google Apps Script Web App URL admin.js માં set કરો."
        );

    }


    const payload = {

        action:
            action,

        ...data

    };


    const response =
        await fetch(
            API_URL,
            {

                method:
                    "POST",

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


    if (
        !response.ok
    ) {

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
            JSON.parse(
                text
            );

    } catch (error) {

        throw new Error(
            "Server તરફથી invalid response મળ્યો."
        );

    }


    return result;

}


/* =========================================================
   LOGIN FORM
========================================================= */

function setupLoginForm() {

    const form =
        document.getElementById(
            "adminLoginForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            await adminLogin();

        }
    );

}


/* =========================================================
   ADMIN LOGIN
========================================================= */

async function adminLogin() {

    const username =
        document
            .getElementById(
                "adminId"
            )
            .value
            .trim();


    const password =
        document
            .getElementById(
                "adminPassword"
            )
            .value;


    const message =
        document.getElementById(
            "adminLoginMessage"
        );


    const button =
        document.getElementById(
            "adminLoginButton"
        );


    if (
        !username ||
        !password
    ) {

        showMessage(
            message,
            "Admin ID અને Password બંને જરૂરી છે.",
            false
        );

        return;

    }


    button.disabled = true;

    button.textContent =
        "⏳ Login થઈ રહ્યું છે...";


    try {

        const result =
            await apiRequest(
                "adminLogin",
                {

                    username:
                        username,

                    password:
                        password

                }
            );


        if (
            result &&
            result.success === true
        ) {

            isAdminLoggedIn =
                true;


            sessionStorage.setItem(
                "rajkumarAdminLoggedIn",
                "true"
            );


            sessionStorage.setItem(
                "rajkumarAdminRole",
                "admin"
            );


            message.className =
                "admin-login-message message-success";


            message.textContent =
                "✅ Login Successful";


            setTimeout(
                function () {

                    showDashboard();

                },
                300
            );


        } else {

            showMessage(
                message,
                result.message ||
                "Invalid admin username or password.",
                false
            );

        }


    } catch (error) {

        showMessage(
            message,
            "❌ " +
            error.message,
            false
        );

    } finally {

        button.disabled = false;

        button.textContent =
            "🔐 Login";

    }

}


/* =========================================================
   CHECK SESSION
========================================================= */

function checkAdminSession() {

    const loggedIn =
        sessionStorage.getItem(
            "rajkumarAdminLoggedIn"
        );


    const role =
        sessionStorage.getItem(
            "rajkumarAdminRole"
        );


    if (
        loggedIn === "true" &&
        role === "admin"
    ) {

        isAdminLoggedIn =
            true;

        showDashboard();

    } else {

        showLogin();

    }

}


/* =========================================================
   SHOW LOGIN
========================================================= */

function showLogin() {

    const login =
        document.getElementById(
            "adminLoginSection"
        );


    const dashboard =
        document.getElementById(
            "adminDashboardSection"
        );


    if (login) {

        login.classList.remove(
            "admin-hidden"
        );

    }


    if (dashboard) {

        dashboard.classList.add(
            "admin-hidden"
        );

    }

}


/* =========================================================
   SHOW DASHBOARD
========================================================= */

async function showDashboard() {

    const login =
        document.getElementById(
            "adminLoginSection"
        );


    const dashboard =
        document.getElementById(
            "adminDashboardSection"
        );


    if (login) {

        login.classList.add(
            "admin-hidden"
        );

    }


    if (dashboard) {

        dashboard.classList.remove(
            "admin-hidden"
        );

    }


    await loadDashboard();

}


/* =========================================================
   LOAD DASHBOARD
========================================================= */

async function loadDashboard() {

    if (!isAdminLoggedIn) {

        return;

    }


    const tbody =
        document.getElementById(
            "applicationsTableBody"
        );


    if (tbody) {

        tbody.innerHTML = `
            <tr>
                <td colspan="9"
                    style="text-align:center;padding:30px;color:#777;">
                    ⏳ Applications loading...
                </td>
            </tr>
        `;

    }


    try {

        const result =
            await apiRequest(
                "getAllApplications"
            );


        if (
            !result ||
            result.success !== true
        ) {

            throw new Error(
                result.message ||
                "Applications load થઈ શકી નથી."
            );

        }


        allApplications =
            Array.isArray(
                result.applications
            )
                ? result.applications
                : [];


        updateStatistics(
            allApplications
        );


        renderApplications(
            allApplications
        );


    } catch (error) {

        if (tbody) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="9"
                        style="text-align:center;padding:30px;color:#c62828;">
                        ❌ ${escapeHtml(error.message)}
                    </td>
                </tr>
            `;

        }

    }

}


/* =========================================================
   UPDATE STATISTICS
========================================================= */

function updateStatistics(
    applications
) {

    const total =
        applications.length;


    const pending =
        applications.filter(
            function (app) {

                const status =
                    normalize(
                        app.applicationStatus
                    );

                return (
                    status === "submitted" ||
                    status === "pending"
                );

            }
        ).length;


    const paid =
        applications.filter(
            function (app) {

                const status =
                    normalize(
                        app.paymentStatus
                    );

                return (
                    status === "payment received" ||
                    status === "payment verified" ||
                    status === "paid"
                );

            }
        ).length;


    const processing =
        applications.filter(
            function (app) {

                return (
                    normalize(
                        app.applicationStatus
                    ) ===
                    "processing"
                );

            }
        ).length;


    const completed =
        applications.filter(
            function (app) {

                return (
                    normalize(
                        app.applicationStatus
                    ) ===
                    "completed"
                );

            }
        ).length;


    setText(
        "totalApplications",
        total
    );


    setText(
        "pendingApplications",
        pending
    );


    setText(
        "paidApplications",
        paid
    );


    setText(
        "processingApplications",
        processing
    );


    setText(
        "completedApplications",
        completed
    );

}


/* =========================================================
   RENDER APPLICATIONS
========================================================= */

function renderApplications(
    applications
) {

    const tbody =
        document.getElementById(
            "applicationsTableBody"
        );


    if (!tbody) return;


    if (
        !applications.length
    ) {

        tbody.innerHTML = `
            <tr>
                <td colspan="9"
                    style="text-align:center;padding:35px;color:#777;">
                    📭 હાલમાં કોઈ application નથી.
                </td>
            </tr>
        `;

        return;

    }


    tbody.innerHTML =
        applications
            .map(
                function (app) {

                    return `
                        <tr>

                            <td>
                                <strong>
                                    ${escapeHtml(
                                        app.applicationId || "-"
                                    )}
                                </strong>
                            </td>

                            <td>
                                ${escapeHtml(
                                    app.retailerId || "-"
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    app.applicant ||
                                    app.englishName ||
                                    "-"
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    app.mobile || "-"
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    app.service || "-"
                                )}
                            </td>

                            <td>
                                ₹${formatAmount(
                                    app.amount
                                )}
                            </td>

                            <td>
                                ${statusBadge(
                                    app.paymentStatus,
                                    "payment"
                                )}
                            </td>

                            <td>
                                ${statusBadge(
                                    app.applicationStatus,
                                    "application"
                                )}
                            </td>

                            <td>

                                <button
                                    class="action-button view-button"
                                    onclick="viewApplication('${escapeJs(
                                        app.applicationId
                                    )}')">

                                    👁 View

                                </button>

                                <button
                                    class="action-button status-button"
                                    onclick="changeApplicationStatus('${escapeJs(
                                        app.applicationId
                                    )}')">

                                    ⚙ Status

                                </button>

                            </td>

                        </tr>
                    `;

                }
            )
            .join("");

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearchEvents() {

    const search =
        document.getElementById(
            "applicationSearch"
        );


    const filter =
        document.getElementById(
            "applicationStatusFilter"
        );


    if (search) {

        search.addEventListener(
            "input",
            searchApplications
        );

    }


    if (filter) {

        filter.addEventListener(
            "change",
            searchApplications
        );

    }

}


/* =========================================================
   SEARCH APPLICATIONS
========================================================= */

function searchApplications() {

    const search =
        normalize(
            document.getElementById(
                "applicationSearch"
            )?.value
        );


    const filter =
        normalize(
            document.getElementById(
                "applicationStatusFilter"
            )?.value
        );


    const filtered =
        allApplications.filter(
            function (app) {

                const text = [

                    app.applicationId,

                    app.applicant,

                    app.englishName,

                    app.gujaratiName,

                    app.mobile,

                    app.retailerId,

                    app.service

                ]
                    .join(" ")
                    .toLowerCase();


                const matchesSearch =
                    !search ||
                    text.includes(
                        search
                    );


                const matchesStatus =
                    !filter ||
                    normalize(
                        app.applicationStatus
                    ) === filter;


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


/* =========================================================
   VIEW APPLICATION
========================================================= */

function viewApplication(
    applicationId
) {

    const app =
        allApplications.find(
            function (item) {

                return String(
                    item.applicationId
                )
                    .toUpperCase() ===
                    String(
                        applicationId
                    )
                        .toUpperCase();

            }
        );


    if (!app) {

        alert(
            "Application not found."
        );

        return;

    }


    const details =
        document.getElementById(
            "applicationDetails"
        );


    if (!details) return;


    details.innerHTML = `

        <div class="detail-grid">

            ${detail(
                "Application ID",
                app.applicationId
            )}

            ${detail(
                "Date",
                app.date
            )}

            ${detail(
                "Retailer ID",
                app.retailerId
            )}

            ${detail(
                "Retailer Mobile",
                app.retailerMobile
            )}

            ${detail(
                "Applicant",
                app.applicant
            )}

            ${detail(
                "English Name",
                app.englishName
            )}

            ${detail(
                "Gujarati Name",
                app.gujaratiName
            )}

            ${detail(
                "Service",
                app.service
            )}

            ${detail(
                "Amount",
                "₹" + formatAmount(app.amount)
            )}

            ${detail(
                "RATIONCARD Number",
                app.rationCardNo
            )}

            ${detail(
                "Gender",
                app.gender
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
                "Pincode",
                app.pincode
            )}

            ${detail(
                "Mobile",
                app.mobile
            )}

            ${detail(
                "Email",
                app.email
            )}

            ${detail(
                "Birth Date",
                app.birthDate
            )}

            ${detail(
                "Birth Year",
                app.birthYear
            )}

            ${detail(
                "RATIONCARD Status",
                app.rationcardStatus
            )}

            ${detail(
                "UTR Number",
                app.utrNumber
            )}

            ${detail(
                "Payment Status",
                app.paymentStatus
            )}

            ${detail(
                "Application Status",
                app.applicationStatus
            )}

            ${detail(
                "Admin Remark",
                app.remark
            )}

            ${detail(
                "Last Updated",
                app.updatedAt
            )}

        </div>

        <div style="
            margin-top:20px;
            display:flex;
            gap:10px;
            flex-wrap:wrap;
        ">

            ${
                app.aadhaarFileUrl
                ? `<a href="${escapeAttribute(app.aadhaarFileUrl)}"
                     target="_blank"
                     class="action-button view-button">
                     📄 Aadhaar
                   </a>`
                : ""
            }

            ${
                app.rationcardFileUrl
                ? `<a href="${escapeAttribute(app.rationcardFileUrl)}"
                     target="_blank"
                     class="action-button view-button">
                     📄 Rationcard
                   </a>`
                : ""
            }

            ${
                app.paymentScreenshotUrl
                ? `<a href="${escapeAttribute(app.paymentScreenshotUrl)}"
                     target="_blank"
                     class="action-button view-button">
                     💳 Payment Screenshot
                   </a>`
                : ""
            }

        </div>
    `;


    document
        .getElementById(
            "applicationModal"
        )
        .classList.add(
            "show"
        );

}


/* =========================================================
   CHANGE APPLICATION STATUS
========================================================= */

async function changeApplicationStatus(
    applicationId
) {

    const status =
        prompt(
            "Status પસંદ કરો:\n\n" +
            "Submitted\n" +
            "Processing\n" +
            "Completed\n" +
            "Rejected",
            "Processing"
        );


    if (!status) return;


    const validStatuses = [

        "Submitted",
        "Processing",
        "Completed",
        "Rejected"

    ];


    const selected =
        validStatuses.find(
            function (item) {

                return (
                    item.toLowerCase() ===
                    status.trim().toLowerCase()
                );

            }
        );


    if (!selected) {

        alert(
            "Invalid status."
        );

        return;

    }


    const remark =
        prompt(
            "Admin Remark (optional):",
            ""
        );


    try {

        const result =
            await apiRequest(
                "updateApplicationStatus",
                {

                    applicationId:
                        applicationId,

                    status:
                        selected,

                    remark:
                        remark || ""

                }
            );


        if (
            result.success
        ) {

            alert(
                "✅ Application status updated."
            );


            await loadDashboard();

        } else {

            alert(
                result.message ||
                "Update failed."
            );

        }


    } catch (error) {

        alert(
            "❌ " +
            error.message
        );

    }

}


/* =========================================================
   PAYMENT STATUS
========================================================= */

async function updatePaymentStatus() {

    const applicationId =
        document
            .getElementById(
                "paymentApplicationId"
            )
            .value
            .trim();


    const status =
        document
            .getElementById(
                "paymentStatusSelect"
            )
            .value;


    const message =
        document.getElementById(
            "paymentMessage"
        );


    if (
        !applicationId ||
        !status
    ) {

        showMessage(
            message,
            "Application ID અને Payment Status પસંદ કરો.",
            false
        );

        return;

    }


    try {

        const result =
            await apiRequest(
                "updatePaymentStatus",
                {

                    applicationId:
                        applicationId,

                    status:
                        status

                }
            );


        if (
            result.success
        ) {

            showMessage(
                message,
                "✅ Payment status updated successfully.",
                true
            );


            await loadDashboard();


        } else {

            showMessage(
                message,
                result.message ||
                "Payment update failed.",
                false
            );

        }


    } catch (error) {

        showMessage(
            message,
            "❌ " +
            error.message,
            false
        );

    }

}


/* =========================================================
   CREATE RETAILER FORM
========================================================= */

function setupRetailerForm() {

    const form =
        document.getElementById(
            "createRetailerForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            await createRetailer();

        }
    );

}


/* =========================================================
   CREATE RETAILER
========================================================= */

async function createRetailer() {

    const name =
        document
            .getElementById(
                "newRetailerName"
            )
            .value
            .trim();


    const mobile =
        document
            .getElementById(
                "newRetailerMobile"
            )
            .value
            .trim();


    const email =
        document
            .getElementById(
                "newRetailerEmail"
            )
            .value
            .trim();


    const retailerId =
        document
            .getElementById(
                "newRetailerId"
            )
            .value
            .trim();


    const username =
        document
            .getElementById(
                "newRetailerUsername"
            )
            .value
            .trim();


    const password =
        document
            .getElementById(
                "newRetailerPassword"
            )
            .value;


    const message =
        document.getElementById(
            "retailerCreateMessage"
        );


    if (
        !name ||
        !mobile ||
        !retailerId ||
        !username ||
        !password
    ) {

        showMessage(
            message,
            "બધી જરૂરી વિગતો ભરો.",
            false
        );

        return;

    }


    if (
        !/^[0-9]{10}$/.test(
            mobile
        )
    ) {

        showMessage(
            message,
            "Valid 10 digit mobile number નાખો.",
            false
        );

        return;

    }


    try {

        const result =
            await apiRequest(
                "createRetailer",
                {

                    retailerId:
                        retailerId,

                    retailerName:
                        name,

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


        if (
            result.success
        ) {

            showMessage(
                message,
                "✅ Retailer successfully created. ID: " +
                result.retailerId,
                true
            );


            document
                .getElementById(
                    "createRetailerForm"
                )
                .reset();


        } else {

            showMessage(
                message,
                result.message ||
                "Retailer create failed.",
                false
            );

        }


    } catch (error) {

        showMessage(
            message,
            "❌ " +
            error.message,
            false
        );

    }

}


/* =========================================================
   SHOW ADMIN PANEL
========================================================= */

function showAdminPanel(
    panelId
) {

    const panels = [

        "applicationsPanel",
        "retailerPanel",
        "paymentPanel",
        "settingsPanel"

    ];


    panels.forEach(
        function (id) {

            const panel =
                document.getElementById(
                    id
                );


            if (!panel) return;


            if (
                id === panelId
            ) {

                panel.classList.remove(
                    "admin-hidden"
                );

            } else {

                panel.classList.add(
                    "admin-hidden"
                );

            }

        }
    );


    const panel =
        document.getElementById(
            panelId
        );


    if (panel) {

        panel.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/* =========================================================
   LOGOUT
========================================================= */

function adminLogout() {

    isAdminLoggedIn =
        false;


    allApplications =
        [];


    sessionStorage.removeItem(
        "rajkumarAdminLoggedIn"
    );


    sessionStorage.removeItem(
        "rajkumarAdminRole"
    );


    const form =
        document.getElementById(
            "adminLoginForm"
        );


    if (form) {

        form.reset();

    }


    const message =
        document.getElementById(
            "adminLoginMessage"
        );


    if (message) {

        message.className =
            "admin-login-message";

        message.textContent =
            "";

    }


    showLogin();

}


/* =========================================================
   CLOSE MODAL
========================================================= */

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


/* =========================================================
   CLOSE MODAL WHEN BACKGROUND CLICK
========================================================= */

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


/* =========================================================
   HELPERS
========================================================= */

function normalize(
    value
) {

    return String(
        value || ""
    )
        .trim()
        .toLowerCase();

}


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


function formatAmount(
    amount
) {

    const number =
        Number(
            amount || 0
        );


    return number.toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }
    );

}


function statusBadge(
    status,
    type
) {

    const value =
        String(
            status ||
            "Pending"
        );


    const normalized =
        normalize(
            value
        );


    let className =
        "status-pending";


    if (
        normalized.includes(
            "completed"
        )
    ) {

        className =
            "status-completed";

    } else if (
        normalized.includes(
            "processing"
        )
    ) {

        className =
            "status-processing";

    } else if (
        normalized.includes(
            "rejected"
        )
    ) {

        className =
            "status-rejected";

    } else if (
        normalized.includes(
            "received"
        ) ||
        normalized.includes(
            "verified"
        )
    ) {

        className =
            "status-paid";

    }


    return `
        <span class="status ${className}">
            ${escapeHtml(value)}
        </span>
    `;

}


function detail(
    label,
    value
) {

    return `
        <div class="detail-box">

            <strong>
                ${escapeHtml(label)}
            </strong>

            <span>
                ${escapeHtml(
                    value || "-"
                )}
            </span>

        </div>
    `;

}


function showMessage(
    element,
    text,
    success
) {

    if (!element) return;


    element.className =
        success
            ? "admin-login-message message-success"
            : "admin-login-message message-error";


    if (
        element.classList.contains(
            "panel-message"
        )
    ) {

        element.className =
            success
                ? "panel-message message-success"
                : "panel-message message-error";

    }


    element.textContent =
        text;


    element.style.display =
        "block";

}


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


function escapeJs(
    value
) {

    return String(
        value ?? ""
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


function escapeAttribute(
    value
) {

    return escapeHtml(
        value
    );

}


/* =========================================================
   PREVENT BACK BUTTON FROM SHOWING DASHBOARD
   AFTER LOGOUT
========================================================= */

window.addEventListener(
    "pageshow",
    function () {

        checkAdminSession();

    }
);


/* =========================================================
   END
========================================================= */
