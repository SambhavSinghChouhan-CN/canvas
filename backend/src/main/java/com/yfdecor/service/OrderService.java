
package com.yfdecor.service;

import com.yfdecor.dto.request.OrderRequest;
import com.yfdecor.dto.response.AddressResponse;
import com.yfdecor.dto.response.OrderItemResponse;
import com.yfdecor.dto.response.OrderResponse;
import com.yfdecor.model.*;
import com.yfdecor.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

	private final OrderRepository orderRepository;
	private final CartItemRepository cartItemRepository;
	private final ProductRepository productRepository;
	private final AddressRepository addressRepository;

	@Transactional
	public OrderResponse placeOrder(User user, OrderRequest request) {
		List<CartItem> cartItems = cartItemRepository.findByUser(user);
		if (cartItems.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart is empty");
		}
		Address address = addressRepository.findByIdAndUser(request.getAddressId(), user)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found"));

		double total = 0;
		List<OrderItem> orderItems = new ArrayList<>();
		for (CartItem cartItem : cartItems) {
			Product product = productRepository.findById(cartItem.getProduct().getId())
					.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
			if (cartItem.getQuantity() > product.getStock()) {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not enough stock for " + product.getName());
			}
			double price = product.getPrice();
			total += price * cartItem.getQuantity();
			orderItems.add(OrderItem.builder()
					.product(product)
					.quantity(cartItem.getQuantity())
					.price(price)
					.build());
		}

		double deliveryCharge = total >= 999 ? 0 : 99;
		String orderNumber = generateOrderNumber();

		Order order = Order.builder()
				.user(user)
				.orderNumber(orderNumber)
				.totalAmount(total)
				.deliveryCharge(deliveryCharge)
				.status("pending")
				.createdAt(LocalDateTime.now())
				.address(address)
				.items(new ArrayList<>())
				.build();
		order = orderRepository.save(order);

		for (OrderItem item : orderItems) {
			item.setOrder(order);
			productRepository.findById(item.getProduct().getId()).ifPresent(p -> {
				p.setStock(p.getStock() - item.getQuantity());
				productRepository.save(p);
			});
		}
		order.getItems().addAll(orderItems);
		order = orderRepository.save(order);

		cartItemRepository.deleteByUser(user);

		return toResponse(order);
	}

	public List<OrderResponse> getOrders(User user) {
		return orderRepository.findByUser(user).stream()
				.map(this::toResponse)
				.collect(Collectors.toList());
	}

	public OrderResponse getOrderById(User user, Long id) {
		Order order = orderRepository.findByIdAndUser(id, user)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
		return toResponse(order);
	}

	public OrderResponse getOrder(User user, Long id) {
		return getOrderById(user, id);
	}

	public OrderResponse updateOrderStatus(User user, Long id, String status) {
		Order order = orderRepository.findByIdAndUser(id, user)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
		order.setStatus(status);
		order = orderRepository.save(order);
		return toResponse(order);
	}

	private String generateOrderNumber() {
		String base36 = Long.toString(System.currentTimeMillis(), 36).toUpperCase();
		String random = randomAlphaNumeric(3);
		return "YF" + base36 + random;
	}

	private String randomAlphaNumeric(int count) {
		String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		Random rnd = new Random();
		StringBuilder sb = new StringBuilder(count);
		for (int i = 0; i < count; i++) {
			sb.append(chars.charAt(rnd.nextInt(chars.length())));
		}
		return sb.toString();
	}

	private OrderResponse toResponse(Order order) {
		return OrderResponse.builder()
				.id(order.getId())
				.orderNumber(order.getOrderNumber())
				.totalAmount(order.getTotalAmount())
				.deliveryCharge(order.getDeliveryCharge())
				.status(order.getStatus())
				.createdAt(order.getCreatedAt())
				.items(order.getItems().stream().map(this::toItemResponse).collect(Collectors.toList()))
				.address(AddressResponse.builder()
						.id(order.getAddress().getId())
						.name(order.getAddress().getName())
						.phone(order.getAddress().getPhone())
						.addressLine1(order.getAddress().getAddressLine1())
						.addressLine2(order.getAddress().getAddressLine2())
						.city(order.getAddress().getCity())
						.state(order.getAddress().getState())
						.country(order.getAddress().getCountry())
						.zipCode(order.getAddress().getZipCode())
						.isDefault(order.getAddress().getIsDefault())
						.build())
				.build();
	}

	private OrderItemResponse toItemResponse(OrderItem item) {
		return OrderItemResponse.builder()
				.id(item.getId())
				.product(null) // Optionally map product
				.quantity(item.getQuantity())
				.price(item.getPrice())
				.build();
	}
}
