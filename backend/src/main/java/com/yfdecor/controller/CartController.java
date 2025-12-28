
package com.yfdecor.controller;

import com.yfdecor.dto.request.CartItemRequest;
import com.yfdecor.dto.response.CartItemResponse;
import com.yfdecor.model.User;
import com.yfdecor.repository.UserRepository;
import com.yfdecor.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

	private final CartService cartService;
	private final UserRepository userRepository;

	@GetMapping("/{userId}")
	public ResponseEntity<List<CartItemResponse>> getCart(@PathVariable Long userId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ResponseStatusException(
						HttpStatus.NOT_FOUND, "User not found"));

		return ResponseEntity.ok(cartService.getCart(userId));
	}

	@PostMapping("/{userId}")
	public ResponseEntity<CartItemResponse> addToCart(
			@PathVariable Long userId,
			@RequestBody CartItemRequest request) {

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ResponseStatusException(
						HttpStatus.NOT_FOUND, "User not found"));

		return ResponseEntity.ok(cartService.addToCart(user, request));
	}

	@PutMapping("/{userId}/{cartItemId}")
	public ResponseEntity<CartItemResponse> updateCartItem(
			@PathVariable Long userId,
			@PathVariable Long cartItemId,
			@RequestBody CartItemRequest request) {

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ResponseStatusException(
						HttpStatus.NOT_FOUND, "User not found"));

		return ResponseEntity.ok(
				cartService.updateCartItem(user, cartItemId, request));
	}

	@DeleteMapping("/{userId}/{cartItemId}")
	public ResponseEntity<Void> removeCartItem(
			@PathVariable Long userId,
			@PathVariable Long cartItemId) {

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ResponseStatusException(
						HttpStatus.NOT_FOUND, "User not found"));

		cartService.removeCartItem(user, cartItemId);
		return ResponseEntity.noContent().build();
	}

	@DeleteMapping("/{userId}")
	public ResponseEntity<Void> clearCart(@PathVariable Long userId) {

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ResponseStatusException(
						HttpStatus.NOT_FOUND, "User not found"));

		cartService.clearCart(user);
		return ResponseEntity.noContent().build();
	}
}
