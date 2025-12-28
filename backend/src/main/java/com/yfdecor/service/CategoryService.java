
package com.yfdecor.service;

import com.yfdecor.dto.response.CategoryResponse;
import com.yfdecor.model.Category;
import com.yfdecor.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

	private final CategoryRepository categoryRepository;

	public List<CategoryResponse> getAllCategories() {
		return categoryRepository.findAll().stream()
				.map(this::toResponse)
				.collect(Collectors.toList());
	}

	public CategoryResponse getCategoryBySlug(String slug) {
		Category category = categoryRepository.findBySlug(slug)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
		return toResponse(category);
	}

	private CategoryResponse toResponse(Category category) {
		return CategoryResponse.builder()
				.id(category.getId())
				.name(category.getName())
				.slug(category.getSlug())
				.description(category.getDescription())
				.imageUrl(category.getImageUrl())
				.build();
	}
}
