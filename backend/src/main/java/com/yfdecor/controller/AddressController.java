package com.yfdecor.controller;

import com.yfdecor.dto.request.AddressRequest;
import com.yfdecor.dto.response.AddressResponse;
import com.yfdecor.model.User;
import com.yfdecor.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {
	private final AddressService addressService;

	@GetMapping
	public ResponseEntity<List<AddressResponse>> getAddresses(@AuthenticationPrincipal User user) {
		List<AddressResponse> addresses = addressService.getAddresses(user);
		return ResponseEntity.ok(addresses);
	}

	@PostMapping
	public ResponseEntity<AddressResponse> addAddress(@AuthenticationPrincipal User user,
			@RequestBody AddressRequest request) {
		AddressResponse response = addressService.addAddress(user, request);
		return ResponseEntity.ok(response);
	}

	@PutMapping("/{id}")
	public ResponseEntity<AddressResponse> updateAddress(@AuthenticationPrincipal User user,
			@PathVariable Long id,
			@RequestBody AddressRequest request) {
		AddressResponse response = addressService.updateAddress(user, id, request);
		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteAddress(@AuthenticationPrincipal User user,
			@PathVariable Long id) {
		addressService.deleteAddress(user, id);
		return ResponseEntity.noContent().build();
	}
}
