package com.talksy.backend.service;

import com.cloudinary.Cloudinary;

import com.cloudinary.utils.ObjectUtils;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary
            cloudinary;

    // ===============================
    // 🔥 DELETE FILE
    // ===============================
    public void deleteFile(

            String publicId,

            String resourceType
    ) {

        try {

            if (

                    publicId == null ||

                            publicId.isBlank()

            ) {

                return;
            }

            cloudinary
                    .uploader()
                    .destroy(

                            publicId,

                            ObjectUtils.asMap(

                                    "resource_type",

                                    resourceType
                            )
                    );

        } catch (Exception e) {

            e.printStackTrace();
        }
    }

    // ===============================
    // 🔥 EXTRACT PUBLIC ID
    // ===============================
    public String extractPublicId(
            String url
    ) {

        try {

            if (

                    url == null ||

                            url.isBlank()

            ) {

                return null;
            }

            String[] parts =
                    url.split("/upload/");

            if (parts.length < 2) {

                return null;
            }

            String path =
                    parts[1];

            path =
                    path.replaceAll(
                            "^v\\d+/",
                            ""
                    );

            int dotIndex =
                    path.lastIndexOf(".");

            if (dotIndex != -1) {

                path =
                        path.substring(
                                0,
                                dotIndex
                        );
            }

            return path;

        } catch (Exception e) {

            return null;
        }
    }
}