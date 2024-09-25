chrome.storage.sync.get(["redirectRules"], function (result) {
  if (result.redirectRules) {
    monitorInternalNavigation(result.redirectRules);
  }
});
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync" && changes.redirectRules) {
    monitorInternalNavigation(changes.redirectRules.newValue);
  }
});
function monitorInternalNavigation(redirectRules) {
  const checkAndRedirect = () => {
    const currentUrl = window.location.href;
    redirectRules.forEach((rule) => {
      if (currentUrl.startsWith(rule.from.substring(0, rule.from.length - 2))) {
        window.location.href = rule.to;
        console.log("asd");
      }
    });
  };
  let lastUrl = location.href;
  new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      checkAndRedirect();
    }
  }).observe(document, { subtree: true, childList: true });
  checkAndRedirect();
}
