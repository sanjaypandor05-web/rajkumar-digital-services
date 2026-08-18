/* =====================================================
   RAJKUMAR RATIONCARD SERVICES
   FINAL RETAILER JAVASCRIPT

   FEATURES:
   ✔ Retailer Login
   ✔ Session Protection
   ✔ Logout
   ✔ Service Selection
   ✔ Automatic Amount
   ✔ Automatic UPI QR
   ✔ Aadhaar PDF
   ✔ Rationcard PDF
   ✔ Payment Screenshot
   ✔ UTR Number
   ✔ Submit Application
   ✔ Google Apps Script
===================================================== */


/* =====================================================
   GOOGLE APPS SCRIPT URL
===================================================== */

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbx_Jlr04g2fJl76vXnuq2-jS4P3PPrb-p3RkrE-YZ4MMeHgygQQSutjR05xvKTC9yhu/exec";


/* =====================================================
   UPI CONFIG
===================================================== */

const UPI_ID =
"gujrat.nsfa@ybl";

const UPI_NAME =
"RAJKUMAR RATIONCARD SERVICES";


/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        hideDashboard();

        protectRetailerPage();

        setupRetailerLogin();

        setupLogout();

        setupServiceAmount();

        setupApplicationForm();

        setupFileInputs();

        setupNumericFields();

    }
);


/* =====================================================
   HIDE DASHBOARD
===================================================== */

function hideDashboard() {

    const loginSection =
        document.getElementById("loginSection");

    const dashboardSection =
        document.getElementById("dashboardSection");


    if (loginSection) {

        loginSection.style.display =
            "block";

    }


    if (dashboardSection) {

        dashboardSection.style.display =
            "none";

    }

}


/* =====================================================
   LOGIN CHECK
===================================================== */

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


/* =====================================================
   PAGE PROTECTION
===================================================== */

function protectRetailerPage() {

    if (
        isRetailerLoggedIn()
    ) {

        showDashboard();

    }
    else {

        forceLogin();

    }

}


/* =====================================================
   FORCE LOGIN
===================================================== */

function forceLogin() {

    hideDashboard();

    clearOldPermanentLogin();

}


/* =====================================================
   SHOW DASHBOARD
===================================================== */

function showDashboard() {

    if (
        !isRetailerLoggedIn()
    ) {

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
        ) ||
        "Retailer";


    const retailerId =
        sessionStorage.getItem(
            "retailerId"
        ) ||
        "";


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
            "Retailer ID: " +
            retailerId;

    }

}


