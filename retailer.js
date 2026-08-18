/* =====================================================
   RAJKUMAR RATIONCARD SERVICES
   FINAL RETAILER JAVASCRIPT
===================================================== */

"use strict";


/* =====================================================
   GOOGLE APPS SCRIPT URL
===================================================== */

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbw1mKC92_EjWJS_x2o8LMqiL9sssMbFh089IhMujZLd6_9VuujoVckjoMS8fbajVn-uQQ/exec";


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    preventOldFormCache();

    setupRetailerLogin();

    setupServiceAmount();

    setupApplicationForm();

    setupPaymentButton();

    setupLogout();

    checkRetailerSession();

});


/* =====================================================
   PREVENT OLD FORM CACHE
===================================================== */

function preventOldFormCache() {

    const loginForm =
        document.getElementById("retailerLoginForm");

    if (loginForm) {
        loginForm.reset();
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
                    "loginButton"
                );


            setButtonLoading(
                button,
                true,
                "LOGIN..."
            );


            showLoginMessage(
                "🔄 Login ચેક થઈ રહ્યું છે...",
                "loading"
            );


            try {

                const result =
                    await postToAppsScript({

                        action:
                            "retailerLogin",

                        username:
                            retailerId,

                        password:
                            password

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
                        result.retailerId ||
                        retailerId;


                    const name =
                        result.retailerName ||
                        id;


                    const mobile =
                        result.mobile ||
                        "";


                    const username =
                        result.username ||
                        retailerId;


                    /* =========================
                       SESSION
                    ========================= */

                    sessionStorage.setItem(
                        "retailerLoggedIn",
                        "true"
                    );

                    sessionStorage.setItem(
                        "retailerId",
                        id
                    );


                    /* =========================
                       LOCAL STORAGE
                    ========================= */

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


                    setTimeout(
                        function () {

                            showDashboard(id);

                        },
                        400
                    );


                    return;

                }


                showLoginMessage(

                    "❌ " +
                    (
                        result &&
                        result.message
                            ? result.message
                            : "Retailer ID અથવા Password ખોટો છે."
                    ),

                    "error"

                );


            }
            catch (error) {

                console.error(
                    "Retailer Login Error:",
                    error
                );


                showLoginMessage(
                    "❌ Server connection failed. Apps Script URL અથવા deployment ચેક કરો.",
                    "error"
                );

            }
            finally {

                setButtonLoading(
                    button,
                    false,
                    "LOGIN"
                );

            }

        }
    );

}


/* =====================================================
   APPS SCRIPT REQUEST
===================================================== */

async function postToAppsScript(data) {

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
            "HTTP " +
            response.status
        );

    }


    const text =
        await response.text();


    let result;


    try {

        result =
            JSON.parse(text);

    }
    catch (error) {

        console.error(
            "Invalid server response:",
            text
        );

        throw new Error(
            "Invalid response from Google Apps Script."
        );

    }


    return result;

}


/* =====================================================
   SHOW DASHBOARD
===================================================== */

function showDashboard(retailerId) {

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
        retailerId;


    const nameElement =
        document.getElementById(
            "loggedRetailerName"
        );


    if (nameElement) {

        nameElement.textContent =
            name;

    }


    const idElement =
        document.getElementById(
            "loggedRetailerId"
        );


    if (idElement) {

        idElement.textContent =
            retailerId;

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =====================================================
   CHECK SESSION
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
        retailerLogout
    );

}


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


    keys.forEach(
        function (key) {

            localStorage.removeItem(
                key
            );

        }
    );


    window.location.replace(
        "retailer.html"
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


    const amount =
        Number(
            option &&
            option.dataset &&
            option.dataset.amount
                ? option.dataset.amount
                : 0
        );


    const amountElement =
        document.getElementById(
            "serviceAmount"
        );


    const paymentElement =
        document.getElementById(
            "paymentAmount"
        );


    const payButtonAmount =
        document.getElementById(
            "payButtonAmount"
        );


    if (amountElement) {

        amountElement.textContent =
            amount;

    }


    if (paymentElement) {

        paymentElement.textContent =
            amount;

    }


    if (payButtonAmount) {

        payButtonAmount.textContent =
            amount;

    }

}


