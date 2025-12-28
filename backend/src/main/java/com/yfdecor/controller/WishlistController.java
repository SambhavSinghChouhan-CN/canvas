package com.yfdecor.controller;

import com.yfdecor.dto.response.WishlistItemResponse;
import com.yfdecor.model.User;
import com.yfdecor.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {
	private final WishlistService wishlistService;

	@GetMapping
	public ResponseEntity<List<WishlistItemResponse>> getWishlist(@AuthenticationPrincipal User user) {
		List<WishlistItemResponse> wishlist = wishlistService.getWishlist(user);
		return ResponseEntity.ok(wishlist);
	}

	@PostMapping("/{productId}")
	public ResponseEntity<WishlistItemResponse> addToWishlist(@AuthenticationPrincipal User user,
			@PathVariable Long productId) {
		WishlistItemResponse response = wishlistService.addToWishlist(user, productId);
		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/{productId}")
	public ResponseEntity<Void> removeFromWishlist(@AuthenticationPrincipal User user,
			@PathVariable Long productId) {
		wishlistService.removeFromWishlist(user, productId);
		return ResponseEntity.noContent().build();
	}
}
