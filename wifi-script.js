function generateQRCode() {
  const ssid = document.getElementById("ssid").value.trim();
  const password = document.getElementById("password").value.trim();
  const qrContainer = document.getElementById("qrcode");
  const downloadBtn = document.getElementById("downloadBtn");
  const copyBtn = document.getElementById("copyBtn");

  // If either field is empty, clear the preview and hide the buttons.
  if (!ssid || !password) {
    qrContainer.innerHTML = "";
    downloadBtn.style.display = "none";
    copyBtn.style.display = "none";
    return;
  }

  // Clear previous QR code.
  qrContainer.innerHTML = "";

  // WiFi QR code format: WIFI:S:<SSID>;T:WPA;P:<PASSWORD>;;
  const wifiQRData = `WIFI:S:${ssid};T:WPA;P:${password};;`;

  new QRCode(qrContainer, {
    text: wifiQRData,
    width: 150,
    height: 150,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  // Update the download link after the QR code has been rendered.
  setTimeout(() => {
    const qrImage = qrContainer.querySelector("img");
    if (qrImage) {
      downloadBtn.href = qrImage.src;
      // Name the downloaded file after the SSID.
      downloadBtn.download = ssid + ".png";
      downloadBtn.style.display = "inline-block";
      copyBtn.style.display = "inline-block";
    }
  }, 500);
}

async function copyQRCode() {
  const qrContainer = document.getElementById("qrcode");
  const qrImage = qrContainer.querySelector("img");
  if (qrImage) {
    const dataUrl = qrImage.src;
    try {
      // Convert the data URL to a blob.
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      // Copy the blob as an image to the clipboard.
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      // alert("QR Code image copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy QR code: ", err);
      // alert("Failed to copy QR code.");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Attach input event listeners to update the QR code live.
  document.getElementById("ssid").addEventListener("input", generateQRCode);
  document.getElementById("password").addEventListener("input", generateQRCode);
});
