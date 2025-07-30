import CryptoJS from 'crypto-js';

const SECRET_KEY = 'the-secret-key';

export function encrypt(text) {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

export function decrypt(ciphertext) {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
        return '';
    }
}
