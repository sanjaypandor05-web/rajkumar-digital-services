/* =========================================================
   RAJKUMAR RATIONCARD SERVICES
   FINAL RETAILER JS
   LOGIN + DYNAMIC UPI QR + DOCUMENT UPLOAD
   + APPLICATION SUBMIT
========================================================= */

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbx_Jlr04g2fJl76vXnuq2-jS4P3PPrb-p3RkrE-YZ4MMeHgygQQSutjR05xvKTC9yhu/exec";


const UPI_ID =
"gujrat.nsfa@ybl";

const UPI_NAME =
"RAJKUMAR RATIONCARD SERVICES";


/* =========================================================
   START
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    hideDashboard();

    protectRetailerPage();

    setupRetailerLogin();

    setupLogout();

    setupServiceAmount();

    setupGenerateQR();

    setupOpenUPI();

    setupApplicationForm();

});


/* =========================================================
   SESSION
========================================================= */

function isRetailerLoggedIn() {

    return (
        sessionStorage.getItem("retailerLoggedIn") === "true" &&
        !!sessionStorage.getItem("retailerId")
    );

}


/* =========================================================
   HIDE DASHBOARD
========================================================= */

function hideDashboard() {

    const login =
        document.getElementById("loginSection");

    const dashboard =
        document.getElementById("dashboardSection");


    if (login) {
        login.style.display = "block";
    }

    if (dashboard) {
        dashboard.style.display = "none";
    }

}


/* =========================================================
   PROTECTION
========================================================= */

function protectRetailerPage() {

    if (isRetailerLoggedIn()) {

        showDashboard();

    } else {

        hideDashboard();

    }

}


/* =========================================================
   SHOW DASHBOARD
========================================================= */

function showDashboard() {

    if (!isRetailerLoggedIn()) {

        hideDashboard();

        return;

    }


    const login =
        document.getElementById("loginSection");

    const dashboard =
        document.getElementById("dashboardSection");


    if (login) {
        login.style.display = "none";
    }

    if (dashboard) {
        dashboard.style.display = "block";
    }


    const name =
        sessionStorage.getItem("retailerName") ||
        "Retailer";

    const id =
        sessionStorage.getItem("retailerId") ||
        "";


    const nameElement =
        document.getElementById("loggedRetailerName");

    const idElement =
        document.getElementById("loggedRetailerId");


    if (nameElement) {
        nameElement.textContent = name;
    }

    if (idElement) {
        idElement.textContent =
            "Retailer ID: " + id;
    }

}


/* =========================================================
   LOGIN
========================================================= */

function setupRetailerLogin() {

    const form =
        document.getElementById(
            "retailerLoginForm"
        );


    if (!form) return;


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


            button.disabled = true;

            button.textContent = "LOGIN...";


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


                const result =
                    await response.json();


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
                        )
                    );

                    sessionStorage.setItem(
                        "retailerName",
                        String(
                            result.retailerName ||
                            retailerId
                        )
                    );

                    sessionStorage.setItem(
                        "retailerUsername",
                        String(
                            result.username ||
                            retailerId
                        )
                    );


                    clearOldPermanentLogin();


                    showLoginMessage(
                        "✅ Login Successful.",
                        "success"
                    );


                    setTimeout(
                        showDashboard,
                        300
                    );


                } else {

                    showLoginMessage(
                        "❌ " +
                        (
                            result.message ||
                            "Invalid login."
                        ),
                        "error"
                    );

                }


            } catch (error) {

                console.error(error);

                showLoginMessage(
                    "❌ Server connection failed.",
                    "error"
                );

            }


            button.disabled = false;

            button.textContent = "LOGIN";

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


    if (!button) return;


    button.addEventListener(
        "click",
        function () {

            sessionStorage.clear();

            clearOldPermanentLogin();

            hideDashboard();

            const form =
                document.getElementById(
                    "retailerLoginForm"
                );

            if (form) {
                form.reset();
            }


            showLoginMessage(
                "✅ Logout successful.",
                "success"
            );

        }
    );

}


