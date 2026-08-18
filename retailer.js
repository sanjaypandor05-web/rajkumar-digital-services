/* =====================================================
   RAJKUMAR RATIONCARD SERVICES
   FINAL RETAILER JAVASCRIPT

   LOGIN
   DASHBOARD
   SERVICE AMOUNT
   PAYMENT QR
   FILE UPLOAD
   APPLICATION SUBMIT
   LOGOUT
===================================================== */


/* =====================================================
   GOOGLE APPS SCRIPT URL
===================================================== */

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbx_Jlr04g2fJl76vXnuq2-jS4P3PPrb-p3RkrE-YZ4MMeHgygQQSutjR05xvKTC9yhu/exec";


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

        setupPaymentQR();

        setupApplicationForm();

    }
);


/* =====================================================
   HIDE DASHBOARD
===================================================== */

function hideDashboard() {

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
            "block";

    }


    if (dashboardSection) {

        dashboardSection.style.display =
            "none";

    }

}


/* =====================================================
   CHECK LOGIN
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
        function () {

            updateServiceAmount();

            resetPaymentQR();

            generatePaymentQR();

        }
    );


    updateServiceAmount();

}


/* =====================================================
   UPDATE SERVICE AMOUNT
===================================================== */

function updateServiceAmount() {

    const select =
        document.getElementById(
            "serviceSelect"
        );


    if (!select) {

        return 0;

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


    return amount;

}


/* =====================================================
   PAYMENT QR SETUP
===================================================== */

function setupPaymentQR() {

    const button =
        document.getElementById(
            "generateQRButton"
        );


    if (button) {

        button.addEventListener(
            "click",
            generatePaymentQR
        );

    }


    /*
     * Service selected થાય એટલે
     * QR automatically generate થશે.
     */

    const select =
        document.getElementById(
            "serviceSelect"
        );


    if (
        select &&
        select.value
    ) {

        generatePaymentQR();

    }

}


/* =====================================================
   GENERATE PAYMENT QR
===================================================== */

async function generatePaymentQR() {

    const select =
        document.getElementById(
            "serviceSelect"
        );


    if (!select || !select.value) {

        showApplicationMessageById(
            "⚠️ પહેલા Service પસંદ કરો.",
            "error"
        );

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

        showApplicationMessageById(
            "⚠️ Service amount મળ્યો નથી.",
            "error"
        );

        return;

    }


    const button =
        document.getElementById(
            "generateQRButton"
        );


    if (button) {

        button.disabled =
            true;

        button.textContent =
            "⏳ QR બનાવાઈ રહ્યું છે...";

    }


    try {

        const applicationId =
            createTemporaryApplicationId();


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
                                "getUPIPayment",

                            amount:
                                amount,

                            applicationId:
                                applicationId

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
            "PAYMENT QR RESULT:",
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
                    : "UPI QR data મળ્યો નથી."
            );

        }


        /*
         * UPI LINK → QR IMAGE
         *
         * Google Chart API પર depend
         * ન રહેવા માટે QR Server નો ઉપયોગ.
         */

        const qrUrl =
            "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
            encodeURIComponent(
                result.upiLink
            );


        const qrImage =
            document.getElementById(
                "paymentQR"
            );


        if (!qrImage) {

            throw new Error(
                "Payment QR image element not found."
            );

        }


        qrImage.src =
            qrUrl;


        const qrSection =
            document.getElementById(
                "qrPaymentSection"
            );


        if (qrSection) {

            qrSection.style.display =
                "block";

        }


        const upiIdText =
            document.getElementById(
                "upiIdText"
            );


        if (upiIdText) {

            upiIdText.textContent =
                result.upiId ||
                "gujrat.nsfa@ybl";

        }


        const upiNameText =
            document.getElementById(
                "upiNameText"
            );


        if (upiNameText) {

            upiNameText.textContent =
                result.name ||
                "RAJKUMAR RATIONCARD SERVICES";

        }


        const qrAmount =
            document.getElementById(
                "qrAmount"
            );


        if (qrAmount) {

            qrAmount.textContent =
                amount;

        }


        /*
         * QR successfully generated.
         */

        console.log(
            "PAYMENT QR GENERATED:",
            result.upiLink
        );


    }
    catch (error) {

        console.error(
            "PAYMENT QR ERROR:",
            error
        );


        showApplicationMessageById(

            "❌ QR Generate થતું નથી. " +
            error.message,

            "error"

        );

    }
    finally {

        if (button) {

            button.disabled =
                false;

            button.textContent =
                "🔄 Generate Payment QR";

        }

    }

}


/* =====================================================
   RESET QR
===================================================== */

function resetPaymentQR() {

    const section =
        document.getElementById(
            "qrPaymentSection"
        );


    const image =
        document.getElementById(
            "paymentQR"
        );


    if (section) {

        section.style.display =
            "none";

    }


    if (image) {

        image.removeAttribute(
            "src"
        );

    }

}


