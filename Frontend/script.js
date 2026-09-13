//changing the number of alerts and their values

// fetching the security data from the backend API
async function loadData() {
    //collecting data from security events table
    const alertsResponse = await fetch ("http://127.0.0.1:8003/alerts");
    const alerts = await alertsResponse.json();
    //collecting data from IP address table
    const ipResponse = await fetch ("http://127.0.0.1:8003/IP-addresses")
    const ips = await ipResponse.json();
    // logging the two outputs
    console.log(alerts);
    console.log(ips);
    showAlerts(alerts);
    showIps(ips);
}

//displaying data on the dashboard-loop through alerts and ips
function showAlerts(alerts) {
  const eventsList = document.getElementById("security-events-list");

eventsList.innerHTML = alerts.map((event) => `
    <div class="security-event-row">
        <strong>${event.event_type}</strong>
        <span>${event.severity}</span>
        <span>${event.source_ip}</span>
        <time>${event.created_at}</time>
    </div>
`).join("");
}
//displaying data for from the ip table
function showIps(ips) {
  const ipList = document.getElementById("top-attacking-ips-list");
ipList.innerHTML = ips.map((ip) => `
    <div class="ip-address-row">
        <span>${ip.ip_address}</span>
        <span>${ip.attack_count}</span>
    </div>
`).join(""); 
}
loadData();
    

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