/* =========================================================
   OLD STORAGE CLEAN
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

        } catch (e) {}

    });

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
        function () {

            updateServiceAmount();

            hideQR();

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


    if (!select) return;


    const option =
        select.options[
            select.selectedIndex
        ];


    const amount =
        Number(
            option?.dataset?.amount || 0
        );


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


/* =========================================================
   GENERATE QR
========================================================= */

function setupGenerateQR() {

    const button =
        document.getElementById(
            "generateQRButton"
        );


    if (!button) return;


    button.addEventListener(
        "click",
        generatePaymentQR
    );

}


/* =========================================================
   GENERATE DYNAMIC UPI QR
========================================================= */

async function generatePaymentQR() {

    if (!isRetailerLoggedIn()) {

        showApplicationMessage(
            document.getElementById(
                "applicationMessage"
            ),
            "❌ પહેલા Retailer Login કરો.",
            "error"
        );

        return;

    }


    const select =
        document.getElementById(
            "serviceSelect"
        );


    if (!select || !select.value) {

        alert(
            "પહેલા Service પસંદ કરો."
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

        alert(
            "Service amount મળ્યો નથી."
        );

        return;

    }


    const button =
        document.getElementById(
            "generateQRButton"
        );


    button.disabled = true;

    button.textContent =
        "Generating QR...";


    try {

        /*
         * First try Apps Script backend.
         */

        let upiLink = "";

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
                                "getUPIPayment",

                            amount:
                                amount,

                            applicationId:
                                generateApplicationId()

                        })
                    }
                );


            const result =
                await response.json();


            if (
                result &&
                result.success &&
                result.upiLink
            ) {

                upiLink =
                    result.upiLink;

            }

        } catch (backendError) {

            console.warn(
                "Backend QR generation fallback:",
                backendError
            );

        }


        /*
         * Fallback UPI link.
         * This guarantees QR generation
         * even if backend response fails.
         */

        if (!upiLink) {

            const reference =
                generateApplicationId();


            upiLink =
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
                    "Rationcard Service " +
                    reference
                );

        }


        createQRCode(
            upiLink,
            amount
        );


        /*
         * Save UPI link for Open UPI button.
         */

        window.currentUPILink =
            upiLink;


    } catch (error) {

        console.error(
            "QR ERROR:",
            error
        );


        alert(
            "QR generate કરવામાં error આવ્યો."
        );

    }


    button.disabled = false;

    button.textContent =
        "🔄 Regenerate Payment QR";

}


/* =========================================================
   CREATE QR
========================================================= */

function createQRCode(
    upiLink,
    amount
) {

    const qrSection =
        document.getElementById(
            "qrSection"
        );

    const qrContainer =
        document.getElementById(
            "qrcode"
        );


    if (!qrContainer) return;


    qrContainer.innerHTML = "";


    if (
        typeof QRCode ===
        "undefined"
    ) {

        alert(
            "QR library load થઈ નથી. Page refresh કરો."
        );

        return;

    }


    new QRCode(
        qrContainer,
        {
            text: upiLink,

            width: 220,

            height: 220,

            correctLevel:
                QRCode.CorrectLevel.H
        }
    );


    const qrAmount =
        document.getElementById(
            "qrAmount"
        );


    if (qrAmount) {

        qrAmount.textContent =
            amount;

    }


    if (qrSection) {

        qrSection.style.display =
            "block";

        qrSection.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }

}


/* =========================================================
   HIDE QR
========================================================= */

function hideQR() {

    const section =
        document.getElementById(
            "qrSection"
        );

    const qr =
        document.getElementById(
            "qrcode"
        );


    if (section) {

        section.style.display =
            "none";

    }


    if (qr) {

        qr.innerHTML = "";

    }


    window.currentUPILink = "";

}


/* =========================================================
   OPEN UPI
========================================================= */

