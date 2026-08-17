/* =====================================================
   RAJKUMAR DIGITAL SERVICES
   RATION CARD APPLICATION
   APPLY.JS
===================================================== */

/* =====================================================
   GOOGLE APPS SCRIPT WEB APP URL
===================================================== */

const SCRIPT_URL =
  "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";


/* =====================================================
   FILE TO BASE64
===================================================== */

function fileToBase64(file) {

  return new Promise(function(resolve, reject) {

    if (!file) {
      resolve("");
      return;
    }

    const reader = new FileReader();

    reader.onload = function() {

      try {

        const result = reader.result;

        const base64 =
          result.split(",")[1] || "";

        resolve(base64);

      } catch (error) {

        reject(error);

      }

    };

    reader.onerror = function() {

      reject(
        new Error("File reading failed.")
      );

    };

    reader.readAsDataURL(file);

  });

}


/* =====================================================
   GET ELEMENT
===================================================== */

function getElement(id) {

  return document.getElementById(id);

}


/* =====================================================
   SHOW MESSAGE
===================================================== */

function showMessage(
  message,
  type = "info"
) {

  let box =
    getElement("formMessage");

  if (!box) {

    box =
      document.createElement("div");

    box.id =
      "formMessage";

    const form =
      document.querySelector("form");

    if (form) {

      form.prepend(box);

    } else {

      document.body.prepend(box);

    }

  }

  box.textContent =
    message;

  box.className =
    "form-message " + type;

  box.style.display =
    "block";

}


/* =====================================================
   HIDE MESSAGE
===================================================== */

function hideMessage() {

  const box =
    getElement("formMessage");

  if (box) {

    box.style.display =
      "none";

  }

}


/* =====================================================
   SET BUTTON LOADING
===================================================== */

function setButtonLoading(
  loading
) {

  const button =
    getElement("submitBtn") ||
    document.querySelector(
      'button[type="submit"]'
    );

  if (!button) return;

  if (loading) {

    button.disabled =
      true;

    button.dataset.oldText =
      button.textContent;

    button.textContent =
      "Submitting...";

  } else {

    button.disabled =
      false;

    button.textContent =
      button.dataset.oldText ||
      "Submit Application";

  }

}


/* =====================================================
   GET INPUT VALUE
===================================================== */

function valueOf(id) {

  const element =
    getElement(id);

  if (!element) {

    return "";

  }

  return String(
    element.value || ""
  ).trim();

}


/* =====================================================
   GET FILE
===================================================== */

function fileOf(id) {

  const element =
    getElement(id);

  if (
    !element ||
    !element.files ||
    !element.files.length
  ) {

    return null;

  }

  return element.files[0];

}


/* =====================================================
   CREATE FINAL NAME
===================================================== */

function createFinalName() {

  const englishName =
    valueOf("englishName");

  const gujaratiName =
    valueOf("gujaratiName");

  const husbandName =
    valueOf("husbandName");

  const nameTypeElement =
    getElement("nameType");

  const nameType =
    nameTypeElement
      ? String(
          nameTypeElement.value || ""
        ).trim()
      : "";

  /*
   * If Husband/W/O selected
   */

  if (
    nameType.toLowerCase() ===
      "husband" ||
    nameType.toLowerCase() ===
      "w/o" ||
    nameType.toLowerCase() ===
      "wife"
  ) {

    if (
      gujaratiName &&
      husbandName
    ) {

      return (
        gujaratiName +
        " W/O " +
        husbandName
      );

    }

    if (
      englishName &&
      husbandName
    ) {

      return (
        englishName +
        " W/O " +
        husbandName
      );

    }

  }

  return (
    gujaratiName ||
    englishName
  );

}


/* =====================================================
   NAME TYPE CHANGE
===================================================== */

function handleNameType() {

  const nameType =
    getElement("nameType");

  const husbandGroup =
    getElement("husbandNameGroup");

  const husbandInput =
    getElement("husbandName");

  if (!nameType) return;

  const value =
    String(
      nameType.value || ""
    ).toLowerCase();

  const showHusband =
    value === "husband" ||
    value === "w/o" ||
    value === "wife";

  if (husbandGroup) {

    husbandGroup.style.display =
      showHusband
        ? "block"
        : "none";

  }

  if (husbandInput) {

    husbandInput.required =
      showHusband;

    if (!showHusband) {

      husbandInput.value =
        "";

    }

  }

}


/* =====================================================
   PAYMENT SCREENSHOT VALIDATION
===================================================== */

