package com.server.utils;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.util.Base64;

public class EncryptCode {

    private static final String SECRET_KEY = "DnM/sCce9tpcZ5Zm2JZEDw=="; // 32-byte key for AES-256

    public static String encrypt(String password) throws Exception {
        SecretKeySpec secretKey = new SecretKeySpec(SECRET_KEY.getBytes(), "AES");
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        SecureRandom secureRandom = new SecureRandom();
        byte[] iv = new byte[16];
        secureRandom.nextBytes(iv);
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, new javax.crypto.spec.IvParameterSpec(iv));
        byte[] encryptedBytes = cipher.doFinal(password.getBytes());
        String ivBase64 = Base64.getEncoder().encodeToString(iv);
        String encryptedPasswordBase64 = Base64.getEncoder().encodeToString(encryptedBytes);
        return ivBase64 + ":" + encryptedPasswordBase64;
    }

}