/* =====================================================
   PAYMENT BUTTON
===================================================== */

function setupPaymentButton() {

    const button =
        document.getElementById(
            "payButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        async function () {

            const select =
                document.getElementById(
                    "serviceSelect"
                );


            if (
                !select ||
                !select.value
            ) {

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


            const applicationId =
                "RKS-" +
                Date.now();


            try {

                button.disabled =
                    true;


                button.textContent =
                    "Opening UPI...";


                const result =
                    await postToAppsScript({

                        action:
                            "getUPIPayment",

                        amount:
                            amount,

                        applicationId:
                            applicationId

                    });


                if (
                    result &&
                    result.success &&
                    result.upiLink
                ) {

                    window.location.href =
                        result.upiLink;

                }
                else {

                    throw new Error(
                        result &&
                        result.message
                            ? result.message
                            : "UPI link failed."
                    );

                }

            }
            catch (error) {

                console.error(
                    "UPI ERROR:",
                    error
                );


                alert(
                    "UPI payment open થઈ શક્યું નથી.\n\nUPI ID: gujrat.nsfa@ybl"
                );

            }
            finally {

                button.disabled =
                    false;


                updatePaymentButtonText();

            }

        }
    );

}


function updatePaymentButtonText() {

    const button =
        document.getElementById(
            "payButton"
        );


    const amount =
        document.getElementById(
            "payButtonAmount"
        );


    if (button) {

        button.innerHTML =
            "Pay ₹" +
            (
                amount
                    ? amount.textContent
                    : "0"
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
        submitApplication
    );

}


/* =====================================================
   SUBMIT APPLICATION
===================================================== */

async function submitApplication(event) {

    event.preventDefault();


    const form =
        event.target;


    const service =
        document.getElementById(
            "serviceSelect"
        );


    const message =
        document.getElementById(
            "applicationMessage"
        );


    if (
        !service ||
        !service.value
    ) {

        showApplicationMessage(
            message,
            "⚠️ પહેલા Service પસંદ કરો.",
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
            message,
            "⚠️ Service amount મળ્યો નથી.",
            "error"
        );

        return;

    }


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
        !aadhaarFile.files.length
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
        !paymentScreenshot.files.length
    ) {

        showApplicationMessage(
            message,
            "⚠️ Payment Screenshot upload કરો.",
            "error"
        );

        return;

    }


    const retailerId =
        sessionStorage.getItem(
            "retailerId"
        ) ||
        localStorage.getItem(
            "rajkumarRetailerId"
        );


    if (!retailerId) {

        showApplicationMessage(
            message,
            "❌ Retailer session મળી નથી. ફરી login કરો.",
            "error"
        );

        return;

    }


    const submitButton =
        document.getElementById(
            "submitApplicationButton"
        );


    setButtonLoading(
        submitButton,
        true,
        "SUBMITTING..."
    );


    showApplicationMessage(
        message,
        "🔄 Application submit થઈ રહી છે. કૃપા કરીને રાહ જુઓ...",
        "loading"
    );


    try {

        const aadhaarData =
            await fileToBase64(
                aadhaarFile.files[0]
            );


        let rationcardData =
            null;


        if (
            rationcardFile &&
            rationcardFile.files.length
        ) {

            rationcardData =
                await fileToBase64(
                    rationcardFile.files[0]
                );

        }


        const paymentData =
            await fileToBase64(
                paymentScreenshot.files[0]
            );


        const formData =
            new FormData(form);


        const data = {

            action:
                "submitApplication",


            retailerId:
                retailerId,


            retailerMobile:
                localStorage.getItem(
                    "rajkumarRetailerMobile"
                ) || "",


            service:
                service.value,


            aadhaarName:
                cleanValue(
                    formData.get("aadhaarName")
                ),


            englishName:
                cleanValue(
                    formData.get("englishName")
                ),


            gujaratiName:
                cleanValue(
                    formData.get("gujaratiName")
                ),


            rationCardNo:
                cleanValue(
                    formData.get("rationCardNo")
                ),


            gender:
                cleanValue(
                    formData.get("gender")
                ),


            village:
                cleanValue(
                    formData.get("village")
                ),


            taluka:
                cleanValue(
                    formData.get("taluka")
                ),


            district:
                cleanValue(
                    formData.get("district")
                ),


            pincode:
                cleanValue(
                    formData.get("pincode")
                ),


            mobile:
                cleanValue(
                    formData.get("mobile")
                ),


            email:
                cleanValue(
                    formData.get("email")
                ),


            birthDate:
                cleanValue(
                    formData.get("birthDate")
                ),


            birthYear:
                cleanValue(
                    formData.get("birthYear")
                ),


            rationcardStatus:
                cleanValue(
                    formData.get(
                        "rationcardStatus"
                    )
                ),


            utrNumber:
                cleanValue(
                    formData.get(
                        "utrNumber"
                    )
                ),


            aadhaarFile:
                aadhaarData,


            rationcardFile:
                rationcardData,


            paymentScreenshot:
                paymentData

        };


        const result =
            await postToAppsScript(
                data
            );


        console.log(
            "Submit result:",
            result
        );


        if (
            result &&
            result.success === true
        ) {

            showApplicationMessage(

                message,

                `
                <div style="text-align:center;">
                    <div style="font-size:32px;">✅</div>

                    <h3>Application Submitted Successfully</h3>

                    <p>
                        Application ID:
                        <strong>${escapeHtml(
                            result.applicationId || ""
                        )}</strong>
                    </p>

                    <p>
                        Service:
                        ${escapeHtml(
                            result.service || ""
                        )}
                    </p>

                    <p>
                        Amount:
                        ₹${escapeHtml(
                            String(
                                result.amount || amount
                            )
                        )}
                    </p>

                    <p>
                        Payment Status:
                        ${escapeHtml(
                            result.paymentStatus || "Pending"
                        )}
                    </p>

                    <p>
                        Application Status:
                        ${escapeHtml(
                            result.applicationStatus || "Submitted"
                        )}
                    </p>
                </div>
                `,

                "success"
            );


            form.reset();


            service.value =
                "";


            updateServiceAmount();


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

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
            (
                error.message ||
                "Application submit failed."
            ),

            "error"

        );

    }
    finally {

        setButtonLoading(
            submitButton,
            false,
            "SUBMIT APPLICATION"
        );

    }

}


