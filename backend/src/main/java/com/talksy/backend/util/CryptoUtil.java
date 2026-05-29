package com.talksy.backend.util;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Component
public class CryptoUtil {

    private static String KEY;
    private static final String ALGO = "AES";

    @Value("${aes.secret.key}")
    private String envKey;

    @PostConstruct
    public void init() {
        KEY = envKey;
    }

    public static String encrypt(String data) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(KEY.getBytes(), ALGO);
            Cipher cipher = Cipher.getInstance(ALGO);

            cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            byte[] encrypted = cipher.doFinal(data.getBytes());

            return Base64.getEncoder().encodeToString(encrypted);

        } catch (Exception e) {
            throw new RuntimeException("Encryption failed");
        }
    }

    public static String decrypt(String data) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(KEY.getBytes(), ALGO);
            Cipher cipher = Cipher.getInstance(ALGO);

            cipher.init(Cipher.DECRYPT_MODE, keySpec);
            byte[] decoded = Base64.getDecoder().decode(data);

            return new String(cipher.doFinal(decoded));

        } catch (Exception e) {
            throw new RuntimeException("Decryption failed");
        }
    }
}