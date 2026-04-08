// confirmationScript.js
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Populate user info from sessionStorage
  const storedUserData = sessionStorage.getItem("userData");
  if (storedUserData) {
    try {
      const userData = JSON.parse(storedUserData);
      const nameElement = document.getElementById("name");
      if (nameElement) nameElement.textContent = `${userData.firstName || ""} ${userData.lastName || ""}`.trim();
      const phoneElement = document.getElementById("phone");
      if (phoneElement) phoneElement.textContent = `${userData.phone || ""}`;
    } catch (e) {
      console.warn("Invalid userData in sessionStorage", e);
    }
  }

  // Populate vehicle info
  const storedVehicleData = sessionStorage.getItem("vehicleData");
  if (storedVehicleData) {
    try {
      const vehicleData = JSON.parse(storedVehicleData);
      const vehicleMakeElement = document.getElementById("vehicleMake");
      if (vehicleMakeElement) vehicleMakeElement.textContent = `${vehicleData.make || ""}`;
      const vehicleTypeElement = document.getElementById("vehicleType");
      if (vehicleTypeElement) vehicleTypeElement.textContent = `${vehicleData.type || ""}`;
      const vehicleColorElement = document.getElementById("vehicleColor");
      if (vehicleColorElement) vehicleColorElement.textContent = `${vehicleData.color || ""}`;
      const vehicleYearElement = document.getElementById("vehicleYear");
      if (vehicleYearElement) vehicleYearElement.textContent = `${vehicleData.year || ""}`;
    } catch (e) {
      console.warn("Invalid vehicleData in sessionStorage", e);
    }
  }

  // Populate selected services
  const storedSelectedServices = sessionStorage.getItem("selectedServices");
  if (storedSelectedServices) {
    try {
      const selectedServices = JSON.parse(storedSelectedServices);
      const servicesElement = document.getElementById("services");
      if (servicesElement && Array.isArray(selectedServices)) servicesElement.textContent = selectedServices.join(", ");
    } catch (e) {
      console.warn("Invalid selectedServices in sessionStorage", e);
    }
  }

  // Populate appointment info
  const storedAppointmentData = sessionStorage.getItem("appointmentData");
  if (storedAppointmentData) {
    try {
      const appointmentData = JSON.parse(storedAppointmentData);
      const dateElement = document.getElementById("date");
      if (dateElement) dateElement.textContent = `${appointmentData.dayOfWeek || ""}${appointmentData.month ? ", " + appointmentData.month + " " + (appointmentData.day || "") : ""}`.trim();
      const timeElement = document.getElementById("time");
      if (timeElement) timeElement.textContent = `${appointmentData.time || ""}`;
    } catch (e) {
      console.warn("Invalid appointmentData in sessionStorage", e);
    }
  }

  // Attach click listener to the OK button (preferred)
  const finishBtn = document.getElementById("finishBtn");
  if (finishBtn) {
    finishBtn.addEventListener("click", (e) => {
      e.preventDefault();
      finish();
    });
  }
});

/**
 * Collects confirmation data, validates, posts to /api/appointments,
 * clears sessionStorage on success, and shows user feedback.
 */
async function finish() {
  // Helper to read display inputs or fallback to sessionStorage
  const getText = (id) => {
    const el = document.getElementById(id);
    if (!el) return "";
    if ("value" in el) return (el.value || "").trim();
    return (el.textContent || "").trim();
  };

  // Try to read structured session data as fallback
  const user = (() => {
    try { return JSON.parse(sessionStorage.getItem("userData") || "{}"); } catch { return {}; }
  })();
  const vehicle = (() => {
    try { return JSON.parse(sessionStorage.getItem("vehicleData") || "{}"); } catch { return {}; }
  })();
  const appointment = (() => {
    try { return JSON.parse(sessionStorage.getItem("appointmentData") || "{}"); } catch { return {}; }
  })();
  const servicesArr = (() => {
    try { return JSON.parse(sessionStorage.getItem("selectedServices") || "[]"); } catch { return []; }
  })();

  const payload = {
    FirstName: getText("FirstName") || user.firstName || "",
    LastName: getText("LastName") || user.lastName || "",
    Phone: getText("Phone") || user.phone || "",
    Email: getText("Email") || user.email || "",
    CarMake: getText("CarMake") || vehicle.make || "",
    CarType: getText("CarType") || vehicle.type || "",
    CarColor: getText("CarColor") || vehicle.color || "",
    CarYear: (() => {
      const v = getText("CarYear") || vehicle.year || "";
      const n = Number(v);
      return Number.isFinite(n) && v !== "" ? n : "";
    })(),
    ServiceType: getText("ServiceType") || (Array.isArray(servicesArr) ? servicesArr.join(", ") : ""),
    AppointmentDate: getText("AppointmentDate") || appointment.date || appointment.appointmentDate || "",
    Time: getText("Time") || appointment.time || ""
  };

  // Basic client-side validation
  const required = ["FirstName", "LastName", "AppointmentDate", "Time", "ServiceType"];
  for (const k of required) {
    if (!payload[k] || String(payload[k]).trim() === "") {
      alert(`Please fill the required field ${k}`);
      return;
    }
  }

  try {
    console.log("Submitting appointment payload", payload);
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const body = await res.json().catch(() => ({}));
    if (res.ok) {
      console.log("Appointment saved", body);
      // Clear session storage only after success
      sessionStorage.removeItem("userData");
      sessionStorage.removeItem("vehicleData");
      sessionStorage.removeItem("selectedServices");
      sessionStorage.removeItem("appointmentData");

      alert("Form submitted successfully!");
      // optional: redirect to a thank-you page
      // window.location.href = "/thank-you.html";
    } else {
      console.error("Server returned error", res.status, body);
      alert("Failed to save appointment. Please try again.");
    }
  } catch (err) {
    console.error("Network or JS error", err);
    alert("Network error. Please check your connection and try again.");
  }
}

// Expose for compatibility with any remaining inline handlers
window.finish = finish;
