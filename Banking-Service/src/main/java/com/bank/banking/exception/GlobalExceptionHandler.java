package com.bank.banking.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ==========================================
    // RESOURCE NOT FOUND - 404
    // ==========================================

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleResourceNotFound(
            ResourceNotFoundException ex) {

        Map<String, String> response = new HashMap<>();

        response.put("error", "Resource Not Found");
        response.put("message", ex.getMessage());

        return new ResponseEntity<>(
                response,
                HttpStatus.NOT_FOUND
        );
    }

    // ==========================================
    // VALIDATION ERRORS - 400
    // ==========================================

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        return new ResponseEntity<>(
                errors,
                HttpStatus.BAD_REQUEST
        );
    }

    // ==========================================
    // DATABASE CONSTRAINT - 409
    // ==========================================

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>>
            handleDataIntegrityViolation(
                    DataIntegrityViolationException ex) {

        Map<String, String> response = new HashMap<>();

        response.put(
                "error",
                "Data Integrity Violation"
        );

        response.put(
                "message",
                "The requested operation violates a database constraint"
        );

        return new ResponseEntity<>(
                response,
                HttpStatus.CONFLICT
        );
    }

    // ==========================================
    // BAD REQUEST - 400
    // ==========================================

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>>
            handleIllegalArgument(
                    IllegalArgumentException ex) {

        Map<String, String> response = new HashMap<>();

        response.put(
                "error",
                "Bad Request"
        );

        response.put(
                "message",
                ex.getMessage()
        );

        return new ResponseEntity<>(
                response,
                HttpStatus.BAD_REQUEST
        );
    }

    // ==========================================
    // BUSINESS RULE ERROR - 400
    // ==========================================

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>>
            handleIllegalState(
                    IllegalStateException ex) {

        Map<String, String> response = new HashMap<>();

        response.put(
                "error",
                "Bad Request"
        );

        response.put(
                "message",
                ex.getMessage()
        );

        return new ResponseEntity<>(
                response,
                HttpStatus.BAD_REQUEST
        );
    }

    // ==========================================
    // UNEXPECTED ERROR - 500
    // ==========================================

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>>
            handleGeneralException(
                    Exception ex) {

        Map<String, String> response = new HashMap<>();

        response.put(
                "error",
                "Internal Server Error"
        );

        response.put(
                "message",
                "Something went wrong"
        );

        return new ResponseEntity<>(
                response,
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}