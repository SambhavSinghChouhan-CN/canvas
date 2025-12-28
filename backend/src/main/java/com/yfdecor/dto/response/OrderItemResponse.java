
package com.yfdecor.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {
	private Long id;
	private ProductResponse product;
	private Integer quantity;
	private Double price;
}
