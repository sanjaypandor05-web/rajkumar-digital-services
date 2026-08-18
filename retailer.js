/* =========================================================
   RAJKUMAR RATIONCARD SERVICES
   FINAL RETAILER JAVASCRIPT
   Login + Dashboard + Application Submit
========================================================= */

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbw1mKC92_EjWJS_x2o8LMqiL9sssMbFh089IhMujZLd6_9VuujoVckjoMS8fbajvN-uQQ/exec";


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    setupRetailerLogin();
    setupServiceAmount();
    setupApplicationForm();
    checkRetailerSession();

});


/* =========================================================
   RETAILER LOGIN
========================================================= */

function setupRetailerLogin() {

    const form =
        document.getElementById("retailerLoginForm");

    if (!form) return;


    form.addEventListener("submit", async function (event) {

        event.preventDefault();


        const retailerId =
            document.getElementById("retailerId")?.value.trim();

        const password =
            document.getElementById("retailerPassword")?.value || "";

        const button =
            form.querySelector("button[type='submit']");


        if (!retailerId || !password) {

            showLoginMessage(
                "⚠️ Retailer ID અને Password દાખલ કરો.",
                "error"
            );

            return;
        }


        if (button) {

            button.disabled = true;
            button.textContent = "LOGIN...";

        }


        showLoginMessage(
            "🔄 Login ચેક થઈ રહ્યું છે...",
            "loading"
        );


        try {

            const response = await fetch(
                SCRIPT_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body: JSON.stringify({

                        action: "retailerLogin",

                        username: retailerId,

                        password: password

                    })
                }
            );


            if (!response.ok) {

                throw new Error(
                    "HTTP Error " + response.status
                );

            }


            const result =
                await response.json();


            console.log(
                "Retailer Login:",
                result
            );


            if (
                result &&
                result.success === true
            ) {


                const id =
                    result.retailerId ||
                    retailerId;

                const name =
                    result.retailerName ||
                    "Retailer";

                const mobile =
                    result.mobile ||
                    "";

                const username =
                    result.username ||
                    retailerId;


                /* =====================================
                   LOCAL STORAGE
                ===================================== */

                localStorage.setItem(
                    "rajkumarRole",
                    "retailer"
                );

                localStorage.setItem(
                    "rajkumarRetailerId",
                    id
                );

                localStorage.setItem(
                    "rajkumarRetailerName",
                    name
                );

                localStorage.setItem(
                    "rajkumarRetailerMobile",
                    mobile
                );

                localStorage.setItem(
                    "rajkumarRetailerUsername",
                    username
                );


                /* Compatibility */

                localStorage.setItem(
                    "retailerId",
                    id
                );

                localStorage.setItem(
                    "retailerName",
                    name
                );

                localStorage.setItem(
                    "retailerMobile",
                    mobile
                );

                localStorage.setItem(
                    "retailerUsername",
                    username
                );


                /* =====================================
                   SESSION STORAGE
                ===================================== */

                sessionStorage.setItem(
                    "retailerLoggedIn",
                    "true"
                );

                sessionStorage.setItem(
                    "retailerId",
                    id
                );


                showLoginMessage(
                    "✅ Login Successful.",
                    "success"
                );


                /*
                 * IMPORTANT:
                 * અહીં બીજા HTML page પર redirect નથી.
                 * retailer.htmlમાં જ dashboard ખૂલશે.
                 */

                setTimeout(function () {

                    showDashboard(id);

                    loadRetailerApplications();

                }, 400);


                return;

            }


            showLoginMessage(
                result && result.message
                    ? "❌ " + result.message
                    : "❌ Invalid Retailer ID or Password.",
                "error"
            );


        } catch (error) {

            console.error(
                "Retailer Login Error:",
                error
            );


            showLoginMessage(
                "❌ Server connection failed. Apps Script URL અથવા deployment ચેક કરો.",
                "error"
            );

        } finally {

            if (button) {

                button.disabled = false;
                button.textContent = "LOGIN";

            }

        }

    });

}


/* =========================================================
   LOGIN MESSAGE
========================================================= */

