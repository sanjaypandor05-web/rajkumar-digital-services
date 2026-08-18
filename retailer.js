/* =========================================================
   RAJKUMAR RATIONCARD SERVICES
   FINAL RETAILER JS
   LOGIN + QR + PAYMENT + DOCUMENT UPLOAD + SUBMIT
========================================================= */

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbx_Jlr04g2fJl76vXnuq2-jS4P3PPrb-p3RkrE-YZ4MMeHgygQQSutjR05xvKTC9yhu/exec";


/* =========================================================
   START
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    hideDashboard();

    protectRetailerPage();

    setupRetailerLogin();

    setupLogout();

    setupServiceAmount();

    setupApplicationForm();

    setupInputRestrictions();

});


/* =========================================================
   HIDE DASHBOARD
========================================================= */

function hideDashboard() {

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


/* =========================================================
   LOGIN CHECK
========================================================= */

function isRetailerLoggedIn() {

    const loggedIn =
        sessionStorage.getItem("retailerLoggedIn");

    const retailerId =
        sessionStorage.getItem("retailerId");

    return (
        loggedIn === "true" &&
        retailerId &&
        retailerId.trim() !== ""
    );

}


/* =========================================================
   PROTECT PAGE
========================================================= */

function protectRetailerPage() {

    if (isRetailerLoggedIn()) {

        showDashboard();

    } else {

        forceLogin();

    }

}


/* =========================================================
   FORCE LOGIN
========================================================= */

function forceLogin() {

    hideDashboard();

    clearOldPermanentLogin();

}


/* =========================================================
   SHOW DASHBOARD
========================================================= */

function showDashboard() {

    if (!isRetailerLoggedIn()) {

        forceLogin();

        return;

    }

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
        nameElement.textContent = retailerName;
    }

    const idElement =
        document.getElementById("loggedRetailerId");

    if (idElement) {
        idElement.textContent =
            "Retailer ID: " + retailerId;
    }

}


/* =========================================================
   RETAILER LOGIN
========================================================= */

function setupRetailerLogin() {

    const form =
        document.getElementById(
            "retailerLoginForm"
        );

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const retailerId =
                document
                    .getElementById("retailerId")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("retailerPassword")
                    .value;

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

                button.textContent =
                    "LOGIN...";

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
                        "HTTP Error " +
                        response.status
                    );

                }

                const result =
                    await response.json();

                if (
                    result &&
                    result.success === true
                ) {

                    const id =
                        String(
                            result.retailerId ||
                            retailerId
                        ).trim();

                    const name =
                        String(
                            result.retailerName ||
                            id
                        ).trim();

                    const username =
                        String(
                            result.username ||
                            retailerId
                        ).trim();

                    sessionStorage.clear();

                    sessionStorage.setItem(
                        "retailerLoggedIn",
                        "true"
                    );

                    sessionStorage.setItem(
                        "retailerId",
                        id
                    );

                    sessionStorage.setItem(
                        "retailerName",
                        name
                    );

                    sessionStorage.setItem(
                        "retailerUsername",
                        username
                    );

                    clearOldPermanentLogin();

                    showLoginMessage(
                        "✅ Login Successful.",
                        "success"
                    );

                    setTimeout(
                        function () {
                            showDashboard();
                        },
                        300
                    );

                    return;

                }

                showLoginMessage(

                    result &&
                    result.message

                        ? "❌ " +
                          result.message

                        : "❌ Invalid Retailer ID અથવા Password.",

                    "error"

                );

            } catch (error) {

                console.error(
                    "RETAILER LOGIN ERROR:",
                    error
                );

                showLoginMessage(
                    "❌ Server connection failed. Apps Script URL અથવા deployment ચેક કરો.",
                    "error"
                );

            } finally {

                if (button) {

                    button.disabled = false;

                    button.textContent =
                        "LOGIN";

                }

            }

        }
    );

}


/* =========================================================
   LOGOUT
========================================================= */

function setupLogout() {

    const button =
        document.getElementById(
            "logoutButton"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            retailerLogout();

        }
    );

}


function retailerLogout() {

    sessionStorage.clear();

    clearOldPermanentLogin();

    hideDashboard();

    const loginForm =
        document.getElementById(
            "retailerLoginForm"
        );

    if (loginForm) {
        loginForm.reset();
    }

    showLoginMessage(
        "✅ Logout successful. ફરીથી Login કરો.",
        "success"
    );

}


