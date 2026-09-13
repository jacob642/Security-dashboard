//changing the number of alerts and their values

// fetching the security data from the backend API
async function loadData() {
    //collecting data from security events table
    const alertsResponse = await fetch ("http://127.0.0.1:8003/alerts");
    const alerts = await alertsResponse.json();
    // counting the each severity tag
    const severityCount = {
        Critical: 0,
        High: 0,
        Medium: 0,
        Low: 0,        
    };
   alerts.forEach((event) => {
    severityCount[event.severity]++;
});
    showSeverityCounts(severityCount);
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

function showSeverityCounts(severityCount) {
    document.getElementById("critical-count").textContent = severityCount.Critical;
    document.getElementById("high-count").textContent = severityCount.High;
    document.getElementById("medium-count").textContent = severityCount.Medium;
    document.getElementById("low-count").textContent = severityCount.Low;
}

loadData();


