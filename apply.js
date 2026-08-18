/* =====================================================
   RAJKUMAR RATIONCARD SERVICES
   APPLY JS
===================================================== */


/*
 * Code.gs Deploy થયા પછી અહીં
 * તમારો Web App URL મૂકવાનો રહેશે.
 *
 * ઉદાહરણ:
 * const GOOGLE_SCRIPT_URL = "https://script.google.com/...";
 */

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwN-xev_9yNqkrce0rnZ-ePCwQ3wkqvQC1brT0CncJv4ce8yv7LuaKcuLojQKfMuaHS/exec";


/* UPI */

const UPI_ID = "gujrat.nsfa@ybl";

const UPI_NAME =
    "RAJKUMAR RATIONCARD SERVICES";


/* PAGE LOAD */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupServiceAmount();

        setupUPIPayment();

        setupApplicationForm();

        setupFileValidation();

        loadRetailerSession();

    }
);


/* RETAILER SESSION */

function loadRetailerSession() {

    const retailerId =
        sessionStorage.getItem(
            "retailerId"
        );

    const input =
        document.getElementById(
            "retailerId"
        );

    if (
        retailerId &&
        input
    ) {

        input.value =
            retailerId;

        input.readOnly =
            true;

    }

}


/* SERVICE AMOUNT */

function setupServiceAmount() {

    const select =
        document.getElementById(
            "serviceSelect"
        );

    if (!select) return;

    select.addEventListener(
        "change",
        updateAmount
    );

    updateAmount();

}


function updateAmount() {

    const select =
        document.getElementById(
            "serviceSelect"
        );

    const amount1 =
        document.getElementById(
            "serviceAmount"
        );

    const amount2 =
        document.getElementById(
            "paymentAmount"
        );

    if (!select) return;

    const option =
        select.options[
            select.selectedIndex
        ];

    let amount = 0;

    if (
        option &&
        option.dataset.amount
    ) {

        amount =
            Number(
                option.dataset.amount
            );

    }

    amount1.textContent =
        amount;

    amount2.textContent =
        amount;

}


/* UPI PAYMENT */

function setupUPIPayment() {

    const button =
        document.getElementById(
            "upiPayButton"
        );

    if (!button) return;


    button.addEventListener(
        "click",
        function () {

            const select =
                document.getElementById(
                    "serviceSelect"
                );

            const option =
                select.options[
                    select.selectedIndex
                ];

            if (
                !option ||
                !option.dataset.amount
            ) {

                alert(
                    "પહેલા Service પસંદ કરો."
                );

                return;

            }


            const amount =
                Number(
                    option.dataset.amount
                );


            if (
                amount <= 0
            ) {

                alert(
                    "Payment amount મળ્યો નથી."
                );

                return;

            }


            const upiUrl =
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
                    "Rationcard Service"
                );


            window.location.href =
                upiUrl;

        }
    );

}


/* FILE VALIDATION */

function setupFileValidation() {

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
                    aadhaar
                );

            }
        );

    }


    if (rationcard) {

        rationcard.addEventListener(
            "change",
            function () {

                if (
                    rationcard.files.length
                ) {

                    validatePDF(
                        rationcard
                    );

                }

            }
        );

    }


    if (screenshot) {

        screenshot.addEventListener(
            "change",
            function () {

                validateImage(
                    screenshot
                );

            }
        );

    }

}


/* PDF */

function validatePDF(input) {

    if (
        !input.files ||
        !input.files.length
    ) return true;


    const file =
        input.files[0];


    if (
        file.type !==
        "application/pdf"
    ) {

        input.value = "";

        alert(
            "માત્ર PDF file upload કરો."
        );

        return false;

    }


    if (
        file.size >
        10 * 1024 * 1024
    ) {

        input.value = "";

        alert(
            "PDF 10 MBથી નાની હોવી જોઈએ."
        );

        return false;

    }


    return true;

}


/* IMAGE */

function validateImage(input) {

    if (
        !input.files ||
        !input.files.length
    ) return true;


    const file =
        input.files[0];


    if (
        !file.type.startsWith(
            "image/"
        )
    ) {

        input.value = "";

        alert(
            "Payment Screenshot માટે image upload કરો."
        );

        return false;

    }


    if (
        file.size >
        5 * 1024 * 1024
    ) {

        input.value = "";

        alert(
            "Screenshot 5 MBથી નાનો હોવો જોઈએ."
        );

        return false;

    }


    return true;

}


