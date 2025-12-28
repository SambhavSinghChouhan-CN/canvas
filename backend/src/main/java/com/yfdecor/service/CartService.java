
package com.yfdecor.service;

import com.yfdecor.dto.request.CartItemRequest;
import com.yfdecor.dto.response.CartItemResponse;
import com.yfdecor.dto.response.ProductResponse;
import com.yfdecor.model.CartItem;
import com.yfdecor.model.Product;
import com.yfdecor.model.User;
import com.yfdecor.repository.CartItemRepository;
import com.yfdecor.repository.ProductRepository;
import com.yfdecor.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

	private final CartItemRepository cartItemRepository;
	private final ProductRepository productRepository;

	/* ===================== GET CART ===================== */
	public List<CartItemResponse> getCart(Long id) {
		return cartItemRepository.findById(id)
				.stream()
				.map(this::toResponse)
				.collect(Collectors.toList());
	}

	/* ===================== ADD TO CART ===================== */
	public CartItemResponse addToCart(User user, CartItemRequest request) {

		if (request.getQuantity() <= 0) {
			throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST, "Quantity must be greater than zero");
		}

		Product product = productRepository.findById(request.getProductId())
				.orElseThrow(() -> new ResponseStatusException(
						HttpStatus.NOT_FOUND, "Product not found"));

		CartItem item = cartItemRepository
				.findByUserAndProduct(user, product)
				.orElse(CartItem.builder()
						.user(user)
						.product(product)
						.quantity(0)
						.build());

		int newQuantity = item.getQuantity() + request.getQuantity();

		if (newQuantity > product.getStock()) {
			throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST, "Not enough stock");
		}

		item.setQuantity(newQuantity);
		return toResponse(cartItemRepository.save(item));
	}

	/* ===================== UPDATE CART ITEM ===================== */
	public CartItemResponse updateCartItem(User user, Long cartItemId, CartItemRequest request) {

		if (request.getQuantity() <= 0) {
			throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST, "Quantity must be greater than zero");
		}

		CartItem item = cartItemRepository.findById(cartItemId)
				.orElseThrow(() -> new ResponseStatusException(
						HttpStatus.NOT_FOUND, "Cart item not found"));

		if (!item.getUser().getId().equals(user.getId())) {
			throw new ResponseStatusException(
					HttpStatus.FORBIDDEN, "Not your cart item");
		}

		Product product = item.getProduct();

		if (request.getQuantity() > product.getStock()) {
			throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST, "Not enough stock");
		}

		item.setQuantity(request.getQuantity());
		return toResponse(cartItemRepository.save(item));
	}

	/* ===================== REMOVE CART ITEM ===================== */
	public void removeCartItem(User user, Long cartItemId) {

		CartItem item = cartItemRepository.findById(cartItemId)
				.orElseThrow(() -> new ResponseStatusException(
						HttpStatus.NOT_FOUND, "Cart item not found"));

		if (!item.getUser().getId().equals(user.getId())) {
			throw new ResponseStatusException(
					HttpStatus.FORBIDDEN, "Not your cart item");
		}

		cartItemRepository.delete(item);
	}

	/* ===================== CLEAR CART ===================== */
	public void clearCart(User user) {
		cartItemRepository.deleteByUser(user);
	}

	/* ===================== MERGE GUEST CART ===================== */
	public void mergeCart(User user, List<CartItemRequest> guestCart) {

		for (CartItemRequest req : guestCart) {

			if (req.getQuantity() <= 0) continue;

			Product product = productRepository.findById(req.getProductId())
					.orElse(null);
			if (product == null || product.getStock() <= 0) continue;

			CartItem item = cartItemRepository
					.findByUserAndProduct(user, product)
					.orElse(CartItem.builder()
							.user(user)
							.product(product)
							.quantity(0)
							.build());

			int newQuantity = Math.min(
					product.getStock(),
					item.getQuantity() + req.getQuantity()
			);

			item.setQuantity(newQuantity);
			cartItemRepository.save(item);
		}
	}

	/* ===================== MAPPER ===================== */
	private CartItemResponse toResponse(CartItem item) {
		Product p = item.getProduct();

		return CartItemResponse.builder()
				.id(item.getId())
				.quantity(item.getQuantity())
				.product(ProductResponse.builder()
						.id(p.getId())
						.name(p.getName())
						.slug(p.getSlug())
						.description(p.getDescription())
						.imageUrl(p.getImageUrl())
						.stock(p.getStock())
						.price(p.getPrice())
						.discount(p.getDiscount())
						.build())
				.build();
	}
}
