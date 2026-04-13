"use strict";
// confirmationScript.ts
console.log("CONFIRMATION SCRIPT LOADED");
document.addEventListener('DOMContentLoaded', () => {
    // Retrieve data from sessionStorage
    const storedUserData = sessionStorage.getItem('userData');
    if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        const nameElement = document.getElementById('name');
        if (nameElement)
            nameElement.textContent = `${userData.firstName} ${userData.lastName}`;
        const phoneElement = document.getElementById('phone');
        if (phoneElement)
            phoneElement.textContent = `${userData.phone}`;
    }
    const storedVehicleData = sessionStorage.getItem('vehicleData');
    if (storedVehicleData) {
        const vehicleData = JSON.parse(storedVehicleData);
        const vehicleMakeElement = document.getElementById('vehicleMake');
        if (vehicleMakeElement)
            vehicleMakeElement.textContent = vehicleData.make;
        const vehicleTypeElement = document.getElementById('vehicleType');
        if (vehicleTypeElement)
            vehicleTypeElement.textContent = vehicleData.type;
        const vehicleColorElement = document.getElementById('vehicleColor');
        if (vehicleColorElement)
            vehicleColorElement.textContent = vehicleData.color;
        const vehicleYearElement = document.getElementById('vehicleYear');
        if (vehicleYearElement)
            vehicleYearElement.textContent = vehicleData.year;
    }
    const storedSelectedServices = sessionStorage.getItem('selectedServices');
    if (storedSelectedServices) {
        const selectedServices = JSON.parse(storedSelectedServices);
        const servicesElement = document.getElementById('services');
        if (servicesElement)
            servicesElement.textContent = selectedServices.join(', ');
    }
    const storedAppointmentData = sessionStorage.getItem('appointmentData');
    if (storedAppointmentData) {
        const appointmentData = JSON.parse(storedAppointmentData);
        const dateElement = document.getElementById('date');
        if (dateElement)
            dateElement.textContent = `${appointmentData.dayOfWeek}, ${appointmentData.month} ${appointmentData.day}`;
        const timeElement = document.getElementById('time');
        if (timeElement)
            timeElement.textContent = appointmentData.time;
    }
    // Attach finish button
    const finishBtn = document.getElementById("finishBtn");
    if (finishBtn)
        finishBtn.addEventListener("click", finish);
});
/**
 * RESTORED ORIGINAL FINISH FUNCTION
 * Collects confirmation data, validates, posts to /api/appointments,
 * clears sessionStorage on success, and shows user feedback.
 */
async function finish() {
    console.log("FINISH FUNCTION FIRED");
    const getText = (id) => {
        const el = document.getElementById(id);
        if (!el)
            return "";
        if ("value" in el)
            return el.value.trim();
        return (el.textContent || "").trim();
    };
    const user = (() => {
        try {
            return JSON.parse(sessionStorage.getItem("userData") || "{}");
        }
        catch {
            return {};
        }
    })();
    const vehicle = (() => {
        try {
            return JSON.parse(sessionStorage.getItem("vehicleData") || "{}");
        }
        catch {
            return {};
        }
    })();
    const appointment = (() => {
        try {
            return JSON.parse(sessionStorage.getItem("appointmentData") || "{}");
        }
        catch {
            return {};
        }
    })();
    const servicesArr = (() => {
        try {
            return JSON.parse(sessionStorage.getItem("selectedServices") || "[]");
        }
        catch {
            return [];
        }
    })();
    // Build AppointmentDate
    let appointmentDateStr = "";
    let appointmentTimeStr = "";
    if (appointment.appointmentDate) {
        appointmentDateStr = String(appointment.appointmentDate).trim();
    }
    else if (appointment.date) {
        appointmentDateStr = String(appointment.date).trim();
    }
    else if (appointment.month && appointment.day) {
        const monthNames = {
            january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
            july: 7, august: 8, september: 9, october: 10, november: 11, december: 12
        };
        const m = String(appointment.month).trim();
        let monthNum = /^\d+$/.test(m) ? Number(m) : monthNames[m.toLowerCase()] || NaN;
        const year = appointment.year ? Number(appointment.year) : new Date().getFullYear();
        if (!Number.isNaN(monthNum)) {
            const mm = String(monthNum).padStart(2, "0");
            const dd = String(appointment.day).padStart(2, "0");
            appointmentDateStr = `${year}-${mm}-${dd}`;
        }
        else {
            appointmentDateStr = `${appointment.dayOfWeek ? appointment.dayOfWeek + ", " : ""}${appointment.month} ${appointment.day}`;
        }
    }
    // Time
    if (appointment.time) {
        appointmentTimeStr = String(appointment.time).trim();
    }
    else {
        appointmentTimeStr = getText("time") || "";
    }
    const payload = {
        FirstName: getText("name") || user.firstName || "",
        LastName: user.lastName || "",
        Phone: getText("phone") || user.phone || "",
        Email: user.email || "",
        CarMake: vehicle.make || "",
        CarType: vehicle.type || "",
        CarColor: vehicle.color || "",
        CarYear: vehicle.year || "",
        ServiceType: Array.isArray(servicesArr) ? servicesArr.join(", ") : "",
        AppointmentDate: appointmentDateStr,
        Time: appointmentTimeStr
    };
    if (appointmentDateStr && appointmentTimeStr) {
        const parsed = new Date(`${appointmentDateStr} ${appointmentTimeStr}`);
        if (!isNaN(parsed.getTime()))
            payload["AppointmentISO"] = parsed.toISOString();
    }
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
            sessionStorage.removeItem("userData");
            sessionStorage.removeItem("vehicleData");
            sessionStorage.removeItem("selectedServices");
            sessionStorage.removeItem("appointmentData");
            alert("Form submitted successfully!");
        }
        else {
            console.error("Server returned error", res.status, body);
            alert("Failed to save appointment. Please try again.");
        }
    }
    catch (err) {
        console.error("Network or JS error", err);
        alert("Network error. Please check your connection and try again.");
    }
}
// Expose globally
// @ts-ignore
window.finish = finish;
