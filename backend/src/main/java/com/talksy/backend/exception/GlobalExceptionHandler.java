package com.talksy.backend.exception;

import com.talksy.backend.payload.ApiResponse;

import org.springframework.dao.DataIntegrityViolationException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ===============================
    // 🔴 DTO VALIDATION
    // ===============================
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<?>>
    handleValidation(
            MethodArgumentNotValidException ex
    ) {

        String message = ex
                .getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(err ->
                        err.getDefaultMessage()
                )
                .orElse(
                        "Validation error ❌"
                );

        ApiResponse<?> response =
                new ApiResponse<>(

                        false,
                        message,
                        null
                );

        return new ResponseEntity<>(
                response,
                HttpStatus.BAD_REQUEST
        );
    }

    // ===============================
    // 🔴 RUNTIME
    // ===============================
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<?>>
    handleRuntime(
            RuntimeException ex
    ) {

        ex.printStackTrace();

        ApiResponse<?> response =
                new ApiResponse<>(

                        false,
                        ex.getMessage(),
                        null
                );

        return new ResponseEntity<>(
                response,
                HttpStatus.BAD_REQUEST
        );
    }

    // ===============================
    // 🔴 DATABASE
    // ===============================
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<?>>
    handleDuplicate(
            DataIntegrityViolationException ex
    ) {

        ex.printStackTrace();

        String message =
                ex.getMostSpecificCause()
                        .getMessage();

        ApiResponse<?> response =
                new ApiResponse<>(

                        false,
                        message,
                        null
                );

        return new ResponseEntity<>(
                response,
                HttpStatus.BAD_REQUEST
        );
    }

    // ===============================
    // 🔴 GENERIC
    // ===============================
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>>
    handleGeneric(
            Exception ex
    ) {

        ex.printStackTrace();

        ApiResponse<?> response =
                new ApiResponse<>(

                        false,
                        "Something went wrong ❌",
                        null
                );

        return new ResponseEntity<>(
                response,
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}