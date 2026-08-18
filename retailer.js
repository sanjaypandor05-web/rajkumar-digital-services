/* =====================================================
   RAJKUMAR RATIONCARD SERVICES
   FINAL RETAILER.JS
   Retailer Login + Application Submission
===================================================== */

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbw1mKC92_EjWJS_x2o8LMqiL9sssMbFh089IhMujZLd6_9VuujoVckjoMS8fbajVn-uQQ/exec";


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    setupRetailerLogin();

    setupServiceAmount();

    setupApplicationForm();

    setupFileValidation();

    checkRetailerSession();

});


/* =====================================================
   RETAILER LOGIN
===================================================== */

function setupRetailerLogin() {

    const loginForm =
        document.getElementById("retailerLoginForm");

    if (!loginForm) return;


    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const retailerId =
            document.getElementById("retailerId")?.value.trim() || "";

        const password =
            document.getElementById("retailerPassword")?.value || "";

        const button =
            loginForm.querySelector("button[type='submit']");


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

            const result =
                await callAPI({

                    action: "retailerLogin",

                    username: retailerId,

                    password: password

                });


            console.log(
                "Retailer Login:",
                result
            );


            if (
                result &&
                result.success === true
            ) {

                const id =
                    result.retailerId || retailerId;

                const name =
                    result.retailerName || "";

                const mobile =
                    result.mobile || "";

                const username =
                    result.username || retailerId;


                /* ================================
                   SESSION
                ================================= */

                sessionStorage.setItem(
                    "retailerLoggedIn",
                    "true"
                );

                sessionStorage.setItem(
                    "retailerId",
                    id
                );


                /* ================================
                   LOCAL STORAGE
                ================================= */

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


                showLoginMessage(
                    "✅ Login Successful. Dashboard ખૂલી રહ્યું છે...",
                    "success"
                );


                setTimeout(function () {

                    window.location.href =
                        "retailer-dashboard.html";

                }, 600);


                return;

            }


            showLoginMessage(
                "❌ " +
                (
                    result?.message ||
                    "Retailer ID અથવા Password ખોટો છે."
                ),
                "error"
            );


        } catch (error) {

            console.error(
                "Retailer Login Error:",
                error
            );


            showLoginMessage(
                "❌ Server connection failed. Apps Script URL અથવા Deployment ચેક કરો.",
                "error"
            );

        }


        if (button) {

            button.disabled = false;

            button.textContent = "LOGIN";

        }

    });

}


/* =====================================================
   API CALL
===================================================== */

async function callAPI(data) {

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


    const text =
        await response.text();


    try {

        return JSON.parse(text);

    } catch (error) {

        console.error(
            "Invalid JSON:",
            text
        );

        throw new Error(
            "Invalid server response."
        );

    }

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


    if (!element) return;


    element.style.display =
        "block";


    element.textContent =
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
   SESSION CHECK
===================================================== */

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

    }

}


/* =====================================================
   SHOW DASHBOARD
===================================================== */

function showDashboard(
    retailerId
) {

    const loginSection =
        document.getElementById(
            "loginSection"
        );


    const dashboard =
        document.getElementById(
            "dashboardSection"
        );


    if (loginSection) {

        loginSection.style.display =
            "none";

    }


    if (dashboard) {

        dashboard.style.display =
            "block";

    }


    const retailerName =
        document.getElementById(
            "loggedRetailerName"
        );


    if (retailerName) {

        retailerName.textContent =
            localStorage.getItem(
                "rajkumarRetailerName"
            ) ||
            retailerId;

    }

}


/* =====================================================
   LOGOUT
===================================================== */

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

        localStorage.removeItem(
            key
        );

    });


    window.location.href =
        "retailer.html";

}


/* =====================================================
   SERVICE AMOUNT
===================================================== */

