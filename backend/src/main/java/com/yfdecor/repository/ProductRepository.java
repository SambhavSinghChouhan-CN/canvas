
package com.yfdecor.repository;

import com.yfdecor.model.Category;
import com.yfdecor.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
	Page<Product> findByCategory(Category category, Pageable pageable);
	Page<Product> findByNameContainingIgnoreCase(String search, Pageable pageable);
	Optional<Product> findById(Long id);
	Optional<Product> findBySlug(String slug);
}