/* =========================================================
   CLEAR OLD STORAGE
========================================================= */

function clearOldPermanentLogin() {

    const keys = [

        "rajkumarRole",
        "rajkumarRetailerId",
        "rajkumarRetailerName",
        "rajkumarRetailerMobile",
        "rajkumarRetailerUsername",

        "retailerId",
        "retailerName",
        "retailerMobile",
        "retailerUsername",
        "retailerLoggedIn"

    ];

    keys.forEach(function (key) {

        try {

            localStorage.removeItem(key);

        } catch (error) {

            console.warn(
                "Storage cleanup error:",
                error
            );

        }

    });

}


/* =========================================================
   LOGIN MESSAGE
========================================================= */

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

    element.style.display = "block";

    element.innerHTML = message;

    element.style.padding = "12px";

    element.style.marginTop = "15px";

    element.style.borderRadius = "10px";

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


/* =========================================================
   SERVICE AMOUNT
========================================================= */

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


/* =========================================================
   UPDATE SERVICE AMOUNT
========================================================= */

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

    const elements = [

        "serviceAmount",
        "paymentAmount",
        "finalPaymentAmount"

    ];

    elements.forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {

            element.textContent =
                amount;

        }

    });

}


/* =========================================================
   APPLICATION FORM
========================================================= */

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
        submitApplication
    );

}


/* =========================================================
   SUBMIT APPLICATION
========================================================= */

