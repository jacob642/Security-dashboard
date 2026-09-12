const mockAlerts = [
	{ severity: "Critical" },
	{ severity: "High" },
	{ severity: "Critical" },
	{ severity: "Medium" },
	{ severity: "Low" },
	{ severity: "High" },
	{ severity: "Low" }
];

const mockAlertLogs = [
	{ id: "ALT-1048", message: "Repeated failed login attempts", severity: "Critical", time: "14:32:08" },
	{ id: "ALT-1047", message: "Port scan detected on public host", severity: "High", time: "14:28:41" },
	{ id: "ALT-1046", message: "Known malware signature matched", severity: "High", time: "14:21:16" },
	{ id: "ALT-1045", message: "Outbound traffic exceeded baseline", severity: "Medium", time: "14:14:52" }
];

const mockSecurityEvents = [
	{ time: "14:32:08", type: "Brute-force login attempt", source: "185.199.110.42", severity: "Critical" },
	{ time: "14:28:41", type: "Suspicious port scan", source: "198.51.100.24", severity: "High" },
	{ time: "14:21:16", type: "Malware signature detected", source: "91.240.118.16", severity: "High" },
	{ time: "14:14:52", type: "Unusual outbound traffic", source: "103.75.201.8", severity: "Medium" },
	{ time: "14:06:33", type: "Failed admin login", source: "172.104.32.77", severity: "Low" }
];

const mockAttackChart = {
	labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
	values: [12, 19, 8, 15, 22, 17, 25]
};

const mockAttackingIPs = [
	{ address: "185.199.110.42", attacks: 428 },
	{ address: "198.51.100.24", attacks: 367 },
	{ address: "91.240.118.16", attacks: 291 },
	{ address: "103.75.201.8", attacks: 214 },
	{ address: "172.104.32.77", attacks: 156 }
];

const mockEventLogs = [
	{ time: "14:32:08", action: "Alert created", actor: "Detection engine", result: "Success" },
	{ time: "14:30:17", action: "Firewall rule updated", actor: "admin@security.local", result: "Success" },
	{ time: "14:25:03", action: "Threat intelligence sync", actor: "System scheduler", result: "Success" },
	{ time: "14:18:44", action: "Endpoint isolation requested", actor: "analyst@security.local", result: "Pending" },
	{ time: "14:11:29", action: "User session revoked", actor: "Identity service", result: "Success" }
];
