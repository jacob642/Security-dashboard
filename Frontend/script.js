//changing the number of alerts and their values

// keeping the severity totals in local variables
let criticalCount = 0;
let highCount = 0;
let mediumCount = 0;
let lowCount = 0;

// update the values displayed in the summary panel
function updateSeverityCounts() {
    const criticalEl = document.getElementById("critical-count");
    const highEl = document.getElementById("high-count");
    const mediumEl = document.getElementById("medium-count");
    const lowEl = document.getElementById("low-count");

    if (criticalEl) criticalEl.textContent = criticalCount;
    if (highEl) highEl.textContent = highCount;
    if (mediumEl) mediumEl.textContent = mediumCount;
    if (lowEl) lowEl.textContent = lowCount;
}

// function to call when a new alert is created
function increaseAlertCount(severity) {
    if (severity === "Critical") {
        criticalCount++;
    } else if (severity === "High") {
        highCount++;
    } else if (severity === "Medium") {
        mediumCount++;
    } else if (severity === "Low") {
        lowCount++;
    }

    updateSeverityCounts();
}

