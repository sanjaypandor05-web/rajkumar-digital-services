/* =========================================================
   RAJKUMAR RATIONCARD SERVICES
   FINAL RETAILER JS
   LOGIN + AUTO PAYMENT QR + APPLICATION SUBMIT
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
        document.getElementById(
            "loginSection"
        );

    const dashboardSection =
        document.getElementById(
            "dashboardSection"
        );


    if (loginSection) {
        loginSection.style.display = "none";
    }


    if (dashboardSection) {
        dashboardSection.style.display = "block";
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
   SERVICE AMOUNT + AUTO QR
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

            /*
             * SERVICE SELECT
             * થતાં જ QR AUTO GENERATE
             */

            generatePaymentQR();

        }
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


    const bottomAmount =
        document.getElementById(
            "paymentAmountBottom"
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
   AUTO PAYMENT QR
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


    if (!select || !select.value) {

        if (qrContainer) {

            qrContainer.style.display =
                "none";

        }

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

        if (qrContainer) {

            qrContainer.style.display =
                "none";

        }

        return;

    }


    /*
     * YOUR UPI
     */

    const upiId =
        "gujrat.nsfa@ybl";


    const upiName =
        "RAJKUMAR RATIONCARD SERVICES";


    /*
     * SERVICE NAME
     */

    const serviceName =
        option.textContent
            .trim()
            .replace(
                /\s*-\s*₹\s*\d+\s*$/,
                ""
            );


    /*
     * DIRECT UPI LINK
     */

    const upiLink =
        "upi://pay" +

        "?pa=" +
        encodeURIComponent(
            upiId
        ) +

        "&pn=" +
        encodeURIComponent(
            upiName
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


    /*
     * QR IMAGE
     */

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


    /*
     * QR CLICK
     */

    if (qrPaymentLink) {

        qrPaymentLink.href =
            upiLink;

    }


    /*
     * AMOUNT
     */

    if (qrAmount) {

        qrAmount.textContent =
            amount;

    }


    /*
     * UPI ID
     */

    if (upiElement) {

        upiElement.textContent =
            upiId;

    }


    /*
     * SHOW QR
     */

    if (qrContainer) {

        qrContainer.style.display =
            "block";

    }


    /*
     * PAY NOW
     */

    if (openUPIButton) {

        openUPIButton.onclick =
            function () {

                window.location.href =
                    upiLink;

            };

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


            /*
             * FILES
             */

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


            /*
             * REQUIRED FILE CHECK
             */

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


            /*
             * PDF CHECK
             */

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


            if (
                rationcardFile &&
                !rationcardFile.name
                    .toLowerCase()
                    .endsWith(".pdf")
            ) {

                showApplicationMessage(
                    message,
                    "⚠️ RATIONCARD file PDF હોવી જોઈએ.",
                    "error"
                );

                return;

            }


            /*
             * BUTTON
             */

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
                "⏳ Application submit થઈ રહી છે...",
                "loading"
            );


            try {

                /*
                 * FILE TO BASE64
                 */

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


                /*
                 * RETAILER DETAILS
                 */

                const retailerId =
                    sessionStorage.getItem(
                        "retailerId"
                    ) || "";


                const retailerMobile =
                    sessionStorage.getItem(
                        "retailerMobile"
                    ) || "";


                /*
                 * FORM VALUES
                 */

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
                        getValue(
                            "rationcardStatus"
                        ),

                    utrNumber:
                        getValue(
                            "utrNumber"
                        ),

                    aadhaarFile:
                        aadhaarData,

                    rationcardFile:
                        rationcardData,

                    paymentScreenshot:
                        screenshotData

                };


                /*
                 * SEND TO APPS SCRIPT
                 */

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


                if (
                    result &&
                    result.success === true
                ) {

                    showApplicationMessage(
                        message,

                        "✅ Application Successfully Submitted!" +

                        "<br><br>" +

                        "<strong>Application ID:</strong> " +

                        result.applicationId +

                        "<br><br>" +

                        "Payment Status: Pending",

                        "success"
                    );


                    /*
                     * RESET FORM
                     */

                    form.reset();


                    /*
                     * RESET AMOUNT
                     */

                    updateServiceAmount();


                    /*
                     * HIDE QR
                     */

                    const qrContainer =
                        document.getElementById(
                            "qrContainer"
                        );


                    if (qrContainer) {

                        qrContainer.style.display =
                            "none";

                    }


                    /*
                     * KEEP USER ON DASHBOARD
                     */

                    return;

                }


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

                    "❌ Application submit failed.<br>" +
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
   GET INPUT VALUE
========================================================= */

function getValue(id) {

    const element =
        document.getElementById(id);


    if (!element) {
        return "";
    }


    return element.value.trim();

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

                    const result =
                        reader.result;


                    const base64 =
                        String(
                            result
                        ).split(",")[1];


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
