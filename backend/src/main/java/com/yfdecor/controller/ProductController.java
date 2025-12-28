
package com.yfdecor.controller;

import com.yfdecor.dto.response.ProductResponse;
import com.yfdecor.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

	private final ProductService productService;

	@GetMapping
	public ResponseEntity<List<ProductResponse>> getProducts(
			@RequestParam Optional<String> category,
			@RequestParam Optional<String> search,
			@RequestParam(defaultValue = "1") int page,
			@RequestParam(defaultValue = "20") int limit
	) {
		return ResponseEntity.ok(productService.getAllProducts(category, search, page, limit));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
		return ResponseEntity.ok(productService.getProductById(id));
	}
}
