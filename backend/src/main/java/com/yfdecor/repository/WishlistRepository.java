
package com.yfdecor.repository;

import com.yfdecor.model.Product;
import com.yfdecor.model.User;
import com.yfdecor.model.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {
	List<WishlistItem> findByUser(User user);
	Optional<WishlistItem> findByUserAndProduct(User user, Product product);
	void deleteByUserAndProduct(User user, Product product);
}
