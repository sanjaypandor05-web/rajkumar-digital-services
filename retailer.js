/* =====================================================
   RAJKUMAR RATIONCARD SERVICES
   FINAL RETAILER.JS
   Compatible with provided Code.gs
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

    setupPasswordProtection();

    checkRetailerSession();

});


/* =====================================================
   RETAILER LOGIN
===================================================== */

function setupRetailerLogin() {

    const form =
        document.getElementById("retailerLoginForm");

    if (!form) return;

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        const retailerId =
            document.getElementById("retailerId")?.value.trim();

        const password =
            document.getElementById("retailerPassword")?.value || "";

        if (!retailerId || !password) {

            showLoginMessage(
                "⚠️ Retailer ID અને Password દાખલ કરો.",
                "error"
            );

            return;
        }

        const button =
            form.querySelector("button[type='submit']");

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
                await apiRequest({
                    action: "retailerLogin",
                    username: retailerId,
                    password: password
                });

            console.log("RETAILER LOGIN:", result);

            if (result && result.success === true) {

                const id =
                    result.retailerId || retailerId;

                const name =
                    result.retailerName || "";

                const mobile =
                    result.mobile || "";

                const username =
                    result.username || retailerId;


                /* ==============================
                   LOCAL STORAGE
                ============================== */

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


                /* ==============================
                   SESSION STORAGE
                ============================== */

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

        }
        catch (error) {

            console.error(
                "LOGIN ERROR:",
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
                button.textContent = "LOGIN";

            }

        }

    });

}


/* =====================================================
   API REQUEST
===================================================== */

