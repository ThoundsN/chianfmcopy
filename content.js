chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extract") {
    const modalBody = document.querySelector("div.chakra-modal__body");

    if (!modalBody) {
      sendResponse({ error: "Modal content not found!" });
      return;
    }

    const items = modalBody.querySelectorAll(".chakra-stack > p.chakra-text");
    const extractedData = [];

    items.forEach((item) => {
      const title = item.textContent;
      const hiddenSpan = item.parentNode.querySelector(
        'span[style*="color: transparent"]'
      );
      const address = hiddenSpan ? hiddenSpan.textContent : "";

      extractedData.push({ title, address });
    });

    sendResponse({ data: extractedData });
  }
  return true; // Keep the message channel open for async response
});

async function copyToClipboard(text) {
  try {
    console.log(text);
    await navigator.clipboard.writeText(text);
    console.log("Text copied successfully");
  } catch (err) {
    console.error("Failed to copy:", err);
  }
}