/* =====================================================
   RETAILER LOGIN
===================================================== */

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
                    .getElementById(
                        "retailerId"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "retailerPassword"
                    )
                    .value;


            if (
                !retailerId ||
                !password
            ) {

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

                button.disabled =
                    true;

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

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "text/plain;charset=utf-8"

                            },

                            body:
                                JSON.stringify({

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


                console.log(
                    "RETAILER LOGIN RESULT:",
                    result
                );


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
                            result.mobile ||
                            ""
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


                    sessionStorage.setItem(
                        "retailerMobile",
                        mobile
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


/* =====================================================
   LOGOUT
===================================================== */

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


/* =====================================================
   FINAL LOGOUT
===================================================== */

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


/* =====================================================
   CLEAR OLD LOGIN
===================================================== */

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


    if (
        type === "success"
    ) {

        element.style.background =
            "#e8f5e9";

        element.style.color =
            "#2e7d32";

        element.style.border =
            "1px solid #c8e6c9";

    }
    else if (
        type === "loading"
    ) {

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


/* =====================================================
   UPDATE AMOUNT + QR
===================================================== */

function updateServiceAmount() {

    const select =
        document.getElementById(
            "serviceSelect"
        );


    const amountElement =
        document.getElementById(
            "serviceAmount"
        );


    const paymentElement =
        document.getElementById(
            "paymentAmount"
        );


    const qrAmount =
        document.getElementById(
            "qrAmount"
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


    if (amountElement) {

        amountElement.textContent =
            amount;

    }


    if (paymentElement) {

        paymentElement.textContent =
            amount;

    }


    if (qrAmount) {

        qrAmount.textContent =
            amount;

    }


    if (amount > 0) {

        generatePaymentQR(
            amount
        );

    }
    else {

        hidePaymentQR();

    }

}


/* =====================================================
   GENERATE UPI QR
===================================================== */

function generatePaymentQR(
    amount
) {

    const qrContainer =
        document.getElementById(
            "qrContainer"
        );


    const qrImage =
        document.getElementById(
            "paymentQR"
        );


    const paymentWaiting =
        document.getElementById(
            "paymentWaiting"
        );


    if (
        !qrContainer ||
        !qrImage
    ) {

        return;

    }


    const retailerId =
        sessionStorage.getItem(
            "retailerId"
        ) ||
        "Retailer";


    const transactionNote =
        "Rationcard Service - " +
        retailerId;


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
            Number(amount).toFixed(2)
        ) +

        "&cu=INR" +

        "&tn=" +
        encodeURIComponent(
            transactionNote
        );


    /*
     * QR Image
     *
     * This creates a QR from the UPI URL.
     */

    const qrUrl =
        "https://api.qrserver.com/v1/create-qr-code/" +
        "?size=300x300" +
        "&data=" +
        encodeURIComponent(
            upiLink
        );


    qrImage.src =
        qrUrl;


    qrImage.dataset.upi =
        upiLink;


    qrContainer.style.display =
        "block";


    if (paymentWaiting) {

        paymentWaiting.style.display =
            "none";

    }

}


/* =====================================================
   HIDE QR
===================================================== */

function hidePaymentQR() {

    const qrContainer =
        document.getElementById(
            "qrContainer"
        );


    const paymentWaiting =
        document.getElementById(
            "paymentWaiting"
        );


    const qrImage =
        document.getElementById(
            "paymentQR"
        );


    if (qrContainer) {

        qrContainer.style.display =
            "none";

    }


    if (paymentWaiting) {

        paymentWaiting.style.display =
            "block";

        paymentWaiting.textContent =
            "⚠️ પહેલા Service પસંદ કરો.";

    }


    if (qrImage) {

        qrImage.src =
            "";

    }

}


/* =====================================================
   FILE INPUT SETUP
===================================================== */

function setupFileInputs() {

    const aadhaar =
        document.getElementById(
            "aadhaarFile"
        );


    const rationcard =
        document.getElementById(
            "rationcardFile"
        );


    const screenshot =
        document.getElementById(
            "paymentScreenshot"
        );


    if (aadhaar) {

        aadhaar.addEventListener(
            "change",
            function () {

                validatePDF(
                    aadhaar,
                    "aadhaarFileName",
                    true
                );

            }
        );

    }


    if (rationcard) {

        rationcard.addEventListener(
            "change",
            function () {

                validatePDF(
                    rationcard,
                    "rationcardFileName",
                    false
                );

            }
        );

    }


    if (screenshot) {

        screenshot.addEventListener(
            "change",
            function () {

                validatePaymentFile(
                    screenshot,
                    "paymentScreenshotName"
                );

            }
        );

    }

}


/* =====================================================
   VALIDATE PDF
===================================================== */

function validatePDF(
    input,
    displayId,
    required
) {

    const display =
        document.getElementById(
            displayId
        );


    if (!input.files || !input.files[0]) {

        if (display) {

            display.textContent =
                "";

        }

        return;

    }


    const file =
        input.files[0];


    const isPDF =
        file.type ===
            "application/pdf" ||

        file.name
            .toLowerCase()
            .endsWith(".pdf");


    if (!isPDF) {

        alert(
            "❌ PDF file જ upload કરો."
        );


        input.value =
            "";


        if (display) {

            display.textContent =
                "";

        }

        return;

    }


    if (display) {

        display.textContent =
            "✅ " + file.name;

    }

}


/* =====================================================
   VALIDATE PAYMENT FILE
===================================================== */

function validatePaymentFile(
    input,
    displayId
) {

    const display =
        document.getElementById(
            displayId
        );


    if (
        !input.files ||
        !input.files[0]
    ) {

        return;

    }


    const file =
        input.files[0];


    const allowed =
        file.type.startsWith(
            "image/"
        ) ||

        file.type ===
            "application/pdf" ||

        file.name
            .toLowerCase()
            .endsWith(".pdf");


    if (!allowed) {

        alert(
            "❌ Payment Screenshot image અથવા PDF હોવો જોઈએ."
        );


        input.value =
            "";


        return;

    }


    if (display) {

        display.textContent =
            "✅ " + file.name;

    }

}


/* =====================================================
   NUMERIC FIELDS
===================================================== */

function setupNumericFields() {

    const pincode =
        document.getElementById(
            "pincode"
        );


    const mobile =
        document.getElementById(
            "mobile"
        );


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
        async function (event) {

            event.preventDefault();


            if (
                !isRetailerLoggedIn()
            ) {

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
                    option.dataset.amount ||
                    0
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
            ================================================== */

            const aadhaarFile =
                document.getElementById(
                    "aadhaarFile"
                );


            const rationcardFile =
                document.getElementById(
                    "rationcardFile"
                );


            const paymentScreenshot =
                document.getElementById(
                    "paymentScreenshot"
                );


            if (
                !aadhaarFile ||
                !aadhaarFile.files ||
                !aadhaarFile.files[0]
            ) {

                showApplicationMessage(
                    message,
                    "⚠️ Aadhaar PDF upload કરો.",
                    "error"
                );

                return;

            }


            if (
                !paymentScreenshot ||
                !paymentScreenshot.files ||
                !paymentScreenshot.files[0]
            ) {

                showApplicationMessage(
                    message,
                    "⚠️ Payment Screenshot upload કરો.",
                    "error"
                );

                return;

            }


            /* =================================================
               UTR
            ================================================== */

            const utrNumber =
                document.getElementById(
                    "utrNumber"
                ).value.trim();


            if (!utrNumber) {

                showApplicationMessage(
                    message,
                    "⚠️ Payment પછી UTR Number દાખલ કરો.",
                    "error"
                );

                return;

            }


            /* =================================================
               RETAILER DATA
            ================================================== */

            const retailerId =
                sessionStorage.getItem(
                    "retailerId"
                ) || "";


            const retailerMobile =
                sessionStorage.getItem(
                    "retailerMobile"
                ) || "";


            if (!retailerId) {

                forceLogin();

                return;

            }


            /* =================================================
               BUTTON
            ================================================== */

            const button =
                document.getElementById(
                    "applicationSubmitButton"
                );


            if (button) {

                button.disabled =
                    true;

                button.textContent =
                    "⏳ Uploading & Submitting...";

            }


            showApplicationMessage(
                message,
                "⏳ Documents upload થઈ રહ્યા છે. કૃપા કરીને wait કરો...",
                "loading"
            );


            try {

                /* =============================================
                   CONVERT FILES TO BASE64
                ============================================== */

                const aadhaarData =
                    await fileToBase64(
                        aadhaarFile.files[0],
                        "Aadhaar"
                    );


                let rationcardData = null;


                if (
                    rationcardFile &&
                    rationcardFile.files &&
                    rationcardFile.files[0]
                ) {

                    rationcardData =
                        await fileToBase64(
                            rationcardFile.files[0],
                            "RATIONCARD"
                        );

                }


                const paymentData =
                    await fileToBase64(
                        paymentScreenshot.files[0],
                        "Payment Screenshot"
                    );


                /* =============================================
                   COLLECT FORM DATA
                ============================================== */

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
                        getValue(
                            "aadhaarName"
                        ),


                    englishName:
                        getValue(
                            "englishName"
                        ),


                    gujaratiName:
                        getValue(
                            "gujaratiName"
                        ),


                    rationCardNo:
                        getValue(
                            "rationCardNo"
                        ),


                    gender:
                        getValue(
                            "gender"
                        ),


                    village:
                        getValue(
                            "village"
                        ),


                    taluka:
                        getValue(
                            "taluka"
                        ),


                    district:
                        getValue(
                            "district"
                        ),


                    pincode:
                        getValue(
                            "pincode"
                        ),


                    mobile:
                        getValue(
                            "mobile"
                        ),


                    email:
                        getValue(
                            "email"
                        ),


                    birthDate:
                        getValue(
                            "birthDate"
                        ),


                    birthYear:
                        getValue(
                            "birthYear"
                        ),


                    rationcardStatus:
                        getValue(
                            "rationcardStatus"
                        ),


                    utrNumber:
                        utrNumber,


                    aadhaarFile:
                        aadhaarData,


                    rationcardFile:
                        rationcardData,


                    paymentScreenshot:
                        paymentData

                };


                console.log(
                    "SUBMIT DATA:",
                    data
                );


                /* =============================================
                   SEND TO GOOGLE APPS SCRIPT
                ============================================== */

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

                        "✅ Application Successfully Submitted!<br><br>" +

                        "<strong>Application ID:</strong> " +

                        result.applicationId +

                        "<br><br>" +

                        "<strong>Service:</strong> " +

                        (result.service || "") +

                        "<br>" +

                        "<strong>Amount:</strong> ₹" +

                        (result.amount || amount),

                        "success"

                    );


                    /*
                     * Reset form after successful submission.
                     */

                    form.reset();


                    /*
                     * Reset amounts and QR.
                     */

                    if (serviceSelect) {

                        serviceSelect.value =
                            "";

                    }


                    updateServiceAmount();


                    clearFileNames();


                }
                else {

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

            }
            catch (error) {

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


/* =====================================================
   FILE → BASE64
===================================================== */

function fileToBase64(
    file,
    prefix
) {

    return new Promise(
        function (
            resolve,
            reject
        ) {

            if (!file) {

                reject(
                    new Error(
                        prefix +
                        " file missing."
                    )
                );

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function () {

                    try {

                        const result =
                            String(
                                reader.result
                            );


                        const commaIndex =
                            result.indexOf(
                                ","
                            );


                        if (
                            commaIndex ===
                            -1
                        ) {

                            reject(
                                new Error(
                                    "Invalid " +
                                    prefix +
                                    " file data."
                                )
                            );

                            return;

                        }


                        const base64 =
                            result.substring(
                                commaIndex + 1
                            );


                        resolve({

                            name:
                                file.name,

                            mimeType:
                                file.type ||
                                "application/octet-stream",

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
                            "Could not read " +
                            prefix +
                            " file."
                        )
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* =====================================================
   GET VALUE
===================================================== */

function getValue(id) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return "";

    }


    return String(
        element.value || ""
    ).trim();

}


/* =====================================================
   CLEAR FILE NAMES
===================================================== */

function clearFileNames() {

    const ids = [

        "aadhaarFileName",

        "rationcardFileName",

        "paymentScreenshotName"

    ];


    ids.forEach(
        function (id) {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.textContent =
                    "";

            }

        }
    );

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


    if (
        type === "success"
    ) {

        element.style.background =
            "#e8f5e9";

        element.style.color =
            "#2e7d32";

        element.style.border =
            "1px solid #c8e6c9";

    }
    else if (
        type === "loading"
    ) {

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


/* =====================================================
   NO SESSION CLEAR ON REFRESH
===================================================== */

window.addEventListener(
    "beforeunload",
    function () {

        /*
         * Keep valid session during refresh.
         */

    }
);
