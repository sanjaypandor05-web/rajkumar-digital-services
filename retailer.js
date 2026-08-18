/* =========================================================
   RAJKUMAR RATIONCARD SERVICES
   FINAL RETAILER JS
   LOGIN + PAYMENT QR + APPLICATION + FILE UPLOAD
========================================================= */

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbx_Jlr04g2fJl76vXnuq2-jS4P3PPrb-p3RkrE-YZ4MMeHgygQQSutjR05xvKTC9yhu/exec";


/* =========================================================
   CONFIG
========================================================= */

const UPI_ID = "gujrat.nsfa@ybl";

const UPI_NAME =
"RAJKUMAR RATIONCARD SERVICES";

const MAX_PDF_SIZE =
8 * 1024 * 1024;

const MAX_SCREENSHOT_SIZE =
5 * 1024 * 1024;


/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        hideDashboard();

        protectRetailerPage();

        setupRetailerLogin();

        setupLogout();

        setupServiceAmount();

        setupApplicationForm();

        setupInputValidation();

    }
);


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
        sessionStorage.getItem(
            "retailerLoggedIn"
        );

    const retailerId =
        sessionStorage.getItem(
            "retailerId"
        );


    return (
        loggedIn === "true" &&
        retailerId &&
        retailerId.trim() !== ""
    );

}


/* =========================================================
   PROTECTION
========================================================= */