function showLoginMessage(message, type) {

    const element =
        document.getElementById("loginMessage");

    if (!element) return;


    element.style.display = "block";

    element.innerHTML = message;

    element.style.padding = "12px";

    element.style.marginTop = "15px";

    element.style.borderRadius = "10px";


    if (type === "success") {

        element.style.background = "#e8f5e9";

        element.style.color = "#2e7d32";

        element.style.border =
            "1px solid #c8e6c9";

    }

    else if (type === "loading") {

        element.style.background = "#e3f2fd";

        element.style.color = "#1565c0";

        element.style.border =
            "1px solid #bbdefb";

    }

    else {

        element.style.background = "#ffebee";

        element.style.color = "#c62828";

        element.style.border =
            "1px solid #ffcdd2";

    }

}


/* =========================================================
   SHOW DASHBOARD
========================================================= */

function showDashboard(retailerId) {

    const loginSection =
        document.getElementById("loginSection");

    const dashboard =
        document.getElementById("dashboardSection");


    if (loginSection) {

        loginSection.style.display = "none";

    }


    if (dashboard) {

        dashboard.style.display = "block";

    }


    const nameElement =
        document.getElementById(
            "loggedRetailerName"
        );


    if (nameElement) {

        nameElement.textContent =
            localStorage.getItem(
                "rajkumarRetailerName"
            ) || retailerId;

    }


    const idElement =
        document.getElementById(
            "loggedRetailerId"
        );


    if (idElement) {

        idElement.textContent =
            retailerId;

    }

}


/* =========================================================
   CHECK RETAILER SESSION
========================================================= */

function checkRetailerSession() {

    const loggedIn =
        sessionStorage.getItem(
            "retailerLoggedIn"
        );

    const retailerId =
        sessionStorage.getItem(
            "retailerId"
        );


    if (
        loggedIn === "true" &&
        retailerId
    ) {

        showDashboard(
            retailerId
        );

        loadRetailerApplications();

    }

}


/* =========================================================
   LOGOUT
========================================================= */

function retailerLogout() {

    sessionStorage.removeItem(
        "retailerLoggedIn"
    );

    sessionStorage.removeItem(
        "retailerId"
    );


    const keys = [

        "rajkumarRole",

        "rajkumarRetailerId",

        "rajkumarRetailerName",

        "rajkumarRetailerMobile",

        "rajkumarRetailerUsername",

        "retailerId",

        "retailerName",

        "retailerMobile",

        "retailerUsername"

    ];


    keys.forEach(function (key) {

        localStorage.removeItem(key);

    });


    window.location.href =
        "retailer.html";

}


/* =========================================================
   SERVICE AMOUNT
========================================================= */

function setupServiceAmount() {

    const select =
        document.getElementById(
            "serviceSelect"
        );

    if (!select) return;


    select.addEventListener(
        "change",
        updateServiceAmount
    );


    updateServiceAmount();

}


/* =========================================================
   UPDATE SERVICE AMOUNT
========================================================= */

function updateServiceAmount() {

    const select =
        document.getElementById(
            "serviceSelect"
        );

    const serviceAmount =
        document.getElementById(
            "serviceAmount"
        );

    const paymentAmount =
        document.getElementById(
            "paymentAmount"
        );


    if (!select) return;


    const option =
        select.options[
            select.selectedIndex
        ];


    let amount = 0;


    if (
        option &&
        option.dataset.amount
    ) {

        amount =
            Number(
                option.dataset.amount
            );

    }


    if (serviceAmount) {

        serviceAmount.textContent =
            amount;

    }


    if (paymentAmount) {

        paymentAmount.textContent =
            amount;

    }

}


/* =========================================================
   APPLICATION FORM
========================================================= */

function setupApplicationForm() {

    const form =
        document.getElementById(
            "applicationForm"
        );

    if (!form) return;


    form.addEventListener(
        "submit",
        submitApplication
    );

}


/* =========================================================
   SUBMIT APPLICATION
========================================================= */

