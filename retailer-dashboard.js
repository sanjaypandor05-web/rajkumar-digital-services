/* =====================================================
   RAJKUMAR WEBSITE
   RETAILER DASHBOARD - BACKEND CONNECTED
===================================================== */


/* =====================================================
   GOOGLE APPS SCRIPT API
===================================================== */

const API_URL =
    "https://script.google.com/macros/s/AKfycbxzur__8Lzuis0fQxWtyhjW6XiB6XNC72yxuBSyuv0tOO2PSZQeS45Ssup5F-AlAGGhGQ/exec";


/* =====================================================
   SERVICE PRICES
===================================================== */

const SERVICE_PRICES = {

    "Ration Card Services": 0,
    "PAN Card Services": 0,
    "Recharge Services": 0,
    "iKhedut Portal અરજી": 0,
    "PM Kisan Samman Nidhi": 0,
    "Aadhaar → Mobile Link Check": 0,
    "Aadhaar → PAN Link Check": 0,
    "RC PDF Download": 0,
    "DL PDF Download": 0,
    "LMS Certificate Apply": 0

};


/* =====================================================
   INITIAL LOAD
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    checkRetailerLogin();

    loadRetailerInfo();

    updateDashboardStats();

    loadRetailerApplications();

});


/* =====================================================
   CHECK RETAILER LOGIN
===================================================== */

function checkRetailerLogin() {

    const retailerId =
        localStorage.getItem("retailerId");

    if (!retailerId) {

        alert("Retailer login required.");

        window.location.href =
            "retailer-login.html";

        return false;
    }

    return true;
}


/* =====================================================
   RETAILER INFO
===================================================== */

function loadRetailerInfo() {

    const retailerName =
        localStorage.getItem("retailerName");

    const retailerId =
        localStorage.getItem("retailerId");

    const nameElement =
        document.getElementById("retailerName");


    if (!nameElement) {
        return;
    }


    if (retailerName) {

        nameElement.textContent =
            retailerName;

    }
    else if (retailerId) {

        nameElement.textContent =
            retailerId;

    }

}


/* =====================================================
   API REQUEST
===================================================== */

async function apiRequest(data) {

    try {

        const response =
            await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },

                body: JSON.stringify(data)

            });


        if (!response.ok) {

            throw new Error(
                "HTTP Error " +
                response.status
            );

        }


        const result =
            await response.json();


        return result;

    }
    catch (error) {

        console.error(
            "API ERROR:",
            error
        );

        throw error;

    }

}


/* =====================================================
   SECTION
===================================================== */

function showSection(
    sectionId,
    button
) {

    document
        .querySelectorAll(".content-section")
        .forEach(function (section) {

            section.classList.remove("active");

        });


    const section =
        document.getElementById(sectionId);


    if (section) {

        section.classList.add("active");

    }


    document
        .querySelectorAll(".menu-item")
        .forEach(function (item) {

            item.classList.remove("active");

        });


    if (button) {

        button.classList.add("active");

    }


    if (sectionId === "applications") {

        loadRetailerApplications();

    }


    if (sectionId === "dashboard") {

        updateDashboardStats();

    }

}


/* =====================================================
   SECTION BY ID
===================================================== */

function showSectionById(sectionId) {

    const section =
        document.getElementById(sectionId);


    if (!section) {
        return;
    }


    document
        .querySelectorAll(".content-section")
        .forEach(function (item) {

            item.classList.remove("active");

        });


    section.classList.add("active");


    document
        .querySelectorAll(".menu-item")
        .forEach(function (item) {

            item.classList.remove("active");

        });


    if (sectionId === "applications") {

        loadRetailerApplications();

    }

}


/* =====================================================
   NEW APPLICATION
===================================================== */