function protectRetailerPage() {

    if (isRetailerLoggedIn()) {

        showDashboard();

    }
    else {

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
        document.getElementById(
            "loginSection"
        );

    const dashboardSection =
        document.getElementById(
            "dashboardSection"
        );


    if (loginSection) {

        loginSection.style.display =
            "none";

    }


    if (dashboardSection) {

        dashboardSection.style.display =
            "block";

    }


    const retailerName =
        sessionStorage.getItem(
            "retailerName"
        ) || "Retailer";


    const retailerId =
        sessionStorage.getItem(
            "retailerId"
        ) || "";


    const nameElement =
        document.getElementById(
            "loggedRetailerName"
        );


    if (nameElement) {

        nameElement.textContent =
            retailerName;

    }


    const idElement =
        document.getElementById(
            "loggedRetailerId"
        );


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


            const retailerInput =
                document.getElementById(
                    "retailerId"
                );

            const passwordInput =
                document.getElementById(
                    "retailerPassword"
                );


            const retailerId =
                retailerInput
                    ? retailerInput.value.trim()
                    : "";


            const password =
                passwordInput
                    ? passwordInput.value
                    : "";


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


                    const mobile =
                        String(
                            result.retailerMobile ||
                            result.mobile ||
                            ""
                        ).trim();


                    /*
                     * ફક્ત retailer session keys clear
                     * કરવી. આખું sessionStorage clear નહીં.
                     */

                    removeRetailerSession();


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


                    if (mobile) {

                        sessionStorage.setItem(
                            "retailerMobile",
                            mobile
                        );

                    }


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

            }
            catch (error) {

                console.error(
                    "RETAILER LOGIN ERROR:",
                    error
                );


                showLoginMessage(
                    "❌ Server connection failed. Apps Script URL અથવા deployment ચેક કરો.",
                    "error"
                );

            }
            finally {

                if (button) {

                    button.disabled =
                        false;

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


/* =========================================================
   RETAILER LOGOUT
========================================================= */

function retailerLogout() {

    removeRetailerSession();

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


    setTimeout(
        function () {

            window.location.replace(
                "retailer.html?logout=" +
                Date.now()
            );

        },
        300
    );

}


/* =========================================================
   REMOVE RETAILER SESSION ONLY
========================================================= */

function removeRetailerSession() {

    const keys = [

        "retailerLoggedIn",

        "retailerId",

        "retailerName",

        "retailerMobile",

        "retailerUsername"

    ];


    keys.forEach(
        function (key) {

            try {

                sessionStorage.removeItem(
                    key
                );

            }
            catch (error) {

                console.warn(
                    "Session cleanup error:",
                    error
                );

            }

        }
    );

}


/* =========================================================
   OLD LOCAL STORAGE CLEANUP
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


    keys.forEach(
        function (key) {

            try {

                localStorage.removeItem(
                    key
                );

            }
            catch (error) {

                console.warn(
                    "Storage cleanup error:",
                    error
                );

            }

        }
    );

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
        function () {

            updateServiceAmount();

            generatePaymentQR();

        }
    );


    updateServiceAmount();

}


/* =========================================================
   UPDATE AMOUNT
========================================================= */

function updateServiceAmount() {

    const select =
        document.getElementById(
            "serviceSelect"
        );


    if (!select) {
        return;
    }


    const serviceAmount =
        document.getElementById(
            "serviceAmount"
        );


    const paymentAmount =
        document.getElementById(
            "paymentAmount"
        );


    const bottomAmount =
        document.getElementById(
            "paymentAmountBottom"
        );


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


    if (serviceAmount) {

        serviceAmount.textContent =
            amount;

    }


    if (paymentAmount) {

        paymentAmount.textContent =
            amount;

    }


    if (bottomAmount) {

        bottomAmount.textContent =
            amount;

    }

}


/* =========================================================
   PAYMENT QR
========================================================= */

function generatePaymentQR() {

    const select =
        document.getElementById(
            "serviceSelect"
        );


    const qrContainer =
        document.getElementById(
            "qrContainer"
        );


    const qrImage =
        document.getElementById(
            "paymentQR"
        );


    const qrPaymentLink =
        document.getElementById(
            "qrPaymentLink"
        );


    const qrAmount =
        document.getElementById(
            "displayQRAmount"
        );


    const upiElement =
        document.getElementById(
            "displayUPI"
        );


    const openUPIButton =
        document.getElementById(
            "openUPIButton"
        );


    if (
        !select ||
        !select.value
    ) {

        hideQR();

        return;

    }


    const option =
        select.options[
            select.selectedIndex
        ];


    const amount =
        Number(
            option.dataset.amount || 0
        );


    if (amount <= 0) {

        hideQR();

        return;

    }


    const serviceName =
        option.textContent
            .trim()
            .replace(
                /\s*-\s*₹\s*[\d,]+\s*$/,
                ""
            );


    const upiLink =
        "upi://pay" +

        "?pa=" +
        encodeURIComponent(
            UPI_ID
        ) +

        "&pn=" +
        encodeURIComponent(
            UPI_NAME
        ) +

        "&am=" +
        encodeURIComponent(
            amount.toFixed(2)
        ) +

        "&cu=INR" +

        "&tn=" +
        encodeURIComponent(
            serviceName
        );


    const qrURL =
        "https://api.qrserver.com/v1/create-qr-code/" +

        "?size=300x300" +

        "&data=" +
        encodeURIComponent(
            upiLink
        );


    if (qrImage) {

        qrImage.src =
            qrURL;

    }


    if (qrPaymentLink) {

        qrPaymentLink.href =
            upiLink;

    }


    if (qrAmount) {

        qrAmount.textContent =
            amount;

    }


    if (upiElement) {

        upiElement.textContent =
            UPI_ID;

    }


    if (qrContainer) {

        qrContainer.style.display =
            "block";

    }


    if (openUPIButton) {

        openUPIButton.onclick =
            function () {

                window.location.href =
                    upiLink;

            };

    }

}


/* =========================================================
   HIDE QR
========================================================= */

function hideQR() {

    const qrContainer =
        document.getElementById(
            "qrContainer"
        );


    const qrImage =
        document.getElementById(
            "paymentQR"
        );


    if (qrContainer) {

        qrContainer.style.display =
            "none";

    }


    if (qrImage) {

        qrImage.src = "";

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


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (!isRetailerLoggedIn()) {

                forceLogin();

                showLoginMessage(
                    "❌ પહેલા Retailer Login કરો.",
                    "error"
                );

                return;

            }


            const serviceSelect =
                document.getElementById(
                    "serviceSelect"
                );


            const message =
                document.getElementById(
                    "applicationMessage"
                );


            if (
                !serviceSelect ||
                !serviceSelect.value
            ) {

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


            /* =================================================
               FILES
            ================================================= */

            const aadhaarInput =
                document.getElementById(
                    "aadhaarFile"
                );


            const rationcardInput =
                document.getElementById(
                    "rationcardFile"
                );


            const screenshotInput =
                document.getElementById(
                    "paymentScreenshot"
                );


            const aadhaarFile =
                aadhaarInput &&
                aadhaarInput.files.length
                    ? aadhaarInput.files[0]
                    : null;


            const rationcardFile =
                rationcardInput &&
                rationcardInput.files.length
                    ? rationcardInput.files[0]
                    : null;


            const paymentScreenshot =
                screenshotInput &&
                screenshotInput.files.length
                    ? screenshotInput.files[0]
                    : null;


            /* =================================================
               REQUIRED FILE CHECK
            ================================================= */

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


            /* =================================================
               FILE VALIDATION
            ================================================= */

            const aadhaarCheck =
                validatePDF(
                    aadhaarFile,
                    MAX_PDF_SIZE,
                    "Aadhaar"
                );


            if (!aadhaarCheck.valid) {

                showApplicationMessage(
                    message,
                    "⚠️ " +
                    aadhaarCheck.message,
                    "error"
                );

                return;

            }


            if (rationcardFile) {

                const rationCheck =
                    validatePDF(
                        rationcardFile,
                        MAX_PDF_SIZE,
                        "RATIONCARD"
                    );


                if (!rationCheck.valid) {

                    showApplicationMessage(
                        message,
                        "⚠️ " +
                        rationCheck.message,
                        "error"
                    );

                    return;

                }

            }


            const screenshotCheck =
                validateImage(
                    paymentScreenshot,
                    MAX_SCREENSHOT_SIZE
                );


            if (!screenshotCheck.valid) {

                showApplicationMessage(
                    message,
                    "⚠️ " +
                    screenshotCheck.message,
                    "error"
                );

                return;

            }


            /* =================================================
               BUTTON
            ================================================= */

            const button =
                document.getElementById(
                    "applicationSubmitButton"
                );


            if (button) {

                button.disabled =
                    true;

                button.textContent =
                    "⏳ Submitting...";

            }


            showApplicationMessage(
                message,
                "⏳ Application submit થઈ રહી છે...<br>Files upload થઈ રહી છે, કૃપા કરીને રાહ જુઓ.",
                "loading"
            );


            try {

                /* =================================================
                   FILE TO BASE64
                ================================================= */

                const aadhaarData =
                    await fileToBase64(
                        aadhaarFile
                    );


                let rationcardData =
                    null;


                if (rationcardFile) {

                    rationcardData =
                        await fileToBase64(
                            rationcardFile
                        );

                }


                const screenshotData =
                    await fileToBase64(
                        paymentScreenshot
                    );


                /* =================================================
                   RETAILER DETAILS
                ================================================= */

                const retailerId =
                    sessionStorage.getItem(
                        "retailerId"
                    ) || "";


                const retailerName =
                    sessionStorage.getItem(
                        "retailerName"
                    ) || "";


                const retailerMobile =
                    sessionStorage.getItem(
                        "retailerMobile"
                    ) || "";


                const retailerUsername =
                    sessionStorage.getItem(
                        "retailerUsername"
                    ) || "";


                /* =================================================
                   FORM DATA
                ================================================= */

                const data = {

                    action:
                        "submitApplication",


                    /* RETAILER */

                    retailerId:
                        retailerId,

                    retailerName:
                        retailerName,

                    retailerMobile:
                        retailerMobile,

                    retailerUsername:
                        retailerUsername,


                    /* SERVICE */

                    service:
                        serviceSelect.value,

                    serviceName:
                        option.textContent.trim(),

                    amount:
                        amount,


                    /* PERSONAL */

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
                        getValue(
                            "rationcardStatus"
                        ),

                    utrNumber:
                        getValue(
                            "utrNumber"
                        ),


                    /* PAYMENT */

                    paymentAmount:
                        amount,

                    paymentStatus:
                        "Pending",


                    /* =================================================
                       FILE OBJECTS
                       Code.gs should read these exact fields.
                    ================================================= */

                    aadhaarFile:
                        aadhaarData,

                    rationcardFile:
                        rationcardData,

                    paymentScreenshot:
                        screenshotData

                };


                console.log(
                    "Submitting application:",
                    {
                        retailerId:
                            data.retailerId,

                        service:
                            data.service,

                        amount:
                            data.amount,

                        aadhaarFile:
                            !!data.aadhaarFile,

                        rationcardFile:
                            !!data.rationcardFile,

                        paymentScreenshot:
                            !!data.paymentScreenshot
                    }
                );


                /* =================================================
                   SEND TO APPS SCRIPT
                ================================================= */

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
                                JSON.stringify(
                                    data
                                )
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "HTTP Error " +
                        response.status
                    );

                }


                const responseText =
                    await response.text();


                let result;


                try {

                    result =
                        JSON.parse(
                            responseText
                        );

                }
                catch (parseError) {

                    console.error(
                        "Invalid Apps Script response:",
                        responseText
                    );

                    throw new Error(
                        "Apps Script તરફથી valid JSON response મળ્યો નથી."
                    );

                }


                console.log(
                    "Apps Script result:",
                    result
                );


                /* =================================================
                   SUCCESS
                ================================================= */

                if (
                    result &&
                    result.success === true
                ) {

                    showApplicationMessage(

                        message,

                        "✅ Application Successfully Submitted!" +

                        "<br><br>" +

                        "<strong>Application ID:</strong> " +

                        (
                            result.applicationId ||
                            "Generated"
                        ) +

                        "<br><br>" +

                        "Payment Status: Pending" +

                        "<br>" +

                        "📁 Documents uploaded successfully.",

                        "success"

                    );


                    /* RESET FORM */

                    form.reset();


                    /* RESET AMOUNT */

                    updateServiceAmount();


                    /* HIDE QR */

                    hideQR();


                    return;

                }


                /* =================================================
                   BACKEND ERROR
                ================================================= */

                showApplicationMessage(

                    message,

                    result &&
                    result.message

                        ? "❌ " +
                          result.message

                        : "❌ Application submit failed.",

                    "error"

                );

            }
            catch (error) {

                console.error(
                    "APPLICATION SUBMIT ERROR:",
                    error
                );


                showApplicationMessage(

                    message,

                    "❌ Application submit failed." +

                    "<br><br>" +

                    error.message,

                    "error"

                );

            }
            finally {

                if (button) {

                    button.disabled =
                        false;

                    button.textContent =
                        "🚀 Submit Application";

                }

            }

        }
    );

}


/* =========================================================
   GET VALUE
========================================================= */

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


/* =========================================================
   PDF VALIDATION
========================================================= */

function validatePDF(
    file,
    maxSize,
    label
) {

    if (!file) {

        return {
            valid: false,
            message:
                label +
                " PDF upload કરો."
        };

    }


    const fileName =
        file.name.toLowerCase();


    const isPDF =
        file.type === "application/pdf" ||
        fileName.endsWith(".pdf");


    if (!isPDF) {

        return {
            valid: false,
            message:
                label +
                " file PDF હોવી જોઈએ."
        };

    }


    if (file.size > maxSize) {

        return {
            valid: false,
            message:
                label +
                " PDF 8 MB કરતાં મોટી છે."
        };

    }


    if (file.size <= 0) {

        return {
            valid: false,
            message:
                label +
                " file empty છે."
        };

    }


    return {
        valid: true,
        message: ""
    };

}


/* =========================================================
   IMAGE VALIDATION
========================================================= */

function validateImage(
    file,
    maxSize
) {

    if (!file) {

        return {
            valid: false,
            message:
                "Payment Screenshot upload કરો."
        };

    }


    const isImage =
        file.type.startsWith(
            "image/"
        );


    if (!isImage) {

        return {
            valid: false,
            message:
                "Payment Screenshot image હોવી જોઈએ."
        };

    }


    if (file.size > maxSize) {

        return {
            valid: false,
            message:
                "Payment Screenshot 5 MB કરતાં મોટી છે."
        };

    }


    if (file.size <= 0) {

        return {
            valid: false,
            message:
                "Payment Screenshot empty છે."
        };

    }


    return {
        valid: true,
        message: ""
    };

}


/* =========================================================
   FILE TO BASE64
========================================================= */

function fileToBase64(file) {

    return new Promise(
        function (resolve, reject) {

            if (!file) {

                resolve(null);

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function () {

                    try {

                        const result =
                            String(
                                reader.result || ""
                            );


                        const commaIndex =
                            result.indexOf(",");


                        if (
                            commaIndex === -1
                        ) {

                            reject(
                                new Error(
                                    "File conversion failed: " +
                                    file.name
                                )
                            );

                            return;

                        }


                        const base64 =
                            result.substring(
                                commaIndex + 1
                            );


                        if (!base64) {

                            reject(
                                new Error(
                                    "File data empty: " +
                                    file.name
                                )
                            );

                            return;

                        }


                        resolve({

                            name:
                                file.name,

                            mimeType:
                                file.type ||
                                "application/octet-stream",

                            size:
                                file.size,

                            data:
                                base64

                        });

                    }
                    catch (error) {

                        reject(error);

                    }

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


            reader.onabort =
                function () {

                    reject(
                        new Error(
                            "File reading aborted: " +
                            file.name
                        )
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* =========================================================
   INPUT VALIDATION
========================================================= */

function setupInputValidation() {

    const mobile =
        document.getElementById(
            "mobile"
        );


    const pincode =
        document.getElementById(
            "pincode"
        );


    if (mobile) {

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


    if (pincode) {

        pincode.addEventListener(
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
                            6
                        );

            }
        );

    }

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
   PAGESHOW
========================================================= */

window.addEventListener(
    "pageshow",
    function () {

        protectRetailerPage();

    }
);


/* =========================================================
   VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    function () {

        if (!document.hidden) {

            protectRetailerPage();

        }

    }
);
