//changing the number of alerts and their values

// fetching the security data from the backend API
async function loadData() {
    //collecting data from security events table
    const alertsResponse = await fetch("http://127.0.0.1:8003/alerts");
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
    const ipResponse = await fetch("http://127.0.0.1:8003/IP-addresses");
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
    const alertsList = document.getElementById("alert-summary-list");

    eventsList.innerHTML = alerts.map((event) => `
        <div class="security-event-row">
            <div class="security-event-heading">
                <span class="security-event-type">${event.event_type}</span>
                <span class="security-event-severity ${event.severity.toLowerCase()}">${event.severity}</span>
            </div>
            <div class="security-event-details">
                <span>${event.source_ip}</span>
                <time>${event.created_at}</time>
            </div>
        </div>
    `).join("");

    const priorityAlerts = alerts
        .filter((alert) => alert.severity === "Critical" || alert.severity === "High")
        .sort((firstAlert, secondAlert) => (
            new Date(secondAlert.created_at) - new Date(firstAlert.created_at)
        ));
    let alertOffset = 0;

    const renderAlertSummary = () => {
        if (priorityAlerts.length === 0) {
            alertsList.innerHTML = "<p>No Critical or High alerts recorded.</p>";
            return;
        }

        const visibleAlerts = priorityAlerts.slice(alertOffset, alertOffset + 3);
        if (visibleAlerts.length < 3 && priorityAlerts.length > 3) {
            visibleAlerts.push(...priorityAlerts.slice(0, 3 - visibleAlerts.length));
        }

        alertsList.innerHTML = visibleAlerts.map((alert) => `
            <div class="alert-log-row">
                <div>
                    <strong>${alert.event_type}</strong>
                    <span>${alert.source_ip}</span>
                </div>
                <div class="alert-log-meta">
                    <span class="security-event-severity ${alert.severity.toLowerCase()}">${alert.severity}</span>
                    <time>${alert.created_at}</time>
                </div>
            </div>
        `).join("");

        alertOffset = (alertOffset + 1) % priorityAlerts.length;
    };

    renderAlertSummary();
    clearInterval(window.alertSummaryRotation);
    window.alertSummaryRotation = priorityAlerts.length > 3
        ? setInterval(renderAlertSummary, 4000)
        : undefined;
}
//displaying data for from the ip table
function showIps(ips) {
    const ipList = document.getElementById("top-attacking-ips-list");
    const highestAttackCount = ips[0]?.attack_count ?? 1;

    ipList.innerHTML = ips.map((ip, index) => `
        <div class="attacking-ip-row">
            <span class="attacking-ip-rank">${index + 1}</span>
            <span class="attacking-ip-address">${ip.ip_address}</span>
            <span class="attacking-ip-count">${ip.attack_count}</span>
            <span class="attacking-ip-bar" style="--attack-width: ${(ip.attack_count / highestAttackCount) * 100}%"></span>
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


