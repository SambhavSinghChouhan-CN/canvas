package com.yfdecor.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(ResponseStatusException.class)
	public ResponseEntity<Map<String, Object>> handleResponseStatusException(ResponseStatusException ex) {
		Map<String, Object> body = new HashMap<>();
		body.put("error", ex.getReason());
		body.put("status", ex.getStatusCode().value());
		return ResponseEntity.status(ex.getStatusCode()).body(body);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, Object>> handleValidationException(MethodArgumentNotValidException ex) {
		Map<String, Object> body = new HashMap<>();
		body.put("error", "Validation failed");
		body.put("status", HttpStatus.BAD_REQUEST.value());
		body.put("details", ex.getBindingResult().getFieldErrors().stream()
			.map(error -> error.getField() + ": " + error.getDefaultMessage())
			.toArray());
		return ResponseEntity.badRequest().body(body);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
		Map<String, Object> body = new HashMap<>();
		body.put("error", "Internal server error");
		body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
	}
}