async function submitApplication(event) {

    event.preventDefault();


    const form =
        document.getElementById(
            "applicationForm"
        );

    const message =
        document.getElementById(
            "applicationMessage"
        );


    const retailerId =
        localStorage.getItem(
            "rajkumarRetailerId"
        ) || "";


    const retailerMobile =
        localStorage.getItem(
            "rajkumarRetailerMobile"
        ) || "";


    if (!retailerId) {

        showApplicationMessage(
            message,
            "❌ Retailer session expired. ફરી Login કરો.",
            "error"
        );

        return;

    }


    const serviceSelect =
        document.getElementById(
            "serviceSelect"
        );


    if (
        !serviceSelect ||
        !serviceSelect.value
    ) {

        showApplicationMessage(
            message,
            "⚠️ Service પસંદ કરો.",
            "error"
        );

        return;

    }


    const selected =
        serviceSelect.options[
            serviceSelect.selectedIndex
        ];


    const amount =
        Number(
            selected.dataset.amount || 0
        );


    if (amount <= 0) {

        showApplicationMessage(
            message,
            "⚠️ Service amount invalid છે.",
            "error"
        );

        return;

    }


    const button =
        form.querySelector(
            "button[type='submit']"
        );


    if (button) {

        button.disabled = true;

        button.textContent =
            "SUBMITTING...";

    }


    showApplicationMessage(
        message,
        "🔄 Application submit થઈ રહી છે...",
        "loading"
    );


    try {

        const data =
            await collectApplicationData(
                form,
                retailerId,
                retailerMobile,
                serviceSelect.value,
                amount
            );


        const response =
            await fetch(
                SCRIPT_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body: JSON.stringify(data)
                }
            );


        if (!response.ok) {

            throw new Error(
                "HTTP Error " +
                response.status
            );

        }


        const result =
            await response.json();


        console.log(
            "Application Result:",
            result
        );


        if (
            result &&
            result.success === true
        ) {

            showApplicationMessage(
                message,

                "✅ Application Submitted Successfully!<br>" +
                "Application ID: <strong>" +
                result.applicationId +
                "</strong>",

                "success"
            );


            form.reset();

            updateServiceAmount();


            loadRetailerApplications();


            return;

        }


        showApplicationMessage(
            message,

            result && result.message
                ? "❌ " + result.message
                : "❌ Application submit failed.",

            "error"
        );


    } catch (error) {

        console.error(
            "Application Submit Error:",
            error
        );


        showApplicationMessage(
            message,
            "❌ Server connection failed.",
            "error"
        );

    } finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                "Submit Application";

        }

    }

}


/* =========================================================
   COLLECT APPLICATION DATA
========================================================= */

async function collectApplicationData(
    form,
    retailerId,
    retailerMobile,
    service,
    amount
) {

    const formData =
        new FormData(form);


    const data = {

        action:
            "submitApplication",

        retailerId:
            retailerId,

        retailerMobile:
            retailerMobile,

        service:
            service,

        amount:
            amount,

        aadhaarName:
            formData.get("aadhaarName") || "",

        englishName:
            formData.get("englishName") || "",

        gujaratiName:
            formData.get("gujaratiName") || "",

        rationCardNo:
            formData.get("rationCardNo") || "",

        gender:
            formData.get("gender") || "",

        village:
            formData.get("village") || "",

        taluka:
            formData.get("taluka") || "",

        district:
            formData.get("district") || "",

        pincode:
            formData.get("pincode") || "",

        mobile:
            formData.get("mobile") || "",

        email:
            formData.get("email") || "",

        birthDate:
            formData.get("birthDate") || "",

        birthYear:
            formData.get("birthYear") || "",

        rationcardStatus:
            formData.get("rationcardStatus") || "",

        utrNumber:
            formData.get("utrNumber") || ""

    };


    /* =====================================
       FILES
    ===================================== */

    const aadhaarFile =
        form.querySelector(
            'input[name="aadhaarFile"]'
        );

    const rationcardFile =
        form.querySelector(
            'input[name="rationcardFile"]'
        );

    const paymentFile =
        form.querySelector(
            'input[name="paymentScreenshot"]'
        );


    if (aadhaarFile && aadhaarFile.files.length) {

        data.aadhaarFile =
            await fileToBase64(
                aadhaarFile.files[0]
            );

    }


    if (
        rationcardFile &&
        rationcardFile.files.length
    ) {

        data.rationcardFile =
            await fileToBase64(
                rationcardFile.files[0]
            );

    }


    if (
        paymentFile &&
        paymentFile.files.length
    ) {

        data.paymentScreenshot =
            await fileToBase64(
                paymentFile.files[0]
            );

    }


    return data;

}


