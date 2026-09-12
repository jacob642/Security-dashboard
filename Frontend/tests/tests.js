// Load this file after mockdata.js and Chart.js when demo data is needed.
mockAlerts.forEach((alert) => {
    increaseAlertCount(alert.severity);
});

const alertSummaryList = document.getElementById("alert-summary-list");
if (alertSummaryList) {
    alertSummaryList.innerHTML = mockAlertLogs.map((alert) => `
        <div class="alert-log-row">
            <div>
                <strong>${alert.id}</strong>
                <span>${alert.message}</span>
            </div>
            <div class="alert-log-meta">
                <span class="security-event-severity ${alert.severity.toLowerCase()}">${alert.severity}</span>
                <time>${alert.time}</time>
            </div>
        </div>
    `).join("");
}

const securityEventsList = document.getElementById("security-events-list");
if (securityEventsList) {
    securityEventsList.innerHTML = mockSecurityEvents.map((event) => `
        <div class="security-event-row">
            <div class="security-event-heading">
                <span class="security-event-type">${event.type}</span>
                <span class="security-event-severity ${event.severity.toLowerCase()}">${event.severity}</span>
            </div>
            <div class="security-event-details">
                <span>${event.source}</span>
                <time>${event.time}</time>
            </div>
        </div>
    `).join("");
}

const attacksChartCanvas = document.getElementById("attacks-over-time-chart");
if (attacksChartCanvas && typeof Chart !== "undefined") {
    new Chart(attacksChartCanvas, {
        type: "line",
        data: {
            labels: mockAttackChart.labels,
            datasets: [{
                label: "Attacks",
                data: mockAttackChart.values,
                borderColor: "rgb(220, 38, 38)",
                backgroundColor: "rgba(220, 38, 38, 0.2)",
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

const topIPsList = document.getElementById("top-attacking-ips-list");
if (topIPsList) {
    const highestAttackCount = mockAttackingIPs[0].attacks;

    topIPsList.innerHTML = mockAttackingIPs.map((attacker, index) => `
        <div class="attacking-ip-row">
            <span class="attacking-ip-rank">${index + 1}</span>
            <span class="attacking-ip-address">${attacker.address}</span>
            <span class="attacking-ip-count">${attacker.attacks}</span>
            <span class="attacking-ip-bar" style="--attack-width: ${(attacker.attacks / highestAttackCount) * 100}%"></span>
        </div>
    `).join("");
}

const eventLogsList = document.getElementById("event-logs-list");
if (eventLogsList) {
    eventLogsList.innerHTML = mockEventLogs.map((log) => `
        <div class="event-log-row">
            <time>${log.time}</time>
            <div>
                <strong>${log.action}</strong>
                <span>${log.actor}</span>
            </div>
            <span class="event-log-result ${log.result.toLowerCase()}">${log.result}</span>
        </div>
    `).join("");
}