/* =====================================================
   TEMPORARY APPLICATION ID
===================================================== */

function createTemporaryApplicationId() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );


    const random =
        Math.floor(
            10000 +
            Math.random() * 90000
        );


    return (
        "PAY-" +
        year +
        month +
        day +
        "-" +
        random
    );

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
        submitApplication
    );

}


/* =====================================================
   SUBMIT APPLICATION
===================================================== */

async function submitApplication(
    event
) {

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
     * Required files
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
     * Rationcard PDF service પ્રમાણે
     */

    const service =
        serviceSelect.value;


    const rationRequired =
        (
            service === "ADD_WITH_RC" ||
            service === "REMOVE_WITH_RC" ||
            service === "CORRECTION_WITH_RC" ||
            service === "ADD_HUSBAND_WITH_RC"
        );


    if (
        rationRequired &&
        !rationcardFile
    ) {

        showApplicationMessage(
            message,
            "⚠️ આ Service માટે Rationcard PDF જરૂરી છે.",
            "error"
        );

        return;

    }


    /*
     * UTR
     */

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


    /*
     * QR પહેલા generate થયો છે કે નહીં
     */

    const qr =
        document.getElementById(
            "paymentQR"
        );


    if (
        !qr ||
        !qr.src
    ) {

        showApplicationMessage(
            message,
            "⚠️ પહેલા Payment QR Generate કરો.",
            "error"
        );

        return;

    }


    const button =
        document.getElementById(
            "applicationSubmitButton"
        );


    if (button) {

        button.disabled =
            true;

        button.textContent =
            "⏳ Application Submit થઈ રહી છે...";

    }


    showApplicationMessage(
        message,
        "🔄 Documents upload અને application save થઈ રહી છે...",
        "loading"
    );


    try {

        /*
         * Convert files to Base64
         */

        const aadhaarData =
            await fileToBase64(
                aadhaarFile
            );


        let rationcardData = null;


        if (rationcardFile) {

            rationcardData =
                await fileToBase64(
                    rationcardFile
                );

        }


        const paymentScreenshotData =
            await fileToBase64(
                paymentScreenshot
            );


        /*
         * Retailer information
         */

        const retailerId =
            sessionStorage.getItem(
                "retailerId"
            ) ||
            "";


        const retailerName =
            sessionStorage.getItem(
                "retailerName"
            ) ||
            "";


        /*
         * Build application data
         */

        const data = {

            action:
                "submitApplication",

            retailerId:
                retailerId,

            retailerName:
                retailerName,

            retailerMobile:
                "",

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
                utr,

            aadhaarFile:
                aadhaarData,

            rationcardFile:
                rationcardData,

            paymentScreenshot:
                paymentScreenshotData

        };


        /*
         * Send to Apps Script
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
            !result ||
            result.success !== true
        ) {

            throw new Error(

                result &&
                result.message

                    ? result.message

                    : "Application submit failed."

            );

        }


        /*
         * SUCCESS
         */

        showApplicationMessage(

            message,

            "✅ Application Successfully Submitted.<br><br>" +

            "<strong>Application ID:</strong> " +

            result.applicationId +

            "<br><br>" +

            "Payment Status: Pending<br>" +

            "Application Status: Submitted",

            "success"

        );


        /*
         * Reset form after successful submit
         */

        document
            .getElementById(
                "applicationForm"
            )
            .reset();


        updateServiceAmount();

        resetPaymentQR();


    }
    catch (error) {

        console.error(
            "APPLICATION SUBMIT ERROR:",
            error
        );


        showApplicationMessage(

            message,

            "❌ Application Submit Error:<br>" +
            error.message,

            "error"

        );

    }
    finally {

        if (button) {

            button.disabled =
                false;

            button.textContent =
                "Submit Application";

        }

    }

}


/* =====================================================
   FILE → BASE64
===================================================== */

function fileToBase64(
    file
) {

    return new Promise(
        function (
            resolve,
            reject
        ) {

            const reader =
                new FileReader();


            reader.onload =
                function () {

                    const result =
                        reader.result;


                    const base64 =
                        result.split(
                            ","
                        )[1];


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
   GET INPUT VALUE
===================================================== */

function getValue(
    id
) {

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
        "14px";


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
   SHOW APPLICATION MESSAGE BY ID
===================================================== */

function showApplicationMessageById(
    message,
    type
) {

    const element =
        document.getElementById(
            "applicationMessage"
        );


    showApplicationMessage(
        element,
        message,
        type
    );

}


/* =====================================================
   BROWSER BACK/FORWARD
===================================================== */

window.addEventListener(
    "pageshow",
    function () {

        protectRetailerPage();

    }
);


/* =====================================================
   PAGE VISIBILITY
===================================================== */

document.addEventListener(
    "visibilitychange",
    function () {

        if (!document.hidden) {

            protectRetailerPage();

        }

    }
);
