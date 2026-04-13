package com.example.exception;

import java.time.LocalDateTime;
import java.util.Map;

public class ErrorResponse {

    public int status;
    public String message;
    public LocalDateTime timestamp;
    public Map<String, String> errors;

    public ErrorResponse(int status, String message) {
        this.status = status;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    public ErrorResponse(int status, String message, Map<String, String> errors) {
        this.status = status;
        this.message = message;
        this.timestamp = LocalDateTime.now();
        this.errors = errors;
    }
}