async function apiRequest(data) {

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

    }
    catch (error) {

        console.error(
            "INVALID SERVER RESPONSE:",
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


    const name =
        localStorage.getItem(
            "rajkumarRetailerName"
        ) ||
        sessionStorage.getItem(
            "retailerName"
        ) ||
        retailerId;


    const nameElement =
        document.getElementById(
            "loggedRetailerName"
        );


    if (nameElement) {

        nameElement.textContent =
            name;

    }

}


/* =====================================================
   LOGOUT
===================================================== */

function retailerLogout() {

    sessionStorage.clear();

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


/* =====================================================
   SERVICE AMOUNT
===================================================== */

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


/* =====================================================
   UPDATE SERVICE AMOUNT
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


    if (!select) return;


    const option =
        select.options[
            select.selectedIndex
        ];


    const amount =
        Number(
            option?.dataset?.amount || 0
        );


    if (amountElement) {

        amountElement.textContent =
            amount;

    }


    if (paymentElement) {

        paymentElement.textContent =
            amount;

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
        submitApplication
    );

}


/* =====================================================
   SUBMIT APPLICATION
===================================================== */

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


    if (!form) return;


    /* ==============================
       SESSION
    ============================== */

    const retailerId =
        localStorage.getItem(
            "rajkumarRetailerId"
        ) ||
        sessionStorage.getItem(
            "retailerId"
        );


    const retailerMobile =
        localStorage.getItem(
            "rajkumarRetailerMobile"
        ) || "";


    if (!retailerId) {

        showApplicationMessage(
            message,
            "❌ Retailer session expired. ફરીથી Login કરો.",
            "error"
        );

        setTimeout(function () {

            window.location.href =
                "retailer.html";

        }, 1200);

        return;

    }


    /* ==============================
       SERVICE
    ============================== */

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


    const selectedOption =
        serviceSelect.options[
            serviceSelect.selectedIndex
        ];


    const amount =
        Number(
            selectedOption?.dataset?.amount || 0
        );


    if (amount <= 0) {

        showApplicationMessage(
            message,
            "⚠️ Service amount મળ્યો નથી.",
            "error"
        );

        return;

    }


    /* ==============================
       VALIDATE FORM
    ============================== */

    if (!form.checkValidity()) {

        form.reportValidity();

        return;

    }


    /* ==============================
       FILES
    ============================== */

    const aadhaarFile =
        document.getElementById(
            "aadhaarFile"
        )?.files?.[0] || null;


    const rationcardFile =
        document.getElementById(
            "rationcardFile"
        )?.files?.[0] || null;


    const paymentScreenshot =
        document.getElementById(
            "paymentScreenshot"
        )?.files?.[0] || null;


    if (!aadhaarFile) {

        showApplicationMessage(
            message,
            "⚠️ Aadhaar PDF પસંદ કરો.",
            "error"
        );

        return;

    }


    if (!paymentScreenshot) {

        showApplicationMessage(
            message,
            "⚠️ Payment Screenshot પસંદ કરો.",
            "error"
        );

        return;

    }


    /* ==============================
       FILE SIZE CHECK
    ============================== */

    const maxFileSize =
        10 * 1024 * 1024;


    if (
        aadhaarFile.size >
        maxFileSize
    ) {

        showApplicationMessage(
            message,
            "❌ Aadhaar PDF 10MB કરતાં મોટી છે.",
            "error"
        );

        return;

    }


    if (
        rationcardFile &&
        rationcardFile.size >
        maxFileSize
    ) {

        showApplicationMessage(
            message,
            "❌ Ration Card file 10MB કરતાં મોટી છે.",
            "error"
        );

        return;

    }


    if (
        paymentScreenshot.size >
        maxFileSize
    ) {

        showApplicationMessage(
            message,
            "❌ Payment Screenshot 10MB કરતાં મોટું છે.",
            "error"
        );

        return;

    }


    /* ==============================
       UTR
    ============================== */

    const utr =
        document.getElementById(
            "utrNumber"
        )?.value.trim();


    if (!utr) {

        showApplicationMessage(
            message,
            "⚠️ UTR Number દાખલ કરો.",
            "error"
        );

        return;

    }


    /* ==============================
       BUTTON
    ============================== */

    const button =
        form.querySelector(
            "button[type='submit']"
        );


    if (button) {

        button.disabled = true;

        button.textContent =
            "Submitting...";

    }


    showApplicationMessage(
        message,
        "⏳ Application તૈયાર થઈ રહી છે...",
        "loading"
    );


    try {

        /* ==============================
           READ FILES
        ============================== */

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


        const paymentData =
            await fileToBase64(
                paymentScreenshot
            );


        /* ==============================
           FORM DATA
        ============================== */

        const formData =
            new FormData(form);


        const applicationId =
            generateApplicationId();


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
                    formData.get(
                        "aadhaarName"
                    )
                ),


            englishName:
                cleanValue(
                    formData.get(
                        "englishName"
                    )
                ),


            gujaratiName:
                cleanValue(
                    formData.get(
                        "gujaratiName"
                    )
                ),


            rationCardNo:
                cleanValue(
                    formData.get(
                        "rationCardNo"
                    )
                ),


            gender:
                cleanValue(
                    formData.get(
                        "gender"
                    )
                ),


            village:
                cleanValue(
                    formData.get(
                        "village"
                    )
                ),


            taluka:
                cleanValue(
                    formData.get(
                        "taluka"
                    )
                ),


            district:
                cleanValue(
                    formData.get(
                        "district"
                    )
                ),


            pincode:
                cleanValue(
                    formData.get(
                        "pincode"
                    )
                ),


            mobile:
                cleanValue(
                    formData.get(
                        "mobile"
                    )
                ),


            email:
                cleanValue(
                    formData.get(
                        "email"
                    )
                ),


            birthDate:
                cleanValue(
                    formData.get(
                        "birthDate"
                    )
                ),


            birthYear:
                cleanValue(
                    formData.get(
                        "birthYear"
                    )
                ),


            rationcardStatus:
                cleanValue(
                    formData.get(
                        "rationcardStatus"
                    )
                ),


            utrNumber:
                utr,


            aadhaarFile:
                aadhaarData,


            rationcardFile:
                rationcardData,


            paymentScreenshot:
                paymentData

        };


        showApplicationMessage(
            message,
            "⏳ Application Google Server પર મોકલાઈ રહી છે...",
            "loading"
        );


        /* ==============================
           SEND TO APPS SCRIPT
        ============================== */

        const result =
            await apiRequest(
                payload
            );


        console.log(
            "APPLICATION RESULT:",
            result
        );


        /* ==============================
           SUCCESS
        ============================== */

        if (
            result &&
            result.success === true
        ) {

            showApplicationMessage(
                message,
                "✅ Application Successfully Submitted!<br><br>" +
                "<strong>Application ID:</strong> " +
                escapeHtml(
                    result.applicationId ||
                    applicationId
                ) +
                "<br><strong>Service:</strong> " +
                escapeHtml(
                    result.service ||
                    selectedOption.textContent
                ) +
                "<br><strong>Amount:</strong> ₹" +
                Number(
                    result.amount ||
                    amount
                ),
                "success"
            );


            form.reset();

            updateServiceAmount();


            /* Keep retailer session */

            const name =
                localStorage.getItem(
                    "rajkumarRetailerName"
                );


            const nameElement =
                document.getElementById(
                    "loggedRetailerName"
                );


            if (
                nameElement &&
                name
            ) {

                nameElement.textContent =
                    name;

            }


            return;

        }


        /* ==============================
           FAILED
        ============================== */

        throw new Error(
            result?.message ||
            "Application submit failed."
        );

    }
    catch (error) {

        console.error(
            "SUBMIT APPLICATION ERROR:",
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

    }
    finally {

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

function fileToBase64(file) {

    return new Promise(
        function (resolve, reject) {

            if (!file) {

                resolve(null);

                return;

            }


            const reader =
                new FileReader();


            reader.onload = function () {

                const result =
                    reader.result || "";


                const base64 =
                    result.includes(",")
                        ? result.split(",")[1]
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


            reader.onerror = function () {

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
   APPLICATION ID
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
        "1.6";


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

function cleanValue(value) {

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


/* =====================================================
   PASSWORD AUTOFILL PROTECTION
===================================================== */

function setupPasswordProtection() {

    const password =
        document.getElementById(
            "retailerPassword"
        );


    if (!password) return;


    password.setAttribute(
        "autocomplete",
        "new-password"
    );


    password.setAttribute(
        "readonly",
        "readonly"
    );


    password.addEventListener(
        "focus",
        function () {

            this.removeAttribute(
                "readonly"
            );

        }
    );

}


/* =====================================================
   GLOBAL ACCESS
===================================================== */

window.retailerLogout =
    retailerLogout;

window.updateServiceAmount =
    updateServiceAmount;
