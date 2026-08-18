/* =====================================================
   RAJKUMAR RATIONCARD SERVICES
   FINAL RETAILER JAVASCRIPT
===================================================== */

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbzVyarGuWcFfauDBpPmD4d6xUak9MmINfcUGAbz1JrxA6s-n3nQOBUQszQxFQKsz25Iow/exec";


/* =====================================================
   START
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    protectRetailerPage();

    setupRetailerLogin();

    setupLogout();

    setupServiceAmount();

    setupApplicationForm();

});


/* =====================================================
   PAGE PROTECTION
===================================================== */

function protectRetailerPage() {

    const loggedIn =
        sessionStorage.getItem("retailerLoggedIn");

    const retailerId =
        sessionStorage.getItem("retailerId");

    if (
        loggedIn === "true" &&
        retailerId
    ) {

        showDashboard();

    } else {

        forceLogin();

    }

}


/* =====================================================
   FORCE LOGIN
===================================================== */

function forceLogin() {

    const loginSection =
        document.getElementById("loginSection");

    const dashboardSection =
        document.getElementById("dashboardSection");

    if (loginSection) {

        loginSection.style.display = "block";

    }

    if (dashboardSection) {

        dashboardSection.style.display = "none";

    }

}


/* =====================================================
   SHOW DASHBOARD
===================================================== */

function showDashboard() {

    const loginSection =
        document.getElementById("loginSection");

    const dashboardSection =
        document.getElementById("dashboardSection");

    if (loginSection) {

        loginSection.style.display = "none";

    }

    if (dashboardSection) {

        dashboardSection.style.display = "block";

    }

    const retailerName =
        sessionStorage.getItem("retailerName") ||
        "Retailer";

    const retailerId =
        sessionStorage.getItem("retailerId") ||
        "";

    const nameElement =
        document.getElementById("loggedRetailerName");

    if (nameElement) {

        nameElement.textContent =
            retailerName;

    }

    const idElement =
        document.getElementById("loggedRetailerId");

    if (idElement) {

        idElement.textContent =
            "Retailer ID: " + retailerId;

    }

}


/* =====================================================
   RETAILER LOGIN
===================================================== */

