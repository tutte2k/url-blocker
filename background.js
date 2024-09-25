chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["redirectRules"], function (result) {
    if (result.redirectRules) {
      updateRedirectRules(result.redirectRules);
    }
  });
});
function updateRedirectRules(redirectRules) {
  chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
    const ruleIds = existingRules.map((rule) => rule.id);
    chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: ruleIds });

    const rules = redirectRules.map((rule, index) => ({
      id: index + 1,
      priority: 1,
      action: {
        type: "redirect",
        redirect: { url: rule.to },
      },
      condition: {
        urlFilter: rule.from,
        isUrlFilterCaseSensitive: false,
        resourceTypes: ["main_frame"],
      },
    }));

    chrome.declarativeNetRequest.updateDynamicRules({ addRules: rules });
  });
}
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync" && changes.redirectRules) {
    updateRedirectRules(changes.redirectRules.newValue);
  }
});
