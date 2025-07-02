function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function showStats(data) {
  const statsContainer = document.getElementById("stats");
  const logContainer = document.getElementById("logContainer");
  statsContainer.innerHTML = "";
  logContainer.innerHTML = "";

  const today = getTodayDate();
  const todayLogs = data.visits.filter(v => v.date === today);
  const visitCount = todayLogs.filter(v => v.type === "visit").length;
  const connectCount = todayLogs.filter(v => v.type === "connect").length;

  const warning = [];
  if (visitCount >= 450) warning.push("⚠️ Reached daily visit limit (450)");
  if (connectCount >= 20) warning.push("⚠️ Reached daily connect limit (20)");

  statsContainer.innerHTML = `
    <p><strong>Today:</strong> ${today}</p>
    <p>Visits: ${visitCount} / 450</p>
    <p>Connects: ${connectCount} / 20</p>
    ${warning.length ? `<div class="warn">${warning.join("<br/>")}</div>` : ""}
    <hr/>
  `;

  // Show last 10 logs
  data.visits.slice(-10).reverse().forEach(entry => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${entry.type}</strong> at <a href="${entry.url}" target="_blank">${entry.url}</a><br/><small>${entry.time}</small>`;
    logContainer.appendChild(div);
  });
}

// Reset logs
document.getElementById("reset").addEventListener("click", () => {
  if (confirm("Clear all tracked activity logs?")) {
    chrome.storage.local.set({ visits: [] }, () => location.reload());
  }
});

// Toggle logs
document.getElementById("toggleLogs").addEventListener("click", () => {
  const logs = document.getElementById("logContainer");
  const btn = document.getElementById("toggleLogs");
  if (logs.style.display === "none") {
    logs.style.display = "block";
    btn.textContent = "Hide Logs";
  } else {
    logs.style.display = "none";
    btn.textContent = "Show Logs";
  }
});

chrome.storage.local.get({ visits: [] }, showStats);
