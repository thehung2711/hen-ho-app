package com.tinder.tinder.exception;

import com.tinder.tinder.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.format.DateTimeParseException;

@RestControllerAdvice
public class HandleException {
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse> handleAppException(AppException appException) {
        ErrorException errException = appException.getErrorException();
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setCode(errException.getCode());
        apiResponse.setMessage(errException.getMessage());
        return ResponseEntity.ok(apiResponse);
    }

    @ExceptionHandler(DateTimeParseException.class)
    public ResponseEntity<ApiResponse> handleDateTimeParseException(DateTimeParseException ex) {
        ErrorException errorException = ErrorException.INVALID_FORMAT_DATE;

        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setCode(errorException.getCode());
        apiResponse.setMessage(errorException.getMessage());

        return ResponseEntity.ok(apiResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleArgumentNotValidException(MethodArgumentNotValidException ex) {
        FieldError fieldError = ex.getBindingResult().getFieldErrors().get(0);

        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setCode(400);
        apiResponse.setMessage(fieldError.getDefaultMessage());
        apiResponse.setResult(null);
        return ResponseEntity.ok(apiResponse);
    }
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse> handleAccessDeniedException(AccessDeniedException ex) {
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setCode(403);
        apiResponse.setMessage(ex.getMessage());
        apiResponse.setResult(null);
        return  ResponseEntity.ok(apiResponse);
    }
}
