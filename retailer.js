/************************************************************
 * RAJKUMAR RATIONCARD SERVICES
 * RETAILER MANAGEMENT
 * FINAL JS
 *
 * WhatsApp completely removed.
 * Retailer account details are sent by EMAIL.
 ************************************************************/


// ==========================================================
// GOOGLE APPS SCRIPT WEB APP URL
// ==========================================================

const API_URL =
  "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";


// ==========================================================
// PAGE LOAD
// ==========================================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const form =
      document.getElementById(
        "retailerForm"
      );

    if (form) {

      form.addEventListener(
        "submit",
        function (event) {

          event.preventDefault();

          createRetailer();

        }
      );

    }

    loadRetailers();

  }
);


// ==========================================================
// CREATE RETAILER
// ==========================================================

async function createRetailer() {

  const retailerName =
    document
      .getElementById("retailerName")
      .value
      .trim();


  const mobile =
    document
      .getElementById("mobile")
      .value
      .trim();


  const email =
    document
      .getElementById("email")
      .value
      .trim();


  const username =
    document
      .getElementById("username")
      .value
      .trim();


  const password =
    document
      .getElementById("password")
      .value
      .trim();


  // --------------------------------------------------------
  // VALIDATION
  // --------------------------------------------------------

  if (!retailerName) {

    showMessage(
      "❌ Retailer Name is required.",
      "error"
    );

    return;

  }


  const mobileDigits =
    mobile.replace(/\D/g, "");


  if (
    mobileDigits.length !== 10
  ) {

    showMessage(
      "❌ Valid 10 digit Mobile Number નાખો.",
      "error"
    );

    return;

  }


  if (!email) {

    showMessage(
      "❌ Retailer Email is required.",
      "error"
    );

    document
      .getElementById("email")
      .focus();

    return;

  }


  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  if (
    !emailPattern.test(email)
  ) {

    showMessage(
      "❌ Valid Email Address નાખો.",
      "error"
    );

    document
      .getElementById("email")
      .focus();

    return;

  }


  if (!username) {

    showMessage(
      "❌ Username is required.",
      "error"
    );

    return;

  }


  if (!password) {

    showMessage(
      "❌ Password is required.",
      "error"
    );

    return;

  }


  const button =
    document.getElementById(
      "createRetailerBtn"
    );


  button.disabled = true;

  button.innerText =
    "Creating...";


  showMessage(
    "Please wait...",
    "success"
  );


  // --------------------------------------------------------
  // SEND TO CODE.GS
  // --------------------------------------------------------

  try {

    const response =
      await fetch(
        API_URL,
        {

          method:
            "POST",

          headers:
            {
              "Content-Type":
                "text/plain;charset=utf-8"
            },

          body:
            JSON.stringify({

              action:
                "createRetailer",

              retailerName:
                retailerName,

              mobile:
                mobile,

              email:
                email,

              username:
                username,

              password:
                password

            })

        }
      );


    const result =
      await response.json();


    console.log(
      "Create Retailer Result:",
      result
    );


    // ------------------------------------------------------
    // SUCCESS
    // ------------------------------------------------------

    if (
      result.success
    ) {

      let message =
        "✅ Retailer successfully created.\n\n" +

        "Retailer ID: " +
        result.retailerId +
        "\n\n" +

        "Username: " +
        result.username +
        "\n\n" +

        "Email: " +
        result.email;


      if (
        result.emailSent
      ) {

        message +=
          "\n\n📧 Login details email દ્વારા મોકલાઈ ગયા છે.";

      } else {

        message +=
          "\n\n⚠️ Retailer account બની ગયું છે, પરંતુ email મોકલી શકાયો નથી.";

      }


      showMessage(
        message,
        "success"
      );


      // ----------------------------------------------------
      // CLEAR FORM
      // ----------------------------------------------------

      document
        .getElementById(
          "retailerForm"
        )
        .reset();


      // ----------------------------------------------------
      // RELOAD RETAILERS
      // ----------------------------------------------------

      loadRetailers();


    } else {

      showMessage(

        "❌ Retailer create failed.\n\n" +

        (
          result.message ||
          "Unknown error."
        ),

        "error"

      );

    }


  } catch (error) {

    console.error(
      error
    );


    showMessage(

      "❌ API / Server Error.\n\n" +
      error.message,

      "error"

    );

  } finally {

    button.disabled =
      false;

    button.innerText =
      "Create Retailer";

  }

}


// ==========================================================
// LOAD RETAILERS
// ==========================================================

async function loadRetailers() {

  const tbody =
    document.getElementById(
      "retailerTableBody"
    );


  if (!tbody) {

    return;

  }


  try {

    const response =
      await fetch(
        API_URL,
        {

          method:
            "POST",

          headers:
            {
              "Content-Type":
                "text/plain;charset=utf-8"
            },

          body:
            JSON.stringify({

              action:
                "getRetailers"

            })

        }
      );


    /*
     * જો તમારા Code.gs માં getRetailers action
     * નથી, તો table empty રહેશે.
     */

    const result =
      await response.json();


    if (
      !result.success
    ) {

      tbody.innerHTML =
        `<tr>
          <td colspan="7">
            Retailer list loading unavailable.
          </td>
        </tr>`;

      return;

    }


    const retailers =
      result.retailers || [];


    if (
      retailers.length === 0
    ) {

      tbody.innerHTML =
        `<tr>
          <td colspan="7">
            No retailers found.
          </td>
        </tr>`;

      return;

    }


    tbody.innerHTML =
      retailers
        .map(
          function (retailer) {

            return `

              <tr>

                <td>
                  ${escapeHtml(
                    retailer["Retailer ID"] || ""
                  )}
                </td>

                <td>
                  ${escapeHtml(
                    retailer["Retailer Name"] || ""
                  )}
                </td>

                <td>
                  ${escapeHtml(
                    retailer["Mobile"] || ""
                  )}
                </td>

                <td>
                  ${escapeHtml(
                    retailer["Email"] || ""
                  )}
                </td>

                <td>
                  ${escapeHtml(
                    retailer["Username"] || ""
                  )}
                </td>

                <td class="status-active">
                  ${escapeHtml(
                    retailer["Status"] || ""
                  )}
                </td>

                <td>
                  ${escapeHtml(
                    String(
                      retailer["Total Applications"] || 0
                    )
                  )}
                </td>

              </tr>

            `;

          }
        )
        .join("");


  } catch (error) {

    console.error(
      "Load retailers error:",
      error
    );


    tbody.innerHTML =
      `<tr>
        <td colspan="7">
          Unable to load retailer list.
        </td>
      </tr>`;

  }

}


// ==========================================================
// MESSAGE
// ==========================================================

function showMessage(
  text,
  type
) {

  const box =
    document.getElementById(
      "message"
    );


  if (!box) {

    return;

  }


  box.textContent =
    text;


  box.className =
    "message " +
    (
      type === "error"
        ? "error"
        : "success"
    );

}


// ==========================================================
// HTML ESCAPE
// ==========================================================

function escapeHtml(value) {

  return String(value)
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