async function submitApplication(event) {

    event.preventDefault();

    if (!isRetailerLoggedIn()) {

        forceLogin();

        showLoginMessage(
            "❌ પહેલા Retailer Login કરો.",
            "error"
        );

        return;

    }

    const message =
        document.getElementById(
            "applicationMessage"
        );

    const serviceSelect =
        document.getElementById(
            "serviceSelect"
        );

    const service =
        serviceSelect
            ? serviceSelect.value
            : "";

    if (!service) {

        showApplicationMessage(
            message,
            "⚠️ પહેલા Service પસંદ કરો.",
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


    /* =====================================================
       REQUIRED DOCUMENTS
    ===================================================== */

    const aadhaarFile =
        document.getElementById(
            "aadhaarFile"
        ).files[0];

    const rationcardInput =
        document.getElementById(
            "rationcardFile"
        );

    const rationcardFile =
        rationcardInput &&
        rationcardInput.files.length
            ? rationcardInput.files[0]
            : null;

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


    if (!isPdf(aadhaarFile)) {

        showApplicationMessage(
            message,
            "⚠️ Aadhaar file PDF હોવી જોઈએ.",
            "error"
        );

        return;

    }


    if (
        rationcardFile &&
        !isPdf(rationcardFile)
    ) {

        showApplicationMessage(
            message,
            "⚠️ RATIONCARD file PDF હોવી જોઈએ.",
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


    if (!paymentScreenshot.type.startsWith("image/")) {

        showApplicationMessage(
            message,
            "⚠️ Payment Screenshot image હોવો જોઈએ.",
            "error"
        );

        return;

    }


    const utrNumber =
        document.getElementById(
            "utrNumber"
        ).value.trim();


    if (!utrNumber) {

        showApplicationMessage(
            message,
            "⚠️ UTR Number દાખલ કરો.",
            "error"
        );

        return;

    }


    /* =====================================================
       FORM VALIDATION
    ===================================================== */

    const form =
        document.getElementById(
            "applicationForm"
        );

    if (!form.checkValidity()) {

        form.reportValidity();

        return;

    }


    const button =
        document.getElementById(
            "applicationSubmitButton"
        );

    if (button) {

        button.disabled = true;

        button.classList.add(
            "submit-loading"
        );

        button.textContent =
            "⏳ Uploading & Submitting...";

    }


    showApplicationMessage(
        message,
        "⏳ Documents upload થઈ રહ્યા છે. કૃપા કરીને રાહ જુઓ...",
        "loading"
    );


    try {

        /* =================================================
           CONVERT FILES TO BASE64
        ================================================= */

        const aadhaarBase64 =
            await fileToBase64(
                aadhaarFile
            );

        const rationcardBase64 =
            rationcardFile
                ? await fileToBase64(
                    rationcardFile
                  )
                : null;

        const paymentBase64 =
            await fileToBase64(
                paymentScreenshot
            );


        /* =================================================
           APPLICATION DATA
        ================================================= */

        const data = {

            action:
                "submitApplication",

            retailerId:
                sessionStorage.getItem(
                    "retailerId"
                ) || "",

            retailerMobile:
                sessionStorage.getItem(
                    "retailerMobile"
                ) || "",

            service:
                service,

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


            aadhaarFile: {

                name:
                    aadhaarFile.name,

                mimeType:
                    aadhaarFile.type ||
                    "application/pdf",

                data:
                    aadhaarBase64

            },


            rationcardFile:
                rationcardBase64
                    ? {

                        name:
                            rationcardFile.name,

                        mimeType:
                            rationcardFile.type ||
                            "application/pdf",

                        data:
                            rationcardBase64

                    }
                    : null,


            paymentScreenshot: {

                name:
                    paymentScreenshot.name,

                mimeType:
                    paymentScreenshot.type ||
                    "image/jpeg",

                data:
                    paymentBase64

            }

        };


        /* =================================================
           SEND TO GOOGLE APPS SCRIPT
        ================================================= */

        const response =
            await fetch(
                SCRIPT_URL,
                {

                    method: "POST",

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
                "HTTP Error " +
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

                "✅ Application Successfully Submitted!<br>" +
                "<strong>Application ID:</strong> " +
                result.applicationId,

                "success"
            );


            /* =================================================
               RESET FORM
            ================================================= */

            form.reset();

            updateServiceAmount();


            /* Keep QR visible */
            const paymentBox =
                document.getElementById(
                    "paymentBox"
                );

            if (paymentBox) {

                paymentBox.style.display =
                    "block";

            }

        } else {

            showApplicationMessage(
                message,

                "❌ " +
                (
                    result &&
                    result.message
                        ? result.message
                        : "Application submit failed."
                ),

                "error"
            );

        }


    } catch (error) {

        console.error(
            "APPLICATION SUBMIT ERROR:",
            error
        );

        showApplicationMessage(
            message,
            "❌ Server error: " +
            error.message,
            "error"
        );

    } finally {

        if (button) {

            button.disabled = false;

            button.classList.remove(
                "submit-loading"
            );

            button.textContent =
                "🚀 Submit Application";

        }

    }

}


/* =========================================================
   FILE TO BASE64
========================================================= */

function fileToBase64(file) {

    return new Promise(
        function (resolve, reject) {

            const reader =
                new FileReader();

            reader.onload = function () {

                const result =
                    reader.result;

                const base64 =
                    String(result)
                        .split(",")[1];

                resolve(base64);

            };

            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "File read failed: " +
                            file.name
                        )
                    );

                };

            reader.readAsDataURL(file);

        }
    );

}


/* =========================================================
   PDF CHECK
========================================================= */

function isPdf(file) {

    return (
        file &&
        (
            file.type === "application/pdf" ||
            file.name
                .toLowerCase()
                .endsWith(".pdf")
        )
    );

}


/* =========================================================
   GET VALUE
========================================================= */

function getValue(id) {

    const element =
        document.getElementById(id);

    return element
        ? element.value.trim()
        : "";

}


/* =========================================================
   APPLICATION MESSAGE
========================================================= */

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


/* =========================================================
   INPUT RESTRICTIONS
========================================================= */

function setupInputRestrictions() {

    const mobile =
        document.getElementById("mobile");

    if (mobile) {

        mobile.addEventListener(
            "input",
            function () {

                this.value =
                    this.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

            }
        );

    }


    const pincode =
        document.getElementById("pincode");

    if (pincode) {

        pincode.addEventListener(
            "input",
            function () {

                this.value =
                    this.value
                        .replace(/\D/g, "")
                        .slice(0, 6);

            }
        );

    }


    const birthYear =
        document.getElementById(
            "birthYear"
        );

    if (birthYear) {

        birthYear.addEventListener(
            "input",
            function () {

                this.value =
                    this.value
                        .replace(/\D/g, "")
                        .slice(0, 4);

            }
        );

    }

}


/* =========================================================
   BACK/FORWARD PROTECTION
========================================================= */

window.addEventListener(
    "pageshow",
    function () {

        protectRetailerPage();

    }
);


/* =========================================================
   VISIBILITY PROTECTION
========================================================= */

document.addEventListener(
    "visibilitychange",
    function () {

        if (!document.hidden) {

            protectRetailerPage();

        }

    }
);
