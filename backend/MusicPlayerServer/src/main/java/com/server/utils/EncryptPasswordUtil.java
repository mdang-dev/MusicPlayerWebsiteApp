package com.server.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class EncryptPasswordUtil {

   static PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    public static String encryptPassword(String password){
        return passwordEncoder.encode(password);
    }

    public static boolean isMatchesPassword(String password, String storePassword){
        return passwordEncoder.matches(password, storePassword);
    }

}