function setupRetailerLogin() {

    const form =
        document.getElementById("retailerLoginForm");

    if (!form) {
        return;
    }

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const retailerId =
            document
                .getElementById("retailerId")
                .value
                .trim();

        const password =
            document
                .getElementById("retailerPassword")
                .value
                .trim();

        if (!retailerId || !password) {

            showLoginMessage(
                "⚠️ Retailer ID અને Password દાખલ કરો.",
                "error"
            );

            return;
        }

        const button =
            document.getElementById(
                "retailerLoginButton"
            );

        if (button) {

            button.disabled = true;
            button.textContent = "LOGIN...";

        }

        showLoginMessage(
            "🔄 Login ચેક થઈ રહ્યું છે...",
            "loading"
        );

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
                                "retailerLogin",

                            username:
                                retailerId,

                            password:
                                password

                        })
                    }
                );

            if (!response.ok) {

                throw new Error(
                    "HTTP " +
                    response.status
                );

            }

            const result =
                await response.json();

            console.log(
                "RETAILER LOGIN RESULT",
                result
            );

            if (
                result &&
                result.success === true
            ) {

                sessionStorage.clear();

                sessionStorage.setItem(
                    "retailerLoggedIn",
                    "true"
                );

                sessionStorage.setItem(
                    "retailerId",
                    String(
                        result.retailerId ||
                        retailerId
                    ).trim()
                );

                sessionStorage.setItem(
                    "retailerName",
                    String(
                        result.retailerName ||
                        retailerId
                    ).trim()
                );

                sessionStorage.setItem(
                    "retailerMobile",
                    String(
                        result.mobile ||
                        ""
                    ).trim()
                );

                sessionStorage.setItem(
                    "retailerUsername",
                    String(
                        result.username ||
                        retailerId
                    ).trim()
                );

                showLoginMessage(
                    "✅ Login Successful.",
                    "success"
                );

                setTimeout(function () {

                    showDashboard();

                }, 400);

            } else {

                showLoginMessage(
                    result && result.message
                        ? "❌ " + result.message
                        : "❌ Invalid Retailer ID અથવા Password.",
                    "error"
                );

            }

        } catch (error) {

            console.error(
                "RETAILER LOGIN ERROR",
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


/* =====================================================
   LOGOUT
===================================================== */

function setupLogout() {

    const button =
        document.getElementById("logoutButton");

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        retailerLogout
    );

}


function retailerLogout() {

    sessionStorage.removeItem(
        "retailerLoggedIn"
    );

    sessionStorage.removeItem(
        "retailerId"
    );

    sessionStorage.removeItem(
        "retailerName"
    );

    sessionStorage.removeItem(
        "retailerMobile"
    );

    sessionStorage.removeItem(
        "retailerUsername"
    );

    localStorage.removeItem(
        "retailerLoggedIn"
    );

    localStorage.removeItem(
        "retailerId"
    );

    localStorage.removeItem(
        "retailerName"
    );

    window.location.replace(
        "retailer.html?logout=" +
        Date.now()
    );

}


/* =====================================================
   SERVICE AMOUNT
===================================================== */

function setupServiceAmount() {

    const select =
        document.getElementById(
            "serviceSelect"
        );

    if (!select) {
        return;
    }

    select.addEventListener(
        "change",
        updateServiceAmount
    );

    updateServiceAmount();

}


function updateServiceAmount() {

    const select =
        document.getElementById(
            "serviceSelect"
        );

    if (!select) {
        return;
    }

    const option =
        select.options[
            select.selectedIndex
        ];

    let amount = 0;

    if (
        option &&
        option.dataset &&
        option.dataset.amount
    ) {

        amount =
            Number(
                option.dataset.amount
            );

    }

    const serviceAmount =
        document.getElementById(
            "serviceAmount"
        );

    const paymentAmount =
        document.getElementById(
            "paymentAmount"
        );

    if (serviceAmount) {

        serviceAmount.textContent =
            amount;

    }

    if (paymentAmount) {

        paymentAmount.textContent =
            amount;

    }

}


/* =====================================================
   FILE TO BASE64
===================================================== */

function fileToBase64(file) {

    return new Promise(function(resolve, reject) {

        if (!file) {

            resolve(null);

            return;

        }

        const reader =
            new FileReader();

        reader.onload = function() {

            const result =
                String(
                    reader.result || ""
                );

            const commaIndex =
                result.indexOf(",");

            const base64 =
                commaIndex >= 0
                    ? result.substring(
                        commaIndex + 1
                    )
                    : result;

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

        reader.onerror = function() {

            reject(
                new Error(
                    "File read failed."
                )
            );

        };

        reader.readAsDataURL(file);

    });

}


/* =====================================================
   APPLICATION FORM
===================================================== */

function setupApplicationForm() {

    const form =
        document.getElementById(
            "applicationForm"
        );

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        submitRetailerApplication
    );

}


/* =====================================================
   SUBMIT APPLICATION
===================================================== */

async function submitRetailerApplication(event) {

    event.preventDefault();

    if (
        sessionStorage.getItem(
            "retailerLoggedIn"
        ) !== "true"
    ) {

        forceLogin();

        return;

    }

    const retailerId =
        sessionStorage.getItem(
            "retailerId"
        ) || "";

    const retailerMobile =
        sessionStorage.getItem(
            "retailerMobile"
        ) || "";

    const serviceSelect =
        document.getElementById(
            "serviceSelect"
        );

    const message =
        document.getElementById(
            "applicationMessage"
        );

    const submitButton =
        document.getElementById(
            "applicationSubmitButton"
        );

    if (!retailerId) {

        showApplicationMessage(
            message,
            "❌ Retailer session expired. ફરી login કરો.",
            "error"
        );

        forceLogin();

        return;

    }

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

    const option =
        serviceSelect.options[
            serviceSelect.selectedIndex
        ];

    const amount =
        Number(
            option.dataset.amount || 0
        );

    if (amount <= 0) {

        showApplicationMessage(
            message,
            "⚠️ Service amount મળ્યો નથી.",
            "error"
        );

        return;

    }

    const aadhaarFile =
        document.getElementById(
            "aadhaarFile"
        ).files[0];

    const rationcardFile =
        document.getElementById(
            "rationcardFile"
        ).files[0];

    const paymentScreenshot =
        document.getElementById(
            "paymentScreenshot"
        ).files[0];

    if (!aadhaarFile) {

        showApplicationMessage(
            message,
            "⚠️ Aadhaar PDF upload કરો.",
            "error"
        );

        return;

    }

    if (!paymentScreenshot) {

        showApplicationMessage(
            message,
            "⚠️ Payment Screenshot upload કરો.",
            "error"
        );

        return;

    }

    if (
        !aadhaarFile.name
            .toLowerCase()
            .endsWith(".pdf")
    ) {

        showApplicationMessage(
            message,
            "⚠️ Aadhaar file PDF હોવી જોઈએ.",
            "error"
        );

        return;

    }

    const utrNumber =
        document
            .getElementById("utrNumber")
            .value
            .trim();

    if (!utrNumber) {

        showApplicationMessage(
            message,
            "⚠️ UTR Number દાખલ કરો.",
            "error"
        );

        return;

    }

    try {

        if (submitButton) {

            submitButton.disabled = true;

            submitButton.textContent =
                "UPLOADING...";

        }

        showApplicationMessage(
            message,
            "⏳ Documents upload થઈ રહ્યા છે...",
            "loading"
        );

        const aadhaarData =
            await fileToBase64(
                aadhaarFile
            );

        const rationcardData =
            await fileToBase64(
                rationcardFile
            );

        const screenshotData =
            await fileToBase64(
                paymentScreenshot
            );

        const data = {

            action:
                "submitApplication",

            retailerId:
                retailerId,

            retailerMobile:
                retailerMobile,

            service:
                serviceSelect.value,

            aadhaarName:
                getValue("aadhaarName"),

            englishName:
                getValue("englishName"),

            gujaratiName:
                getValue("gujaratiName"),

            rationCardNo:
                getValue("rationCardNo"),

            gender:
                getValue("gender"),

            village:
                getValue("village"),

            taluka:
                getValue("taluka"),

            district:
                getValue("district"),

            pincode:
                getValue("pincode"),

            mobile:
                getValue("mobile"),

            email:
                getValue("email"),

            birthDate:
                getValue("birthDate"),

            birthYear:
                getValue("birthYear"),

            rationcardStatus:
                getValue("rationcardStatus"),

            utrNumber:
                utrNumber,

            aadhaarFile:
                aadhaarData,

            rationcardFile:
                rationcardData,

            paymentScreenshot:
                screenshotData

        };

        if (submitButton) {

            submitButton.textContent =
                "SUBMITTING...";

        }

        const response =
            await fetch(
                SCRIPT_URL,
                {

                    method:
                        "POST",

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
                "HTTP " +
                response.status
            );

        }

        const result =
            await response.json();

        console.log(
            "APPLICATION RESULT:",
            result
        );

        if (
            result &&
            result.success === true
        ) {

            showApplicationMessage(
                message,
                "✅ Application Submitted Successfully.<br>" +
                "<strong>Application ID: " +
                (result.applicationId || "") +
                "</strong>",
                "success"
            );

            document
                .getElementById(
                    "applicationForm"
                )
                .reset();

            updateServiceAmount();

        } else {

            showApplicationMessage(
                message,
                result && result.message
                    ? "❌ " + result.message
                    : "❌ Application submit failed.",
                "error"
            );

        }

    } catch (error) {

        console.error(
            "APPLICATION ERROR:",
            error
        );

        showApplicationMessage(
            message,
            "❌ Server connection failed. ફરી પ્રયાસ કરો.",
            "error"
        );

    } finally {

        if (submitButton) {

            submitButton.disabled = false;

            submitButton.textContent =
                "SUBMIT APPLICATION";

        }

    }

}


/* =====================================================
   GET INPUT VALUE
===================================================== */

function getValue(id) {

    const element =
        document.getElementById(id);

    if (!element) {
        return "";
    }

    return String(
        element.value || ""
    ).trim();

}


/* =====================================================
   LOGIN MESSAGE
===================================================== */

function showLoginMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "loginMessage"
        );

    if (!element) {
        return;
    }

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

    } else if (type === "loading") {

        element.style.background =
            "#e3f2fd";

        element.style.color =
            "#1565c0";

        element.style.border =
            "1px solid #bbdefb";

    } else {

        element.style.background =
            "#ffebee";

        element.style.color =
            "#c62828";

        element.style.border =
            "1px solid #ffcdd2";

    }

}


/* =====================================================
   APPLICATION MESSAGE
===================================================== */

function showApplicationMessage(
    element,
    message,
    type
) {

    if (!element) {
        return;
    }

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

    } else if (type === "loading") {

        element.style.background =
            "#e3f2fd";

        element.style.color =
            "#1565c0";

        element.style.border =
            "1px solid #bbdefb";

    } else {

        element.style.background =
            "#ffebee";

        element.style.color =
            "#c62828";

        element.style.border =
            "1px solid #ffcdd2";

    }

}


/* =====================================================
   BACK/FORWARD PROTECTION
===================================================== */

window.addEventListener(
    "pageshow",
    function () {

        protectRetailerPage();

    }
);


/* =====================================================
   VISIBILITY PROTECTION
===================================================== */

document.addEventListener(
    "visibilitychange",
    function () {

        if (!document.hidden) {

            protectRetailerPage();

        }

    }
);
