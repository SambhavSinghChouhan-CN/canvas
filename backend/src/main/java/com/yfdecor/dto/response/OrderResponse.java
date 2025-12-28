
package com.yfdecor.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
	private Long id;
	private String orderNumber;
	private Double totalAmount;
	private Double deliveryCharge;
	private String status;
	private LocalDateTime createdAt;
	private List<OrderItemResponse> items;
	private AddressResponse address;
}
