
package com.yfdecor.controller;

import com.yfdecor.dto.GenericResponse;
import com.yfdecor.dto.request.AuthRequest;
import com.yfdecor.dto.request.RegisterRequest;
import com.yfdecor.dto.response.AuthResponse;
import com.yfdecor.dto.response.UserResponse;
import com.yfdecor.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;

	@PostMapping("/register")
	public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
		return ResponseEntity.ok(authService.register(request));
	}

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
		return ResponseEntity.ok(authService.login(request));
	}


	@PostMapping("/logout")
	public ResponseEntity<Void> logout() {
		// JWT is stateless; logout is handled on frontend by deleting token
		return ResponseEntity.ok().build();
	}
	@PostMapping("/encode/{password}")
	public ResponseEntity<GenericResponse<String>> encodedPassword(@PathVariable String password){
		return new ResponseEntity<>(
				GenericResponse.<String>builder()
						.error(false)
						.message("Welcome")
						.data(authService.encodedPassword(password))
						.build(),
				HttpStatus.OK);
	}
}
