package com.yfdecor.controller;

import com.yfdecor.dto.request.OrderRequest;
import com.yfdecor.dto.response.OrderResponse;
import com.yfdecor.model.User;
import com.yfdecor.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
	private final OrderService orderService;

    @PostMapping
	public ResponseEntity<OrderResponse> placeOrder(@AuthenticationPrincipal User user,
			@RequestBody OrderRequest request) {
		OrderResponse response = orderService.placeOrder(user, request);
		return ResponseEntity.ok(response);
	}

	@GetMapping
	public ResponseEntity<List<OrderResponse>> getOrderHistory(@AuthenticationPrincipal User user) {
		List<OrderResponse> orders = orderService.getOrders(user);
		return ResponseEntity.ok(orders);
	}

	@GetMapping("/{id}")
	public ResponseEntity<OrderResponse> getOrder(@AuthenticationPrincipal User user,
			@PathVariable Long id) {
		OrderResponse response = orderService.getOrder(user, id);
		return ResponseEntity.ok(response);
	}

	@PutMapping("/{id}/status")
	public ResponseEntity<OrderResponse> updateOrderStatus(@AuthenticationPrincipal User user,
			@PathVariable Long id,
			@RequestParam String status) {
		OrderResponse response = orderService.updateOrderStatus(user, id, status);
		return ResponseEntity.ok(response);
	}
}