function setupOpenUPI() {

    const button =
        document.getElementById(
            "openUPIButton"
        );


    if (!button) return;


    button.addEventListener(
        "click",
        function () {

            if (
                window.currentUPILink
            ) {

                window.location.href =
                    window.currentUPILink;

            } else {

                alert(
                    "પહેલા Payment QR Generate કરો."
                );

            }

        }
    );

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
        async function (event) {

            event.preventDefault();


            if (!isRetailerLoggedIn()) {

                hideDashboard();

                showLoginMessage(
                    "❌ પહેલા Retailer Login કરો.",
                    "error"
                );

                return;

            }


            const service =
                document.getElementById(
                    "serviceSelect"
                );


            if (!service.value) {

                showApplicationMessage(
                    document.getElementById(
                        "applicationMessage"
                    ),
                    "⚠️ Service પસંદ કરો.",
                    "error"
                );

                return;

            }


            const option =
                service.options[
                    service.selectedIndex
                ];


            const amount =
                Number(
                    option.dataset.amount || 0
                );


            if (amount <= 0) {

                showApplicationMessage(
                    document.getElementById(
                        "applicationMessage"
                    ),
                    "⚠️ Service amount invalid.",
                    "error"
                );

                return;

            }


            /*
             * QR must be generated.
             */

            if (!window.currentUPILink) {

                showApplicationMessage(
                    document.getElementById(
                        "applicationMessage"
                    ),
                    "⚠️ પહેલા Payment QR Generate કરો અને Payment કરો.",
                    "error"
                );

                return;

            }


            /*
             * Basic browser validation.
             */

            if (!form.checkValidity()) {

                form.reportValidity();

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
                    document.getElementById(
                        "applicationMessage"
                    ),
                    "⚠️ Aadhaar PDF upload કરો.",
                    "error"
                );

                return;

            }


            if (!paymentScreenshot) {

                showApplicationMessage(
                    document.getElementById(
                        "applicationMessage"
                    ),
                    "⚠️ Payment Screenshot upload કરો.",
                    "error"
                );

                return;

            }


            const submitButton =
                document.getElementById(
                    "applicationSubmitButton"
                );


            submitButton.disabled = true;

            submitButton.textContent =
                "Submitting...";


            const message =
                document.getElementById(
                    "applicationMessage"
                );


            showApplicationMessage(
                message,
                "⏳ Files upload થઈ રહી છે અને application submit થઈ રહી છે...",
                "loading"
            );


            try {

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


                const data = {

                    action:
                        "submitApplication",

                    retailerId:
                        retailerId,

                    retailerMobile:
                        retailerMobile,

                    service:
                        service.value,

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
                        getValue("utrNumber"),

                    aadhaarFile:
                        await fileToBase64(
                            aadhaarFile
                        ),

                    rationcardFile:
                        rationcardFile
                            ? await fileToBase64(
                                rationcardFile
                              )
                            : null,

                    paymentScreenshot:
                        await fileToBase64(
                            paymentScreenshot
                        )

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


                const result =
                    await response.json();


                console.log(
                    "APPLICATION RESULT:",
                    result
                );


                if (
                    result &&
                    result.success
                ) {

                    showApplicationMessage(
                        message,

                        "✅ Application Successfully Submitted!<br><br>" +

                        "<strong>Application ID:</strong> " +

                        result.applicationId +

                        "<br><strong>Amount:</strong> ₹" +

                        result.amount,

                        "success"
                    );


                    form.reset();


                    updateServiceAmount();

                    hideQR();


                } else {

                    throw new Error(
                        result.message ||
                        "Application submit failed."
                    );

                }


            } catch (error) {

                console.error(
                    "SUBMIT ERROR:",
                    error
                );


                showApplicationMessage(
                    message,

                    "❌ " +
                    error.message,

                    "error"
                );

            }


            submitButton.disabled = false;

            submitButton.textContent =
                "Submit Application";

        }
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
   FILE TO BASE64
========================================================= */

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
                            file.type ||
                            "application/octet-stream",

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


            reader.readAsDataURL(file);

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

    if (!element) return;


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

    }

    else if (type === "loading") {

        element.style.background =
            "#e3f2fd";

        element.style.color =
            "#1565c0";

    }

    else {

        element.style.background =
            "#ffebee";

        element.style.color =
            "#c62828";

    }

}


/* =========================================================
   PAGE SHOW PROTECTION
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


/* =========================================================
   APPLICATION ID
========================================================= */

function generateApplicationId() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            now.getDate()
        ).padStart(2, "0");


    const random =
        Math.floor(
            10000 +
            Math.random() * 90000
        );


    return (
        "RKS-" +
        year +
        month +
        day +
        "-" +
        random
    );

}
