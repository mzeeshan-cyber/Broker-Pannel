// tokenUtils.js
import CryptoJS from "crypto-js";

const secret = import.meta.env.VITE_REACT_APP_SECRET_KEY;

// Encrypt the token
export function encryptToken(token) {
  if (!secret) {
    console.error("Secret key not found in environment variables.");
    return null;
  }  
  return CryptoJS.AES.encrypt(token, secret).toString();
}

// Decrypt the token
export function decryptToken(encryptedToken) {
  if (!secret) {
    console.error("Secret key not found in environment variables.");
    return null;
  }
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, secret);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error("Failed to decrypt token:", err);
    return null;
  }
}
