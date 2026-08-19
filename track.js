const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzAQQPhHzepS9LyOASh1KpyFaXh9QPzbP7qV7bO-1urDyeKFpcnEEWhAL7MjnsW9BSaxA/exec";


document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("trackForm");
  const input = document.getElementById("applicationId");
  const result = document.getElementById("trackResult");
  const button = document.getElementById("trackButton");

  if (!form) {
    console.log("Track form not found");
    return;
  }

  form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const applicationId =
      input ? input.value.trim() : "";

    if (!applicationId) {
      showMessage(
        "Please enter Application ID",
        "error"
      );
      return;
    }

    button.disabled = true;
    button.innerText = "Checking...";

    result.innerHTML = "";

    try {

      const url =
        GOOGLE_SCRIPT_URL +
        "?action=trackApplication" +
        "&applicationId=" +
        encodeURIComponent(applicationId);

      const response =
        await fetch(url);

      const data =
        await response.json();

      if (data.success) {

        showApplication(data);

      } else {

        showMessage(
          data.message ||
          "Application not found.",
          "error"
        );

      }

    } catch (error) {

      console.error(error);

      showMessage(
        "Server connection error. Please try again.",
        "error"
      );

    }

    button.disabled = false;
    button.innerText = "Track Application";

  });

});


function showApplication(data) {

  const result =
    document.getElementById("trackResult");

  result.innerHTML = `

    <div class="track-card">

      <div class="track-title">
        RAJKUMAR RATIONCARD SERVICES
      </div>

      <div class="track-id">
        Application ID:
        <strong>${safe(data.applicationId)}</strong>
      </div>

      <div class="track-row">
        <span>Applicant Name</span>
        <strong>${safe(data.applicant)}</strong>
      </div>

      <div class="track-row">
        <span>Service</span>
        <strong>${safe(data.service)}</strong>
      </div>

      <div class="track-row">
        <span>Amount</span>
        <strong>₹${safe(data.amount)}</strong>
      </div>

      <div class="track-row">
        <span>Mobile</span>
        <strong>${safe(data.mobile)}</strong>
      </div>

      <div class="track-row">
        <span>Application Date</span>
        <strong>${safe(data.date)}</strong>
      </div>

      <div class="track-status">

        <div>
          <small>Payment Status</small>
          <strong class="${statusClass(data.paymentStatus)}">
            ${safe(data.paymentStatus || "Pending")}
          </strong>
        </div>

        <div>
          <small>Application Status</small>
          <strong class="${statusClass(data.applicationStatus)}">
            ${safe(data.applicationStatus || "Submitted")}
          </strong>
        </div>

      </div>

      <div class="track-updated">
        Last Updated:
        ${safe(data.updatedAt)}
      </div>

    </div>

  `;

}


function showMessage(message, type) {

  const result =
    document.getElementById("trackResult");

  result.innerHTML = `

    <div class="track-message ${type}">
      ${safe(message)}
    </div>

  `;

}


function statusClass(status) {

  const value =
    String(status || "")
      .toLowerCase();

  if (
    value.includes("approved") ||
    value.includes("success") ||
    value.includes("paid") ||
    value.includes("completed")
  ) {
    return "success";
  }

  if (
    value.includes("reject") ||
    value.includes("cancel")
  ) {
    return "danger";
  }

  return "pending";

}


function safe(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}
