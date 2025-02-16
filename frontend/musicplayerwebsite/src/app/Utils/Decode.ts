import CryptoJS from 'crypto-js';
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = 'DnM/sCce9tpcZ5Zm2JZEDw==';

const decrypt = (encryptedData: string): string => {

    const [ivBase64, encryptedPasswordBase64] = encryptedData.split(':');
    const iv = CryptoJS.enc.Base64.parse(ivBase64);
    const encryptedPassword = CryptoJS.enc.Base64.parse(encryptedPasswordBase64);
    const key = CryptoJS.enc.Utf8.parse(SECRET_KEY!);
    const decryptedBytes = CryptoJS.AES.decrypt(
        encryptedPassword.toString(CryptoJS.enc.Base64),
        key,
        { iv: iv }
    );

    return decryptedBytes.toString(CryptoJS.enc.Utf8);

}
console.log(decrypt('IITllp91F5w+BqjKIGnzzQ==:M2fVSiBRMezlnvPfxvzhww=='))
export { decrypt };