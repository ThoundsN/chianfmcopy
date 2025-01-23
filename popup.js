document.getElementById("extractBtn").addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    // Execute the content script if it's not already injected
    await chrome.scripting
      .executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      })
      .catch(() => {
        // Script might already be injected, continue
      });

    // Send message to content script
    chrome.tabs.sendMessage(tab.id, { action: "extract" }, async (response) => {
      if (chrome.runtime.lastError) {
        alert("Please refresh the page and try again");
        return;
      }
      if (response && response.data) {
        displayData(response.data);
        await copyData(response.data);
      }
    });
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
  }
});

async function copyData(data) {
  const text = data
    .map(({ title, address }) => `${address}   ${title}`)
    .join("\n");

  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy:", err);
    alert("Failed to copy to clipboard");
  }
}

function displayData(data) {
  const dataDisplay = document.getElementById("dataDisplay");

  dataDisplay.innerHTML = data
    .map(
      ({ title, address }) => `
        <div class="item">
          <div class="address">${address}</div>
          <div class="title">${title}</div>
        </div>
      `
    )
    .join("");
}