function validateFile(
  file,
  allowedTypes,
  maxSizeMB
) {

  if (!file) {

    return {
      valid: false,
      message: "File required."
    };

  }

  const sizeMB =
    file.size /
    (1024 * 1024);

  if (
    sizeMB >
    maxSizeMB
  ) {

    return {

      valid: false,

      message:
        file.name +
        " is larger than " +
        maxSizeMB +
        " MB."

    };

  }

  if (
    allowedTypes.length &&
    !allowedTypes.includes(
      file.type
    )
  ) {

    return {

      valid: false,

      message:
        "Invalid file type: " +
        file.name

    };

  }

  return {
    valid: true,
    message: ""
  };

}


/* =====================================================
   SUBMIT APPLICATION
===================================================== */

async function sendApplication(
  event
) {

  if (event) {

    event.preventDefault();

  }

  hideMessage();


  /* -----------------------------------------------
     CHECK SCRIPT URL
  ----------------------------------------------- */

  if (
    !SCRIPT_URL ||
    SCRIPT_URL.indexOf(
      "YOUR_GOOGLE"
    ) !== -1
  ) {

    showMessage(
      "Google Apps Script Web App URL set કરો.",
      "error"
    );

    return;

  }


  /* -----------------------------------------------
     BASIC DETAILS
  ----------------------------------------------- */

  const englishName =
    valueOf("englishName");

  const gujaratiName =
    valueOf("gujaratiName");

  const mobile =
    valueOf("mobile");

  const village =
    valueOf("village");

  const taluka =
    valueOf("taluka");

  const district =
    valueOf("district");

  const rationCardNumber =
    valueOf("rationCardNumber");

  const service =
    valueOf("service");

  const nameType =
    valueOf("nameType");

  const husbandName =
    valueOf("husbandName");


  /* -----------------------------------------------
     REQUIRED VALIDATION
  ----------------------------------------------- */

  if (!englishName) {

    showMessage(
      "English Name નાખો.",
      "error"
    );

    return;

  }


  if (!mobile) {

    showMessage(
      "Mobile Number નાખો.",
      "error"
    );

    return;

  }


  if (
    !/^[0-9]{10}$/.test(
      mobile
    )
  ) {

    showMessage(
      "Valid 10 digit Mobile Number નાખો.",
      "error"
    );

    return;

  }


  if (!village) {

    showMessage(
      "Village નાખો.",
      "error"
    );

    return;

  }


  if (!taluka) {

    showMessage(
      "Taluka નાખો.",
      "error"
    );

    return;

  }


  if (!district) {

    showMessage(
      "District નાખો.",
      "error"
    );

    return;

  }


  if (!service) {

    showMessage(
      "Service select કરો.",
      "error"
    );

    return;

  }


  if (
    nameType &&
    (
      nameType.toLowerCase() === "husband" ||
      nameType.toLowerCase() === "w/o" ||
      nameType.toLowerCase() === "wife"
    ) &&
    !husbandName
  ) {

    showMessage(
      "Husband Name નાખો.",
      "error"
    );

    return;

  }


  /* -----------------------------------------------
     FILES
  ----------------------------------------------- */

  const aadhaarFile =
    fileOf("aadhaarFile");

  const rationFile =
    fileOf("rationFile");

  const paymentScreenshot =
    fileOf(
      "paymentScreenshot"
    );


  /*
   * Aadhaar
   */

  if (aadhaarFile) {

    const check =
      validateFile(
        aadhaarFile,
        [
          "application/pdf",
          "image/jpeg",
          "image/png",
          "image/jpg"
        ],
        10
      );

    if (!check.valid) {

      showMessage(
        check.message,
        "error"
      );

      return;

    }

  }


  /*
   * Ration Card
   */

  if (rationFile) {

    const check =
      validateFile(
        rationFile,
        [
          "application/pdf",
          "image/jpeg",
          "image/png",
          "image/jpg"
        ],
        10
      );

    if (!check.valid) {

      showMessage(
        check.message,
        "error"
      );

      return;

    }

  }


  /*
   * Payment Screenshot
   */

  if (!paymentScreenshot) {

    showMessage(
      "Payment Screenshot upload કરો.",
      "error"
    );

    return;

  }


  const paymentCheck =
    validateFile(
      paymentScreenshot,
      [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf"
      ],
      10
    );


  if (!paymentCheck.valid) {

    showMessage(
      paymentCheck.message,
      "error"
    );

    return;

  }


  /* -----------------------------------------------
     TRANSACTION ID
  ----------------------------------------------- */

  const transactionId =
    valueOf(
      "transactionId"
    );


  /* -----------------------------------------------
     FINAL NAME
  ----------------------------------------------- */

  const finalName =
    createFinalName();


  /* -----------------------------------------------
     RETAILER INFORMATION
  ----------------------------------------------- */

  let retailerId =
    localStorage.getItem(
      "retailerId"
    ) || "";

  let retailerName =
    localStorage.getItem(
      "retailerName"
    ) || "";

  let retailerUsername =
    localStorage.getItem(
      "retailerUsername"
    ) || "";


  /*
   * Support sessionStorage also
   */

  if (!retailerId) {

    retailerId =
      sessionStorage.getItem(
        "retailerId"
      ) || "";

  }

  if (!retailerName) {

    retailerName =
      sessionStorage.getItem(
        "retailerName"
      ) || "";

  }


  /* -----------------------------------------------
     BUTTON LOADING
  ----------------------------------------------- */

  setButtonLoading(
    true
  );


  showMessage(
    "Application submit થઈ રહી છે... કૃપા કરીને wait કરો.",
    "info"
  );


  try {

    /* ---------------------------------------------
       CONVERT FILES
    --------------------------------------------- */

    const aadhaarBase64 =
      await fileToBase64(
        aadhaarFile
      );

    const rationBase64 =
      await fileToBase64(
        rationFile
      );

    const paymentBase64 =
      await fileToBase64(
        paymentScreenshot
      );


    /* ---------------------------------------------
       CREATE PAYLOAD
    --------------------------------------------- */

    const payload = {

      action:
        "submitApplication",

      englishName:
        englishName,

      gujaratiName:
        gujaratiName,

      finalName:
        finalName,

      mobile:
        mobile,

      nameType:
        nameType,

      husbandName:
        husbandName,

      village:
        village,

      taluka:
        taluka,

      district:
        district,

      rationCardNumber:
        rationCardNumber,

      service:
        service,

      transactionId:
        transactionId,

      aadhaarFile:
        aadhaarBase64,

      rationFile:
        rationBase64,

      paymentScreenshot:
        paymentBase64,

      retailerId:
        retailerId,

      retailerName:
        retailerName,

      retailerUsername:
        retailerUsername,

      whatsappLink:
        "https://wa.me/91" +
        mobile

    };


    /* ---------------------------------------------
       SEND TO GOOGLE APPS SCRIPT
    --------------------------------------------- */

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
              payload
            )

        }
      );


    if (!response.ok) {

      throw new Error(
        "Server returned HTTP " +
        response.status
      );

    }


    const result =
      await response.json();


    /* ---------------------------------------------
       SUCCESS
    --------------------------------------------- */

    if (
      result &&
      result.success
    ) {

      showMessage(
        "Application successfully submit થઈ ગઈ.",
        "success"
      );


      /*
       * Show Application ID
       */

      const applicationId =
        result.applicationId ||
        "";


      if (applicationId) {

        showMessage(
          "Application submitted successfully. Application ID: " +
          applicationId,
          "success"
        );

      }


      /*
       * Save last application
       */

      try {

        localStorage.setItem(
          "lastApplicationId",
          applicationId
        );

      }

      catch (e) {}


      /*
       * Reset form
       */

      const form =
        document.querySelector(
          "form"
        );

      if (form) {

        form.reset();

      }


      handleNameType();


      /*
       * Optional success redirect
       *
       * If apply.html માં
       * success page હોય તો
       * નીચેની line enable કરી શકો.
       */

      // setTimeout(function() {
      //   window.location.href =
      //     "retailer-dashboard.html";
      // }, 2500);


    } else {

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
      "Application Submit Error:",
      error
    );


    showMessage(
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
      false
    );

  }

}


/* =====================================================
   FORM SUBMIT EVENT
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    /* -----------------------------------------------
       Name Type
    ----------------------------------------------- */

    const nameType =
      getElement("nameType");

    if (nameType) {

      nameType.addEventListener(
        "change",
        handleNameType
      );

      handleNameType();

    }


    /* -----------------------------------------------
       FORM
    ----------------------------------------------- */

    const form =
      document.querySelector(
        "form"
      );

    if (form) {

      form.addEventListener(
        "submit",
        sendApplication
      );

    }


    /* -----------------------------------------------
       SERVICE
    ----------------------------------------------- */

    const service =
      getElement("service");

    if (service) {

      /*
       * Only Ration Card service
       */

      if (
        !service.value
      ) {

        const rationOption =
          Array.from(
            service.options || []
          ).find(function(option) {

            return (
              option.value
                .toLowerCase()
                .includes(
                  "ration"
                ) ||
              option.textContent
                .toLowerCase()
                .includes(
                  "ration"
                )
            );

          });

        if (rationOption) {

          service.value =
            rationOption.value;

        }

      }

    }

  }
);


/* =====================================================
   GLOBAL FUNCTION
===================================================== */

window.sendApplication =
  sendApplication;

