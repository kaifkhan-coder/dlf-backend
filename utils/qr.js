import QRCode from "qrcode";

export const generateQR = async (itemId) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  return await QRCode.toDataURL(`${frontendUrl}/claim/${itemId}`);
};

export const generateQRCode = async (itemId) => {
  try {
    const qrDataUrl = await generateQR(itemId);
    return qrDataUrl;
  } catch (err) {
    console.error("QR code generation error:", err);
    throw new Error("Failed to generate QR code");
  }
};

export default generateQRCode;