function setupServiceAmount() {

    const serviceSelect =
        document.getElementById(
            "serviceSelect"
        );


    if (!serviceSelect) return;


    serviceSelect.addEventListener(
        "change",
        updateServiceAmount
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


    const amount =
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


    let price = 0;


    if (
        option &&
        option.dataset.amount
    ) {

        price =
            Number(
                option.dataset.amount
            );

    }


    if (amount) {

        amount.textContent =
            price;

    }


    if (paymentAmount) {

        paymentAmount.textContent =
            price;

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


    if (!form) return;


    form.addEventListener(
        "submit",
        submitApplicationFromRetailer
    );

}


/* =====================================================
   SUBMIT APPLICATION
===================================================== */

async function submitApplicationFromRetailer(
    event
) {

    event.preventDefault();


    const form =
        event.target;


    const message =
        document.getElementById(
            "applicationMessage"
        );


    const button =
        form.querySelector(
            "button[type='submit']"
        );


    const retailerId =
        sessionStorage.getItem(
            "retailerId"
        ) ||
        localStorage.getItem(
            "rajkumarRetailerId"
        ) ||
        "";


    const retailerMobile =
        localStorage.getItem(
            "rajkumarRetailerMobile"
        ) ||
        "";


    if (!retailerId) {

        showApplicationMessage(
            message,
            "❌ Retailer session મળ્યું નથી. ફરી Login કરો.",
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
            option?.dataset?.amount || 0
        );


    if (amount <= 0) {

        showApplicationMessage(
            message,
            "⚠️ Service amount મળ્યો નથી.",
            "error"
        );

        return;

    }


    /* ================================
       REQUIRED FILES
    ================================= */

    const aadhaarInput =
        document.getElementById(
            "aadhaarFile"
        );


    const rationcardInput =
        document.getElementById(
            "rationcardFile"
        );


    const paymentInput =
        document.getElementById(
            "paymentScreenshot"
        );


    if (
        !aadhaarInput ||
        !aadhaarInput.files ||
        !aadhaarInput.files[0]
    ) {

        showApplicationMessage(
            message,
            "⚠️ Aadhaar PDF પસંદ કરો.",
            "error"
        );

        return;

    }


    if (
        !paymentInput ||
        !paymentInput.files ||
        !paymentInput.files[0]
    ) {

        showApplicationMessage(
            message,
            "⚠️ Payment Screenshot પસંદ કરો.",
            "error"
        );

        return;

    }


    /* ================================
       BUTTON
    ================================= */

    if (button) {

        button.disabled = true;

        button.textContent =
            "SUBMITTING...";

    }


    showApplicationMessage(
        message,
        "🔄 Application submit થઈ રહી છે... કૃપા કરીને રાહ જુઓ.",
        "loading"
    );


    try {

        const applicationId =
            generateApplicationId();


        /* ================================
           FILE CONVERSION
        ================================= */

        const aadhaarFile =
            await fileToBase64(
                aadhaarInput.files[0]
            );


        let rationcardFile = null;


        if (
            rationcardInput &&
            rationcardInput.files &&
            rationcardInput.files[0]
        ) {

            rationcardFile =
                await fileToBase64(
                    rationcardInput.files[0]
                );

        }


        const paymentScreenshot =
            await fileToBase64(
                paymentInput.files[0]
            );


        /* ================================
           FORM DATA
        ================================= */

        const fd =
            new FormData(form);


        const payload = {

            action:
                "submitApplication",

            applicationId:
                applicationId,

            retailerId:
                retailerId,

            retailerMobile:
                retailerMobile,

            service:
                serviceSelect.value,

            amount:
                amount,

            aadhaarName:
                cleanValue(
                    fd.get("aadhaarName")
                ),

            englishName:
                cleanValue(
                    fd.get("englishName")
                ),

            gujaratiName:
                cleanValue(
                    fd.get("gujaratiName")
                ),

            rationCardNo:
                cleanValue(
                    fd.get("rationCardNo")
                ),

            gender:
                cleanValue(
                    fd.get("gender")
                ),

            village:
                cleanValue(
                    fd.get("village")
                ),

            taluka:
                cleanValue(
                    fd.get("taluka")
                ),

            district:
                cleanValue(
                    fd.get("district")
                ),

            pincode:
                cleanValue(
                    fd.get("pincode")
                ),

            mobile:
                cleanValue(
                    fd.get("mobile")
                ),

            email:
                cleanValue(
                    fd.get("email")
                ),

            birthDate:
                cleanValue(
                    fd.get("birthDate")
                ),

            birthYear:
                cleanValue(
                    fd.get("birthYear")
                ),

            rationcardStatus:
                cleanValue(
                    fd.get("rationcardStatus")
                ),

            utrNumber:
                cleanValue(
                    fd.get("utrNumber")
                ),

            aadhaarFile:
                aadhaarFile,

            rationcardFile:
                rationcardFile,

            paymentScreenshot:
                paymentScreenshot

        };


        console.log(
            "Submitting Application:",
            payload
        );


        /* ================================
           SEND TO APPS SCRIPT
        ================================= */

        const result =
            await callAPI(
                payload
            );


        console.log(
            "Submit Result:",
            result
        );


        if (
            result &&
            result.success === true
        ) {

            showApplicationMessage(
                message,
                `
                ✅ Application Successfully Submitted.<br><br>

                <strong>Application ID:</strong>
                ${escapeHTML(
                    result.applicationId ||
                    applicationId
                )}
                <br><br>

                <strong>Service:</strong>
                ${escapeHTML(
                    result.service ||
                    option.textContent
                )}
                <br>

                <strong>Amount:</strong>
                ₹${result.amount || amount}
                <br><br>

                <strong>Payment Status:</strong>
                ${escapeHTML(
                    result.paymentStatus ||
                    "Pending"
                )}
                <br>

                <strong>Application Status:</strong>
                ${escapeHTML(
                    result.applicationStatus ||
                    "Submitted"
                )}
                `,
                "success"
            );


            /* Clear form */

            form.reset();


            updateServiceAmount();


            /* Keep retailer session */

            setTimeout(function () {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }, 100);


        } else {

            throw new Error(
                result?.message ||
                "Application submit failed."
            );

        }


    } catch (error) {

        console.error(
            "APPLICATION ERROR:",
            error
        );


        showApplicationMessage(
            message,
            "❌ " +
            (
                error.message ||
                "Application submit failed."
            ),
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


/* =====================================================
   FILE TO BASE64
===================================================== */

function fileToBase64(
    file
) {

    return new Promise(
        function (resolve, reject) {

            if (!file) {

                reject(
                    new Error(
                        "File not selected."
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
                            reader.result;


                        const base64 =
                            String(
                                result
                            ).split(",")[1];


                        resolve({

                            name:
                                file.name,

                            mimeType:
                                file.type ||
                                "application/octet-stream",

                            data:
                                base64

                        });

                    } catch (error) {

                        reject(error);

                    }

                };


            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "File read failed."
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
   FILE VALIDATION
===================================================== */

function setupFileValidation() {

    const inputs = [

        "aadhaarFile",
        "rationcardFile",
        "paymentScreenshot"

    ];


    inputs.forEach(function (id) {

        const input =
            document.getElementById(id);


        if (!input) return;


        input.addEventListener(
            "change",
            function () {

                const file =
                    input.files &&
                    input.files[0];


                if (!file) return;


                const maxSize =
                    10 * 1024 * 1024;


                if (
                    file.size >
                    maxSize
                ) {

                    alert(
                        "File size 10 MB કરતાં વધારે ન હોવી જોઈએ."
                    );


                    input.value =
                        "";

                }

            }
        );

    });

}


/* =====================================================
   GENERATE APPLICATION ID
===================================================== */

function generateApplicationId() {

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
            Math.random() *
            90000
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


/* =====================================================
   APPLICATION MESSAGE
===================================================== */

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


    element.style.lineHeight =
        "1.7";


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
   CLEAN VALUE
===================================================== */

function cleanValue(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(
        value
    ).trim();

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
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
   GLOBAL LOGOUT
===================================================== */

window.retailerLogout =
    retailerLogout;


/* =====================================================
   END RETAILER.JS
===================================================== */