/* =====================================================
   FILE TO BASE64
===================================================== */

function fileToBase64(file) {

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


    applyMessageStyle(
        element,
        type
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


    applyMessageStyle(
        element,
        type
    );

}


/* =====================================================
   MESSAGE STYLE
===================================================== */

function applyMessageStyle(
    element,
    type
) {

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


/* =====================================================
   BUTTON LOADING
===================================================== */

function setButtonLoading(
    button,
    loading,
    text
) {

    if (!button) {
        return;
    }


    if (loading) {

        button.disabled =
            true;

        button.dataset.originalText =
            button.innerHTML;

        button.innerHTML =
            text;

    }
    else {

        button.disabled =
            false;

        button.innerHTML =
            text ||
            button.dataset.originalText ||
            "SUBMIT";

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

    return String(
        value || ""
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
   MOBILE VALIDATION
===================================================== */

document.addEventListener(
    "input",
    function (event) {

        const id =
            event.target.id;


        if (
            id === "mobile" ||
            id === "pincode"
        ) {

            event.target.value =
                event.target.value
                    .replace(
                        /\D/g,
                        ""
                    );

        }

    }
);


/* =====================================================
   PASSWORD / LOGIN CLEANUP
===================================================== */

window.addEventListener(
    "pageshow",
    function () {

        const form =
            document.getElementById(
                "retailerLoginForm"
            );


        if (
            form &&
            sessionStorage.getItem(
                "retailerLoggedIn"
            ) !== "true"
        ) {

            form.reset();

        }

    }
);
