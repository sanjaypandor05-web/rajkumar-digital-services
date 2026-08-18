/* =====================================================
   RAJKUMAR RATIONCARD SERVICES
   FINAL RETAILER JS
   LOGIN + DASHBOARD + AUTO PAYMENT QR
   + DOCUMENT UPLOAD + APPLICATION SUBMIT
===================================================== */

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbx_Jlr04g2fJl76vXnuq2-jS4P3PPrb-p3RkrE-YZ4MMeHgygQQSutjR05xvKTC9yhu/exec";


/* =====================================================
   START
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    hideDashboard();

    protectRetailerPage();

    setupRetailerLogin();

    setupLogout();

    setupServiceAmount();

    setupApplicationForm();

});


/* =====================================================
   HIDE DASHBOARD
===================================================== */

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


/* =====================================================
   LOGIN CHECK
===================================================== */

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


/* =====================================================
   PROTECT PAGE
===================================================== */

function protectRetailerPage() {

    if (isRetailerLoggedIn()) {

        showDashboard();

    } else {

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
                    .getElementById("retailerId")
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "retailerPassword"
                    )
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

            }
            catch (error) {

                console.error(
                    "RETAILER LOGIN ERROR:",
                    error
                );


                showLoginMessage(
                    "❌ Server connection failed. Apps Script URL ચેક કરો.",
                    "error"
                );

            }
            finally {

                if (button) {

                    button.disabled = false;

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


/* =====================================================
   SERVICE AMOUNT
   SERVICE SELECT = AUTO QR
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
   UPDATE AMOUNT + AUTO QR
===================================================== */

async function updateServiceAmount() {

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


    const qrBox =
        document.getElementById(
            "paymentQRBox"
        );


    const qrImage =
        document.getElementById(
            "paymentQR"
        );


    const qrLoading =
        document.getElementById(
            "qrLoading"
        );


    const qrError =
        document.getElementById(
            "qrError"
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


    /* =============================================
       NO SERVICE
    ============================================= */

    if (amount <= 0) {

        if (qrBox) {
            qrBox.style.display = "none";
        }

        if (qrLoading) {
            qrLoading.style.display = "none";
        }

        if (qrError) {
            qrError.style.display = "none";
        }

        if (qrImage) {
            qrImage.src = "";
        }

        return;

    }


    /* =============================================
       SHOW LOADING
    ============================================= */

    if (qrBox) {
        qrBox.style.display = "none";
    }


    if (qrError) {

        qrError.style.display =
            "none";

        qrError.innerHTML = "";

    }


    if (qrLoading) {

        qrLoading.style.display =
            "block";

    }


    try {

        /*
         * Ask Apps Script to generate
         * the exact UPI payment link.
         */

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
                        JSON.stringify({

                            action:
                                "getUPIPayment",

                            amount:
                                amount,

                            applicationId:
                                "RKS"

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
            "UPI PAYMENT RESULT:",
            result
        );


        if (
            !result ||
            result.success !== true ||
            !result.upiLink
        ) {

            throw new Error(
                result &&
                result.message
                    ? result.message
                    : "UPI QR generation failed."
            );

        }


        /*
         * Convert UPI link into QR image.
         *
         * Google Chart API can be unreliable,
         * therefore QR image is generated using
         * a public QR endpoint.
         */

        const qrURL =
            "https://api.qrserver.com/v1/create-qr-code/" +
            "?size=300x300&margin=10&data=" +
            encodeURIComponent(
                result.upiLink
            );


        if (qrImage) {

            qrImage.onload =
                function () {

                    if (qrLoading) {

                        qrLoading.style.display =
                            "none";

                    }

                    if (qrBox) {

                        qrBox.style.display =
                            "block";

                    }

                };


            qrImage.onerror =
                function () {

                    if (qrLoading) {

                        qrLoading.style.display =
                            "none";

                    }

                    showQRError(
                        "❌ QR Code load થવામાં error આવ્યો."
                    );

                };


            qrImage.src =
                qrURL;

        }

    }
    catch (error) {

        console.error(
            "AUTO QR ERROR:",
            error
        );


        if (qrLoading) {

            qrLoading.style.display =
                "none";

        }


        showQRError(
            "❌ Payment QR generate થઈ શક્યો નથી. Internet connection ચેક કરો."
        );

    }

}


/* =====================================================
   QR ERROR
===================================================== */

function showQRError(message) {

    const element =
        document.getElementById(
            "qrError"
        );


    if (!element) {
        return;
    }


    element.style.display =
        "block";


    element.innerHTML =
        message;

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


            if (!isRetailerLoggedIn()) {

                forceLogin();

                showLoginMessage(
                    "❌ પહેલા Retailer Login કરો.",
                    "error"
                );

                return;

            }


            const serviceElement =
                document.getElementById(
                    "serviceSelect"
                );


            const message =
                document.getElementById(
                    "applicationMessage"
                );


            if (
                !serviceElement ||
                !serviceElement.value
            ) {

                showApplicationMessage(
                    message,
                    "⚠️ પહેલા Service પસંદ કરો.",
                    "error"
                );

                return;

            }


            const option =
                serviceElement.options[
                    serviceElement.selectedIndex
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


            /* =========================================
               FILES
            ========================================= */

            const aadhaarFile =
                document.getElementById(
                    "aadhaarFile"
                )?.files[0];


            const rationcardFile =
                document.getElementById(
                    "rationcardFile"
                )?.files[0];


            const paymentScreenshot =
                document.getElementById(
                    "paymentScreenshot"
                )?.files[0];


            if (!aadhaarFile) {

                showApplicationMessage(
                    message,
                    "⚠️ Aadhaar PDF upload કરો.",
                    "error"
                );

                return;

            }


            if (
                aadhaarFile.type !==
                "application/pdf"
            ) {

                showApplicationMessage(
                    message,
                    "⚠️ Aadhaar file PDF હોવી જોઈએ.",
                    "error"
                );

                return;

            }


            if (!rationcardFile) {

                showApplicationMessage(
                    message,
                    "⚠️ Ration Card PDF upload કરો.",
                    "error"
                );

                return;

            }


            if (
                rationcardFile.type !==
                "application/pdf"
            ) {

                showApplicationMessage(
                    message,
                    "⚠️ Ration Card file PDF હોવી જોઈએ.",
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


            /* =========================================
               UTR
            ========================================= */

            const utr =
                document
                    .getElementById(
                        "utrNumber"
                    )
                    .value
                    .trim();


            if (!utr) {

                showApplicationMessage(
                    message,
                    "⚠️ Payment પછી UTR Number નાખો.",
                    "error"
                );

                return;

            }


            /* =========================================
               BUTTON
            ========================================= */

            const button =
                document.getElementById(
                    "applicationSubmitButton"
                );


            if (button) {

                button.disabled = true;

                button.textContent =
                    "Submitting...";

            }


            showApplicationMessage(
                message,
                "🔄 Application submit થઈ રહી છે...",
                "loading"
            );


            try {

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
                        sessionStorage.getItem(
                            "retailerId"
                        ) || "",


                    retailerMobile:
                        sessionStorage.getItem(
                            "retailerMobile"
                        ) || "",


                    service:
                        serviceElement.value,


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
                        utr,


                    aadhaarFile:
                        aadhaarData,


                    rationcardFile:
                        rationcardData,


                    paymentScreenshot:
                        screenshotData

                };


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

                        "✅ Application successfully submitted.<br>" +
                        "<strong>Application ID:</strong> " +
                        result.applicationId,

                        "success"

                    );


                    form.reset();


                    updateServiceAmount();


                }
                else {

                    throw new Error(

                        result &&
                        result.message

                            ? result.message

                            : "Application submit failed."

                    );

                }

            }
            catch (error) {

                console.error(
                    "APPLICATION ERROR:",
                    error
                );


                showApplicationMessage(
                    message,
                    "❌ " +
                    error.message,
                    "error"
                );

            }
            finally {

                if (button) {

                    button.disabled = false;

                    button.textContent =
                        "Submit Application";

                }

            }

        }
    );

}


/* =====================================================
   GET INPUT VALUE
===================================================== */

function getValue(id) {

    const element =
        document.getElementById(id);


    return element
        ? element.value.trim()
        : "";

}


/* =====================================================
   FILE TO BASE64
===================================================== */

function fileToBase64(file) {

    return new Promise(
        function (resolve, reject) {

            const reader =
                new FileReader();


            reader.onload =
                function () {

                    const result =
                        reader.result;


                    const base64 =
                        result.split(",")[1];


                    resolve({

                        name:
                            file.name,

                        mimeType:
                            file.type,

                        data:
                            base64

                    });

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


            reader.readAsDataURL(
                file
            );

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
