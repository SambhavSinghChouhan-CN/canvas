
package com.yfdecor.repository;

import com.yfdecor.model.Order;
import com.yfdecor.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
	List<Order> findByUser(User user);
	Optional<Order> findByOrderNumber(String orderNumber);
	Optional<Order> findByIdAndUser(Long id, User user);
}
