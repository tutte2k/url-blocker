document.getElementById("addRedirect").addEventListener("click", function () {
  let fromUrl = document.getElementById("fromInput").value.trim() + "*";
  const toUrl = document.getElementById("toInput").value.trim();

  if (fromUrl && toUrl) {
    chrome.storage.sync.get(["redirectRules"], function (result) {
      const redirectRules = result.redirectRules || [];
      redirectRules.push({ from: fromUrl, to: toUrl });
      chrome.storage.sync.set({ redirectRules: redirectRules }, function () {
        updateRedirectRulesList();
      });
    });
  }
});

function updateRedirectRulesList() {
  chrome.storage.sync.get(["redirectRules"], function (result) {
    const redirectRules = result.redirectRules || [];
    const ul = document.getElementById("redirectRules");
    ul.innerHTML = "";
    redirectRules.forEach((rule, index) => {
      const li = document.createElement("li");
      li.textContent = `${rule.from}`;

      const li2 = document.createElement("li");
      li2.textContent = `=>${rule.to}`;
      const li3 = document.createElement("li");

      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.className = "remove-btn";
      removeButton.onclick = function () {
        removeRedirectRule(index);
      };

      li3.appendChild(removeButton);
      ul.appendChild(li);
      ul.appendChild(li2);
      ul.appendChild(li3);
      ul.style.listStyleType = "none";
    });
  });
}

function removeRedirectRule(index) {
  chrome.storage.sync.get(["redirectRules"], function (result) {
    const redirectRules = result.redirectRules || [];
    redirectRules.splice(index, 1);
    chrome.storage.sync.set({ redirectRules: redirectRules }, function () {
      updateRedirectRulesList();
    });
  });
}

updateRedirectRulesList();
