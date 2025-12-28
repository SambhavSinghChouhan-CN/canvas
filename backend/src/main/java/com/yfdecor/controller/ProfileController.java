package com.yfdecor.controller;

import com.yfdecor.dto.request.ProfileUpdateRequest;
import com.yfdecor.dto.response.ProfileResponse;
import com.yfdecor.model.User;
import com.yfdecor.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
	private final ProfileService profileService;

@GetMapping
	public ResponseEntity<ProfileResponse> getProfile(@AuthenticationPrincipal User user) {
		ProfileResponse response = profileService.getProfile(user);
		return ResponseEntity.ok(response);
	}

	@PutMapping
	public ResponseEntity<ProfileResponse> updateProfile(@AuthenticationPrincipal User user,
			@RequestBody ProfileUpdateRequest request) {
		ProfileResponse response = profileService.updateProfile(user, request);
		return ResponseEntity.ok(response);
	}
}
