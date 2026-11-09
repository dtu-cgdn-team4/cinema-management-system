package com.cgdn.cinema.exception;

import com.cgdn.cinema.modules.auth.dto.AuthDtos.Message;
import com.cgdn.cinema.modules.auth.service.AuthFailure;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(AuthFailure.class)
    public ResponseEntity<Message> handleAuth(AuthFailure ex) {
        return ResponseEntity.status(ex.status()).body(new Message(ex.getMessage()));
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Message> handleValidation(MethodArgumentNotValidException ex) {
        FieldError fe = ex.getBindingResult().getFieldError();
        String msg = fe == null ? "Dữ liệu không hợp lệ." : fe.getDefaultMessage();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Message(msg));
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Message> handleGeneral(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new Message("Hệ thống tạm thời không xử lý được yêu cầu."));
    }
}
