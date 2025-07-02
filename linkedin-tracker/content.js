(function () {
  const profileUrl = window.location.href;
  const visitTime = new Date().toISOString();
  const today = visitTime.slice(0, 10); // YYYY-MM-DD

  function logEvent(type) {
    chrome.storage.local.get({ visits: [] }, (data) => {
      const visits = data.visits;
      visits.push({ url: profileUrl, type, time: visitTime, date: today });
      chrome.storage.local.set({ visits });
    });
  }

  // Always log profile visit
  logEvent("visit");

  function handleConnectButtons() {
    // 1. Standard Connect button
    const directBtn = Array.from(document.querySelectorAll("button"))
      .find(btn => btn.innerText.trim().toLowerCase() === "connect");

    if (directBtn && !directBtn.dataset.tracked) {
      directBtn.dataset.tracked = "true";
      directBtn.addEventListener("click", () => {
        logEvent("connect");
      });
    }

    // 2. Dropdown "Connect" in More menu
    const allConnectItems = Array.from(document.querySelectorAll("*"))
      .filter(el =>
        el.innerText &&
        el.innerText.trim().toLowerCase() === "connect" &&
        !el.dataset.tracked
      );

    allConnectItems.forEach(connectEl => {
      connectEl.dataset.tracked = "true";
      connectEl.addEventListener("click", () => {
        logEvent("connect");
      });
    });
  }

  // Observe DOM changes for dynamic LinkedIn loading
  const observer = new MutationObserver(() => {
    handleConnectButtons();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Initial check
  handleConnectButtons();
})();
