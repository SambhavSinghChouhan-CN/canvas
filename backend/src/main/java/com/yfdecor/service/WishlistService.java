
package com.yfdecor.service;

import com.yfdecor.dto.response.ProductResponse;
import com.yfdecor.dto.response.WishlistItemResponse;
import com.yfdecor.model.Product;
import com.yfdecor.model.User;
import com.yfdecor.model.WishlistItem;
import com.yfdecor.repository.ProductRepository;
import com.yfdecor.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

	private final WishlistRepository wishlistRepository;
	private final ProductRepository productRepository;

	public List<WishlistItemResponse> getWishlist(User user) {
		return wishlistRepository.findByUser(user).stream()
				.map(this::toResponse)
				.collect(Collectors.toList());
	}

	public WishlistItemResponse addToWishlist(User user, Long productId) {
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
		Optional<WishlistItem> existing = wishlistRepository.findByUserAndProduct(user, product);
		if (existing.isPresent()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product already in wishlist");
		}
		WishlistItem item = WishlistItem.builder().user(user).product(product).build();
		WishlistItem saved = wishlistRepository.save(item);
		return toResponse(saved);
	}

	public void removeFromWishlist(User user, Long productId) {
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
		wishlistRepository.deleteByUserAndProduct(user, product);
	}

	private WishlistItemResponse toResponse(WishlistItem item) {
		return WishlistItemResponse.builder()
				.id(item.getId())
				.product(ProductResponse.builder()
						.id(item.getProduct().getId())
						.name(item.getProduct().getName())
						.slug(item.getProduct().getSlug())
						.description(item.getProduct().getDescription())
						.imageUrl(item.getProduct().getImageUrl())
						.stock(item.getProduct().getStock())
						.price(item.getProduct().getPrice())
						.discount(item.getProduct().getDiscount())
						.category(null) // Optionally map category
						.build())
				.build();
	}
}
