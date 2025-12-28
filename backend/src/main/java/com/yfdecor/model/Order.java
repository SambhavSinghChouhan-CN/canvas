
package com.yfdecor.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(nullable = false, unique = true)
	private String orderNumber;

	@Column(nullable = false)
	private Double totalAmount;

	@Column(nullable = false)
	private Double deliveryCharge;

	@Column(nullable = false)
	private String status; // pending, confirmed, shipped, delivered

	@Column(nullable = false)
	private LocalDateTime createdAt;

	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<OrderItem> items;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "address_id")
	private Address address;
}