/* FORM */

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


            const button =
                document.getElementById(
                    "submitApplicationButton"
                );

            const message =
                document.getElementById(
                    "applicationMessage"
                );


            if (
                !validateAllFiles()
            ) return;


            try {

                button.disabled =
                    true;

                button.textContent =
                    "⏳ Submit થઈ રહ્યું છે...";


                const data =
                    await collectData();


                if (
                    !GOOGLE_SCRIPT_URL
                ) {

                    showMessage(
                        message,

                        "⚠️ Form તૈયાર છે પરંતુ Google Apps Script URL હજુ જોડાયેલો નથી.",

                        false
                    );

                    console.log(
                        "Application Data:",
                        data
                    );

                    return;

                }


                const result =
                    await sendToGoogleScript(
                        data
                    );


                if (
                    result.success
                ) {

                    showMessage(
                        message,

                        "✅ Application Successfully Submitted!<br>" +
                        "Application ID: <strong>" +
                        escapeHTML(
                            result.applicationId
                        ) +
                        "</strong>",

                        true
                    );


                    form.reset();

                    updateAmount();

                } else {

                    showMessage(
                        message,

                        "❌ " +
                        (
                            result.message ||
                            "Application submit થઈ નથી."
                        ),

                        false
                    );

                }


            } catch (error) {

                console.error(
                    error
                );

                showMessage(
                    message,

                    "❌ Server સાથે connection error આવ્યો.",

                    false
                );

            } finally {

                button.disabled =
                    false;

                button.textContent =
                    "🚀 Submit Application";

            }

        }
    );

}


/* FILE CHECK */

function validateAllFiles() {

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


    if (
        !aadhaar.files.length
    ) {

        alert(
            "Aadhaar PDF upload કરો."
        );

        return false;

    }


    if (
        !validatePDF(
            aadhaar
        )
    ) return false;


    if (
        rationcard.files.length
    ) {

        if (
            !validatePDF(
                rationcard
            )
        ) return false;

    }


    if (
        !screenshot.files.length
    ) {

        alert(
            "Payment Screenshot upload કરો."
        );

        return false;

    }


    return validateImage(
        screenshot
    );

}


/* COLLECT DATA */

async function collectData() {

    const form =
        document.getElementById(
            "applicationForm"
        );


    const formData =
        new FormData(form);


    const aadhaar =
        document.getElementById(
            "aadhaarFile"
        ).files[0];


    const rationcard =
        document.getElementById(
            "rationcardFile"
        );


    const screenshot =
        document.getElementById(
            "paymentScreenshot"
        ).files[0];


    const select =
        document.getElementById(
            "serviceSelect"
        );


    const option =
        select.options[
            select.selectedIndex
        ];


    return {

        action:
            "submitApplication",

        retailerId:
            formData.get(
                "retailerId"
            ),

        retailerMobile:
            formData.get(
                "retailerMobile"
            ),

        service:
            formData.get(
                "service"
            ),

        amount:
            Number(
                option.dataset.amount
            ),

        aadhaarName:
            formData.get(
                "aadhaarName"
            ),

        englishName:
            formData.get(
                "englishName"
            ),

        gujaratiName:
            formData.get(
                "gujaratiName"
            ),

        rationCardNo:
            formData.get(
                "rationCardNo"
            ),

        gender:
            formData.get(
                "gender"
            ),

        village:
            formData.get(
                "village"
            ),

        taluka:
            formData.get(
                "taluka"
            ),

        district:
            formData.get(
                "district"
            ),

        pincode:
            formData.get(
                "pincode"
            ),

        mobile:
            formData.get(
                "mobile"
            ),

        email:
            formData.get(
                "email"
            ),

        birthDate:
            formData.get(
                "birthDate"
            ),

        birthYear:
            formData.get(
                "birthYear"
            ),

        rationcardStatus:
            formData.get(
                "rationcardStatus"
            ),

        utrNumber:
            formData.get(
                "utrNumber"
            ),

        aadhaarFile:
            await fileToBase64(
                aadhaar
            ),

        rationcardFile:
            rationcard.files.length
                ? await fileToBase64(
                    rationcard.files[0]
                  )
                : null,

        paymentScreenshot:
            await fileToBase64(
                screenshot
            )

    };

}


/* FILE BASE64 */

function fileToBase64(file) {

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


                    resolve({

                        name:
                            file.name,

                        mimeType:
                            file.type,

                        data:
                            result.split(",")[1]

                    });

                };


            reader.onerror =
                reject;


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* SEND GS */

async function sendToGoogleScript(
    data
) {

    const response =
        await fetch(
            GOOGLE_SCRIPT_URL,
            {

                method: "POST",

                body:
                    JSON.stringify(
                        data
                    )

            }
        );


    return await response.json();

}


/* MESSAGE */

function showMessage(
    element,
    message,
    success
) {

    element.style.display =
        "block";

    element.innerHTML =
        message;


    if (success) {

        element.style.background =
            "#e8f5e9";

        element.style.color =
            "#2e7d32";

    } else {

        element.style.background =
            "#fff3e0";

        element.style.color =
            "#e65100";

    }


    element.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* SECURITY */

function escapeHTML(value) {

    return String(value)

        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");

}