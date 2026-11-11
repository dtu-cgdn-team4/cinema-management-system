package com.cgdn.cinema.exception;

import lombok.Getter;

import java.util.Map;

@Getter
public class BusinessException extends RuntimeException {
    private final int code;
    private final Map<String, String> errors;

    public BusinessException(String message) {
        super(message);
        this.code = 400;
        this.errors = null;
    }

    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
        this.errors = null;
    }

    public BusinessException(int code, String message, Map<String, String> errors) {
        super(message);
        this.code = code;
        this.errors = errors;
    }
}
