
package com.yfdecor.service;

import com.yfdecor.dto.response.CategoryResponse;
import com.yfdecor.dto.response.ProductResponse;
import com.yfdecor.model.Category;
import com.yfdecor.model.Product;
import com.yfdecor.repository.CategoryRepository;
import com.yfdecor.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

	private final ProductRepository productRepository;
	private final CategoryRepository categoryRepository;

	public List<ProductResponse> getAllProducts(Optional<String> categorySlug, Optional<String> search, int page, int limit) {
		Pageable pageable = PageRequest.of(page - 1, limit);
		Page<Product> products;
		if (categorySlug.isPresent()) {
			Category category = categoryRepository.findBySlug(categorySlug.get())
					.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
			products = productRepository.findByCategory(category, pageable);
		} else if (search.isPresent()) {
			products = productRepository.findByNameContainingIgnoreCase(search.get(), pageable);
		} else {
			products = productRepository.findAll(pageable);
		}
		return products.stream().map(this::toResponse).collect(Collectors.toList());
	}

	public ProductResponse getProductById(Long id) {
		Product product = productRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
		return toResponse(product);
	}

	private ProductResponse toResponse(Product product) {
		return ProductResponse.builder()
				.id(product.getId())
				.name(product.getName())
				.slug(product.getSlug())
				.description(product.getDescription())
				.imageUrl(product.getImageUrl())
				.stock(product.getStock())
				.price(product.getPrice())
				.discount(product.getDiscount())
				.category(CategoryResponse.builder()
						.id(product.getCategory().getId())
						.name(product.getCategory().getName())
						.slug(product.getCategory().getSlug())
						.description(product.getCategory().getDescription())
						.imageUrl(product.getCategory().getImageUrl())
						.build())
				.build();
	}
}