function openNewApplication() {

    showSectionById(
        "newApplication"
    );


    document
        .querySelectorAll(".menu-item")
        .forEach(function (item) {

            item.classList.remove("active");

        });


    const newButton =
        document.querySelectorAll(
            ".menu-item"
        )[1];


    if (newButton) {

        newButton.classList.add(
            "active"
        );

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =====================================================
   SERVICE SELECT
===================================================== */

function serviceSelected() {

    const serviceSelect =
        document.getElementById(
            "serviceSelect"
        );


    const service =
        serviceSelect.value;


    const info =
        document.getElementById(
            "serviceInfo"
        );


    const serviceText =
        document.getElementById(
            "selectedServiceText"
        );


    const amount =
        document.getElementById(
            "serviceAmount"
        );


    const paymentAmount =
        document.getElementById(
            "paymentAmount"
        );


    if (!service) {

        info.classList.remove("show");

        hideApplicationSections();

        return;

    }


    const price =
        SERVICE_PRICES[service] || 0;


    serviceText.textContent =
        service;


    amount.textContent =
        "₹" + price;


    paymentAmount.textContent =
        "₹" + price;


    info.classList.add("show");


    document
        .getElementById(
            "customerDetails"
        )
        .classList.remove("hidden");


    document
        .getElementById(
            "documentsSection"
        )
        .classList.remove("hidden");


    document
        .getElementById(
            "paymentSection"
        )
        .classList.remove("hidden");


    document
        .getElementById(
            "submitSection"
        )
        .classList.remove("hidden");


    updateSteps();

}


/* =====================================================
   HIDE FORM SECTIONS
===================================================== */

function hideApplicationSections() {

    document
        .getElementById(
            "customerDetails"
        )
        .classList.add("hidden");


    document
        .getElementById(
            "documentsSection"
        )
        .classList.add("hidden");


    document
        .getElementById(
            "paymentSection"
        )
        .classList.add("hidden");


    document
        .getElementById(
            "submitSection"
        )
        .classList.add("hidden");

}


/* =====================================================
   STEPS
===================================================== */

function updateSteps() {

    document
        .querySelectorAll(".step")
        .forEach(function (step) {

            step.classList.add("active");

        });

}


/* =====================================================
   FILE TO BASE64
===================================================== */

function fileToBase64(file) {

    return new Promise(
        function(resolve, reject) {

            if (!file) {

                resolve(null);

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function() {

                    resolve({

                        name:
                            file.name,

                        type:
                            file.type,

                        base64:
                            reader.result

                    });

                };


            reader.onerror =
                function(error) {

                    reject(error);

                };


            reader.readAsDataURL(file);

        }
    );

}


/* =====================================================
   SUBMIT APPLICATION
===================================================== */

async function submitApplication() {

    try {

        const retailerId =
            localStorage.getItem(
                "retailerId"
            );


        const retailerName =
            localStorage.getItem(
                "retailerName"
            );


        if (!retailerId) {

            alert(
                "Retailer login session expired."
            );

            window.location.href =
                "retailer-login.html";

            return;

        }


        const service =
            document
                .getElementById(
                    "serviceSelect"
                )
                .value;


        const customerName =
            document
                .getElementById(
                    "customerName"
                )
                .value
                .trim();


        const mobile =
            document
                .getElementById(
                    "customerMobile"
                )
                .value
                .trim();


        const village =
            document
                .getElementById(
                    "village"
                )
                .value
                .trim();


        const taluka =
            document
                .getElementById(
                    "taluka"
                )
                .value
                .trim();


        const district =
            document
                .getElementById(
                    "district"
                )
                .value
                .trim();


        const aadhaarNumber =
            document
                .getElementById(
                    "aadhaarNumber"
                )
                .value
                .trim();


        const transactionId =
            document
                .getElementById(
                    "transactionId"
                )
                .value
                .trim();


        const aadhaarFile =
            document
                .getElementById(
                    "aadhaarDocument"
                )
                .files[0];


        const serviceFile =
            document
                .getElementById(
                    "serviceDocument"
                )
                .files[0];


        const paymentFile =
            document
                .getElementById(
                    "paymentScreenshot"
                )
                .files[0];


        /* ================= VALIDATION ================= */

        if (!service) {

            alert(
                "Please select a service."
            );

            return;

        }


        if (!customerName) {

            alert(
                "Please enter customer name."
            );

            return;

        }


        if (!/^[0-9]{10}$/.test(mobile)) {

            alert(
                "Please enter valid 10 digit mobile number."
            );

            return;

        }


        if (!transactionId) {

            alert(
                "Please enter UTR / Transaction ID."
            );

            return;

        }


        if (!paymentFile) {

            alert(
                "Please upload payment screenshot."
            );

            return;

        }


        /* ================= CONFIRM ================= */

        const amount =
            SERVICE_PRICES[service] || 0;


        const confirmSubmit =
            confirm(

                "Submit Application?\n\n" +

                "Service: " +
                service +
                "\n" +

                "Customer: " +
                customerName +
                "\n" +

                "Amount: ₹" +
                amount

            );


        if (!confirmSubmit) {
            return;
        }


        /* ================= BUTTON ================= */

        const submitButton =
            document.querySelector(
                ".submit-application-btn"
            );


        if (submitButton) {

            submitButton.disabled =
                true;

            submitButton.innerText =
                "⏳ SUBMITTING...";

        }


        /* ================= FILES ================= */

        const aadhaarDocument =
            await fileToBase64(
                aadhaarFile
            );


        const serviceDocument =
            await fileToBase64(
                serviceFile
            );


        const paymentScreenshot =
            await fileToBase64(
                paymentFile
            );


        /* ================= DATA ================= */

        const data = {

            action:
                "submitApplication",

            retailerId:
                retailerId,

            retailerName:
                retailerName || retailerId,

            customerName:
                customerName,

            mobile:
                mobile,

            village:
                village,

            taluka:
                taluka,

            district:
                district,

            aadhaarNumber:
                aadhaarNumber,

            service:
                service,

            amount:
                amount,

            transactionId:
                transactionId,

            aadhaarDocument:
                aadhaarDocument,

            serviceDocument:
                serviceDocument,

            paymentScreenshot:
                paymentScreenshot

        };


        /* ================= SEND ================= */

        const result =
            await apiRequest(data);


        if (
            result &&
            result.success
        ) {

            alert(

                "✅ Application Submitted Successfully!\n\n" +

                "Application ID: " +
                result.applicationId

            );


            resetApplicationForm();


            loadRetailerApplications();

            updateDashboardStats();


            showSectionById(
                "applications"
            );


        }
        else {

            alert(

                "❌ Application Submission Failed\n\n" +

                (
                    result.message ||
                    "Unknown error"
                )

            );

        }

    }
    catch (error) {

        console.error(error);


        alert(

            "❌ Server Connection Error\n\n" +
            error.message

        );

    }
    finally {

        const submitButton =
            document.querySelector(
                ".submit-application-btn"
            );


        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.innerText =
                "🚀 SUBMIT APPLICATION";

        }

    }

}


/* =====================================================
   RESET APPLICATION
===================================================== */

function resetApplicationForm() {

    const serviceSelect =
        document.getElementById(
            "serviceSelect"
        );


    if (serviceSelect) {

        serviceSelect.value = "";

    }


    const fields = [

        "customerName",
        "customerMobile",
        "village",
        "taluka",
        "district",
        "aadhaarNumber",
        "transactionId"

    ];


    fields.forEach(
        function(id) {

            const element =
                document.getElementById(id);

            if (element) {

                element.value = "";

            }

        }
    );


    [
        "aadhaarDocument",
        "serviceDocument",
        "paymentScreenshot"
    ]
    .forEach(
        function(id) {

            const element =
                document.getElementById(id);

            if (element) {

                element.value = "";

            }

        }
    );


    const info =
        document.getElementById(
            "serviceInfo"
        );


    if (info) {

        info.classList.remove(
            "show"
        );

    }


    hideApplicationSections();

}


/* =====================================================
   LOAD RETAILER APPLICATIONS
===================================================== */

async function loadRetailerApplications() {

    const retailerId =
        localStorage.getItem(
            "retailerId"
        );


    if (!retailerId) {
        return;
    }


    try {

        const result =
            await apiRequest({

                action:
                    "getRetailerApplications",

                retailerId:
                    retailerId

            });


        if (
            !result.success
        ) {

            console.error(
                result.message
            );

            return;

        }


        renderApplications(
            result.applications || []
        );


        updateStatsFromApplications(
            result.applications || []
        );


    }
    catch (error) {

        console.error(
            "Application loading error:",
            error
        );

    }

}


/* =====================================================
   RENDER APPLICATIONS
===================================================== */

function renderApplications(
    applications
) {

    const section =
        document.getElementById(
            "applications"
        );


    if (!section) {
        return;
    }


    const panel =
        section.querySelector(
            ".panel"
        );


    if (!panel) {
        return;
    }


    if (
        !applications ||
        applications.length === 0
    ) {

        panel.innerHTML = `

            <div class="empty-state">

                <div>📋</div>

                <h2>No Applications Yet</h2>

                <p>
                    Your submitted applications
                    will appear here.
                </p>

                <button
                    class="primary-btn"
                    onclick="openNewApplication()"
                >
                    CREATE APPLICATION
                </button>

            </div>

        `;

        return;

    }


    let html = `

        <div style="overflow-x:auto;">

            <table
                style="
                    width:100%;
                    border-collapse:collapse;
                    min-width:900px;
                "
            >

                <thead>

                    <tr>

                        <th>Application ID</th>
                        <th>Customer</th>
                        <th>Mobile</th>
                        <th>Service</th>
                        <th>Amount</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Date</th>

                    </tr>

                </thead>

                <tbody>

    `;


    applications.forEach(
        function(app) {

            const paymentStatus =
                app.paymentStatus ||
                "Pending";


            const applicationStatus =
                app.applicationStatus ||
                "Pending";


            html += `

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
                            app.customerName
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            app.mobile
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            app.service
                        )}
                    </td>

                    <td>
                        ₹${Number(
                            app.amount || 0
                        )}
                    </td>

                    <td>
                        ${statusBadge(
                            paymentStatus
                        )}
                    </td>

                    <td>
                        ${statusBadge(
                            applicationStatus
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            app.applicationDate ||
                            ""
                        )}
                    </td>

                </tr>

            `;

        }
    );


    html += `

                </tbody>

            </table>

        </div>

    `;


    panel.innerHTML =
        html;

}


/* =====================================================
   STATUS BADGE
===================================================== */

function statusBadge(status) {

    const normalized =
        String(status)
            .toLowerCase()
            .trim();


    let className =
        "pending";


    if (
        normalized ===
        "completed" ||
        normalized ===
        "successful" ||
        normalized ===
        "success"
    ) {

        className =
            "completed";

    }
    else if (
        normalized ===
        "processing"
    ) {

        className =
            "processing";

    }
    else if (
        normalized ===
        "rejected" ||
        normalized ===
        "failed"
    ) {

        className =
            "rejected";

    }


    return `

        <span
            class="status-badge ${className}"
        >
            ${escapeHtml(status)}
        </span>

    `;

}


/* =====================================================
   UPDATE DASHBOARD STATS
===================================================== */

async function updateDashboardStats() {

    const retailerId =
        localStorage.getItem(
            "retailerId"
        );


    if (!retailerId) {
        return;
    }


    try {

        const result =
            await apiRequest({

                action:
                    "getRetailerStats",

                retailerId:
                    retailerId

            });


        if (
            result &&
            result.success
        ) {

            document.getElementById(
                "totalApplications"
            ).textContent =
                result.total || 0;


            document.getElementById(
                "pendingApplications"
            ).textContent =
                result.pending || 0;


            document.getElementById(
                "processingApplications"
            ).textContent =
                result.processing || 0;


            document.getElementById(
                "completedApplications"
            ).textContent =
                result.completed || 0;

        }

    }
    catch (error) {

        console.error(
            "Stats error:",
            error
        );

    }

}


/* =====================================================
   UPDATE STATS FROM APPLICATIONS
===================================================== */

function updateStatsFromApplications(
    applications
) {

    let pending = 0;

    let processing = 0;

    let completed = 0;


    applications.forEach(
        function(app) {

            const status =
                String(
                    app.applicationStatus ||
                    ""
                )
                .toLowerCase()
                .trim();


            if (
                status ===
                "pending"
            ) {

                pending++;

            }
            else if (
                status ===
                "processing"
            ) {

                processing++;

            }
            else if (
                status ===
                "completed" ||
                status ===
                "successful" ||
                status ===
                "success"
            ) {

                completed++;

            }

        }
    );


    const total =
        applications.length;


    const totalElement =
        document.getElementById(
            "totalApplications"
        );


    const pendingElement =
        document.getElementById(
            "pendingApplications"
        );


    const processingElement =
        document.getElementById(
            "processingApplications"
        );


    const completedElement =
        document.getElementById(
            "completedApplications"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (pendingElement) {

        pendingElement.textContent =
            pending;

    }


    if (processingElement) {

        processingElement.textContent =
            processing;

    }


    if (completedElement) {

        completedElement.textContent =
            completed;

    }

}


/* =====================================================
   TRACK APPLICATION
===================================================== */

async function trackApplication() {

    const applicationId =
        document
            .getElementById(
                "trackingId"
            )
            .value
            .trim();


    const resultElement =
        document.getElementById(
            "trackingResult"
        );


    if (!applicationId) {

        resultElement.innerHTML =

            '<p style="color:#dc2626;font-weight:700;">' +
            'Please enter Application ID.' +
            '</p>';

        return;

    }


    resultElement.innerHTML =

        '<p style="color:#0756c9;font-weight:700;">' +
        '⏳ Checking application...' +
        '</p>';


    try {

        const result =
            await apiRequest({

                action:
                    "trackApplication",

                applicationId:
                    applicationId

            });


        if (
            !result.success
        ) {

            resultElement.innerHTML =

                '<p style="color:#dc2626;font-weight:700;">' +
                '❌ ' +
                escapeHtml(
                    result.message ||
                    "Application not found."
                ) +
                '</p>';

            return;

        }


        const app =
            result.application;


        resultElement.innerHTML = `

            <div
                style="
                    background:#f8fafc;
                    padding:20px;
                    border-radius:14px;
                    margin-top:20px;
                    text-align:left;
                "
            >

                <h3>
                    📋 Application Details
                </h3>

                <p>
                    <strong>Application ID:</strong>
                    ${escapeHtml(
                        app.applicationId
                    )}
                </p>

                <p>
                    <strong>Customer:</strong>
                    ${escapeHtml(
                        app.customerName
                    )}
                </p>

                <p>
                    <strong>Mobile:</strong>
                    ${escapeHtml(
                        app.mobile
                    )}
                </p>

                <p>
                    <strong>Service:</strong>
                    ${escapeHtml(
                        app.service
                    )}
                </p>

                <p>
                    <strong>Amount:</strong>
                    ₹${Number(
                        app.amount || 0
                    )}
                </p>

                <p>
                    <strong>Payment:</strong>
                    ${statusBadge(
                        app.paymentStatus
                    )}
                </p>

                <p>
                    <strong>Application:</strong>
                    ${statusBadge(
                        app.applicationStatus
                    )}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${escapeHtml(
                        app.applicationDate ||
                        ""
                    )}
                </p>

                <p>
                    <strong>Remarks:</strong>
                    ${escapeHtml(
                        app.remarks ||
                        "-"
                    )}
                </p>

            </div>

        `;

    }
    catch (error) {

        console.error(error);


        resultElement.innerHTML =

            '<p style="color:#dc2626;font-weight:700;">' +
            '❌ Server connection failed.' +
            '</p>';

    }

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(value) {

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
   LOGOUT
===================================================== */

function logout() {

    const confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmLogout) {
        return;
    }


    localStorage.removeItem(
        "retailerName"
    );


    localStorage.removeItem(
        "retailerId"
    );


    localStorage.removeItem(
        "retailerUsername"
    );


    localStorage.removeItem(
        "retailerMobile"
    );


    window.location.href =
        "retailer-login.html";

}
