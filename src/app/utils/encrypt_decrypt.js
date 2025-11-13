export function encrypt(text, key = "chess") {
  if (text === "" || text === null || text === undefined) return undefined;
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const keyChar = key.charCodeAt(i % key.length);
    // Convert to hex and remove '0x' prefix
    result += (charCode ^ keyChar).toString(16).padStart(2, "0");
  }
  return result;
}

export function decrypt(text, key = "chess") {
  if (text === "" || text === null || text === undefined) return undefined;

  let result = "";
  for (let i = 0; i < text.length; i += 2) {
    // Convert hex back to number
    const charCode = parseInt(text.substr(i, 2), 16);
    const keyChar = key.charCodeAt((i / 2) % key.length);
    result += String.fromCharCode(charCode ^ keyChar);
  }
  return result;
}

export function encryptBackendData(text, key = "hellocpd") {
  let encryptedText = "";
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const keyChar = key.charCodeAt(i % key.length);
    const encryptedChar = String.fromCharCode(charCode ^ keyChar);
    encryptedText += encryptedChar;
  }
  return base64Encode(encryptedText);
}

const base64Encode = (value) => {
  const utf8Value = encodeURIComponent(value).replace(
    /%([0-9A-F]{2})/g,
    (_, hex) => String.fromCharCode(parseInt(hex, 16))
  );
  return btoa(utf8Value);
};
