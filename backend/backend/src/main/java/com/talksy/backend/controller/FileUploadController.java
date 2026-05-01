package com.talksy.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/file")
public class FileUploadController {

    private static final String BASE_DIR = "uploads/";

    @PostMapping("/upload")
    public ResponseEntity<?> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String type
    ) {

        try {
            // ❌ file validation
            if (file == null || file.isEmpty()) {
                return bad("File is empty ❌");
            }

            // 🔥 folder decide
            String folder;

            switch (type.toLowerCase()) {
                case "profile":
                    folder = "profile/";
                    break;

                case "chat":
                    folder = "chat/";
                    break;

                case "docs":
                    folder = "docs/";
                    break;

                default:
                    return bad("Invalid type ❌ (profile/chat/docs)");
            }

            // 📁 create directory
            String basePath = System.getProperty("user.dir");
            String fullDir = basePath + "/" + BASE_DIR + folder;

            File dir = new File(fullDir);
            if (!dir.exists()) dir.mkdirs();

            // 🔥 unique file name
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            File dest = new File(fullDir + fileName);
            file.transferTo(dest);

            // 🌐 URL
            String url = "http://localhost:8080/uploads/" + folder + fileName;

            return ok("Upload success ✅", url);

        } catch (Exception e) {
            return bad("Upload failed ❌");
        }
    }

    // ===============================
    // 🔧 RESPONSE FORMAT
    // ===============================
    private ResponseEntity<?> ok(String msg, Object data) {
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", msg);
        res.put("data", data);
        return ResponseEntity.ok(res);
    }

    private ResponseEntity<?> bad(String msg) {
        Map<String, Object> res = new HashMap<>();
        res.put("success", false);
        res.put("message", msg);
        return ResponseEntity.badRequest().body(res);
    }
}