/* =========================================================
   FILE TO BASE64
========================================================= */

function fileToBase64(file) {

    return new Promise(
        function(resolve, reject) {

            const reader =
                new FileReader();


            reader.onload = function() {

                const result =
                    reader.result || "";


                const base64 =
                    result.split(",")[1] || "";


                resolve({

                    name:
                        file.name,

                    mimeType:
                        file.type ||
                        "application/octet-stream",

                    data:
                        base64

                });

            };


            reader.onerror =
                function() {

                    reject(
                        new Error(
                            "File reading failed."
                        )
                    );

                };


            reader.readAsDataURL(file);

        }
    );

}


/* =========================================================
   LOAD RETAILER APPLICATIONS
========================================================= */

async function loadRetailerApplications() {

    const retailerId =
        localStorage.getItem(
            "rajkumarRetailerId"
        );


    if (!retailerId) return;


    try {

        const response =
            await fetch(
                SCRIPT_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body: JSON.stringify({

                        action:
                            "getRetailerApplications",

                        retailerId:
                            retailerId

                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                "HTTP " + response.status
            );

        }


        const result =
            await response.json();


        console.log(
            "Retailer Applications:",
            result
        );


        if (
            result &&
            result.success === true
        ) {

            renderRetailerApplications(
                result.applications || []
            );

        }


    } catch (error) {

        console.error(
            "Load Applications Error:",
            error
        );

    }

}


/* =========================================================
   RENDER APPLICATIONS
========================================================= */

function renderRetailerApplications(
    applications
) {

    const container =
        document.getElementById(
            "retailerApplications"
        );


    if (!container) return;


    if (!applications.length) {

        container.innerHTML =
            "<p>No applications found.</p>";

        return;

    }


    let html = "";


    applications.forEach(
        function(item) {

            html += `

                <div class="application-card">

                    <h3>
                        ${escapeHtml(
                            item.applicationId || ""
                        )}
                    </h3>

                    <p>
                        <strong>Service:</strong>
                        ${escapeHtml(
                            item.service || ""
                        )}
                    </p>

                    <p>
                        <strong>Amount:</strong>
                        ₹${escapeHtml(
                            String(item.amount || 0)
                        )}
                    </p>

                    <p>
                        <strong>Date:</strong>
                        ${escapeHtml(
                            item.date || ""
                        )}
                    </p>

                    <p>
                        <strong>Payment:</strong>
                        ${escapeHtml(
                            item.paymentStatus || "Pending"
                        )}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${escapeHtml(
                            item.applicationStatus || "Submitted"
                        )}
                    </p>

                </div>

            `;

        }
    );


    container.innerHTML =
        html;

}


/* =========================================================
   APPLICATION MESSAGE
========================================================= */

function showApplicationMessage(
    element,
    message,
    type
) {

    if (!element) return;


    element.style.display =
        "block";

    element.innerHTML =
        message;

    element.style.padding =
        "12px";

    element.style.marginTop =
        "15px";

    element.style.borderRadius =
        "10px";


    if (type === "success") {

        element.style.background =
            "#e8f5e9";

        element.style.color =
            "#2e7d32";

        element.style.border =
            "1px solid #c8e6c9";

    }

    else if (type === "loading") {

        element.style.background =
            "#e3f2fd";

        element.style.color =
            "#1565c0";

        element.style.border =
            "1px solid #bbdefb";

    }

    else {

        element.style.background =
            "#ffebee";

        element.style.color =
            "#c62828";

        element.style.border =
            "1px solid #ffcdd2";

    }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value) {

    return String(value || "")

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
