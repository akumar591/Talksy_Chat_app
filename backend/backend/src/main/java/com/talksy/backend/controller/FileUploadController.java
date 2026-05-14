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

    // ===============================
    // 📁 BASE DIRECTORY
    // ===============================
    private static final String
            BASE_DIR = "uploads/";

    // ===============================
    // 🔥 MAX FILE SIZE
    // ===============================
    private static final long
            MAX_IMAGE_SIZE =
            10 * 1024 * 1024; // 10MB

    private static final long
            MAX_VIDEO_SIZE =
            100 * 1024 * 1024; // 100MB

    // ===============================
    // 🔥 UPLOAD FILE
    // ===============================
    @PostMapping("/upload")
    public ResponseEntity<?> upload(

            @RequestParam("file")
            MultipartFile file,

            @RequestParam("type")
            String type
    ) {

        try {

            // ===============================
            // ❌ EMPTY FILE
            // ===============================
            if (

                    file == null ||

                            file.isEmpty()

            ) {

                return bad(
                        "File is empty ❌"
                );
            }

            // ===============================
            // 🔥 MIME TYPE
            // ===============================
            String contentType =
                    file.getContentType();

            if (contentType == null) {

                return bad(
                        "Invalid file type ❌"
                );
            }

            boolean isImage =
                    contentType.startsWith(
                            "image/"
                    );

            boolean isVideo =
                    contentType.startsWith(
                            "video/"
                    );

            // ===============================
            // ❌ ONLY IMAGE / VIDEO
            // ===============================
            if (

                    !isImage &&

                            !isVideo

            ) {

                return bad(
                        "Only image/video allowed ❌"
                );
            }

            // ===============================
            // ❌ FILE SIZE
            // ===============================
            if (

                    isImage &&

                            file.getSize()
                                    > MAX_IMAGE_SIZE

            ) {

                return bad(
                        "Image too large ❌ Max 10MB"
                );
            }

            if (

                    isVideo &&

                            file.getSize()
                                    > MAX_VIDEO_SIZE

            ) {

                return bad(
                        "Video too large ❌ Max 100MB"
                );
            }

            // ===============================
            // 🔥 FOLDER DECIDE
            // ===============================
            String folder;

            switch (
                    type.toLowerCase()
            ) {

                case "profile":

                    folder = "profile/";
                    break;

                case "chat":

                    folder = "chat/";
                    break;

                case "docs":

                    folder = "docs/";
                    break;

                // 🔥 STATUS SUPPORT
                case "status":

                    folder = "status/";
                    break;

                default:

                    return bad(
                            "Invalid type ❌ (profile/chat/docs/status)"
                    );
            }

            // ===============================
            // 📁 CREATE DIRECTORY
            // ===============================
            String basePath =
                    System.getProperty(
                            "user.dir"
                    );

            String fullDir =

                    basePath +
                            "/" +
                            BASE_DIR +
                            folder;

            File dir =
                    new File(fullDir);

            if (!dir.exists()) {

                dir.mkdirs();
            }

            // ===============================
            // 🔥 UNIQUE FILE NAME
            // ===============================
            String originalName =

                    file.getOriginalFilename();

            String safeName =

                    originalName != null

                            ?

                            originalName.replaceAll(
                                    "\\s+",
                                    "_"
                            )

                            :

                            "file";

            String fileName =

                    UUID.randomUUID()
                            +
                            "_" +
                            safeName;

            // ===============================
            // 💾 SAVE FILE
            // ===============================
            File dest =

                    new File(
                            fullDir + fileName
                    );

            file.transferTo(dest);

            // ===============================
            // 🌐 FILE URL
            // ===============================
            String url =

                    "http://localhost:8080/uploads/"
                            +
                            folder
                            +
                            fileName;

            // ===============================
            // 🔥 RESPONSE DATA
            // ===============================
            Map<String, Object>
                    data =
                    new HashMap<>();

            data.put(
                    "url",
                    url
            );

            data.put(
                    "type",

                    isVideo
                            ? "VIDEO"
                            : "IMAGE"
            );

            data.put(
                    "size",
                    file.getSize()
            );

            data.put(
                    "fileName",
                    fileName
            );

            return ok(
                    "Upload success ✅",
                    data
            );

        } catch (Exception e) {

            e.printStackTrace();

            return bad(
                    "Upload failed ❌"
            );
        }
    }

    // ===============================
    // ✅ SUCCESS RESPONSE
    // ===============================
    private ResponseEntity<?> ok(

            String msg,

            Object data
    ) {

        Map<String, Object>
                res =
                new HashMap<>();

        res.put(
                "success",
                true
        );

        res.put(
                "message",
                msg
        );

        res.put(
                "data",
                data
        );

        return ResponseEntity.ok(
                res
        );
    }

    // ===============================
    // ❌ ERROR RESPONSE
    // ===============================
    private ResponseEntity<?> bad(
            String msg
    ) {

        Map<String, Object>
                res =
                new HashMap<>();

        res.put(
                "success",
                false
        );

        res.put(
                "message",
                msg
        );

        return ResponseEntity
                .badRequest()
                .body(res);
    }
}